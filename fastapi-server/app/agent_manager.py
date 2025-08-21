import os
import json
import logging
from asyncio import Lock  
from urllib.parse import urlparse
from aiobotocore.session import get_session
from app.tools.member import Member
from langchain_core.messages import HumanMessage
from app.config.configs import LLM_WITH_STRUCTURE
from app.templates.prompt import STRUCTURED_SYSTEM_PROMPT
logger = logging.getLogger(__name__)

class AgentManager:
    _instance = None
    _lock = Lock()  # A lock to ensure the singleton instance is created only once
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    # A factory classmethod to handle asynchronous initialization
    @classmethod
    async def create(cls):
        """Asynchronously creates and initializes the singleton AgentManager instance."""
        async with cls._lock:
            if not hasattr(cls._instance, '_initialized') or not cls._instance._initialized:
                instance = cls()
                await instance._initialize()
                cls._instance = instance
        return cls._instance

    def __init__(self):
        """
        Lightweight, synchronous constructor.
        Heavy initialization is moved to the async _initialize method.
        """
        if not hasattr(self, '_initialized'):
            self.graphs = {}  # Cache for domain-specific graphs
            self.s3_client = None
            self._graph_build_lock = Lock()  # A lock to prevent concurrent builds for the SAME domain
            self._initialized = False

    async def _initialize(self):
        """Performs asynchronous initialization tasks."""
        logger.info("Initializing AgentManager for the first time...")
        self._validate_environment()
        
        # Create an async S3 client
        session = get_session()
        self.s3_client = await session.create_client("s3", region_name="ap-south-1").__aenter__()
        
        self._initialized = True
        logger.info("AgentManager initialized successfully.")

    def _validate_environment(self):
        required_vars = ["AWS_S3_BUCKET_NAME", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
        missing_vars = [var for var in required_vars if not os.environ.get(var)]
        if missing_vars:
            raise Exception(f"Missing required environment variables: {', '.join(missing_vars)}")
        self.s3_bucket = os.getenv("AWS_S3_BUCKET_NAME")

    def _get_key_name(self, url_string: str):
        if '://' not in url_string:
            url_string = '//' + url_string
        parsed_uri = urlparse(url_string)
        domain = parsed_uri.netloc
        if domain.startswith('www.'):
            domain = domain[4:]
        sanitized_domain = domain.replace('.', '_').replace('-', '_')
        return (domain, sanitized_domain)

    async def _get_description(self, sanitized_domainId: str) -> str:
        """Asynchronously gets the domain description from S3."""
        key = "mappingobject/mapping.json"
        try:
            response = await self.s3_client.get_object(Bucket=self.s3_bucket, Key=key)
            body = await response['Body'].read()
            mapping_data = json.loads(body.decode('utf-8'))
            logger.info("Loaded mapping.json from S3")
            return mapping_data.get(sanitized_domainId, "No description available")
        except self.s3_client.exceptions.NoSuchKey:
             logger.warning(f"mapping.json not found in bucket {self.s3_bucket}")
             return "No description available"
        except Exception as e:
            logger.warning(f"Could not load description for {sanitized_domainId}: {e}")
            return "No description available"

    async def get_graph_for_domain(self, domainId: str):
        """
        Asynchronously retrieves a compiled graph for a given domain,
        creating and caching it if it doesn't exist. This is now safe for concurrent async calls.
        """
        original_domain, sanitized_domain = self._get_key_name(domainId)

        if sanitized_domain not in self.graphs:
            # Use a lock to prevent multiple coroutines from building the same graph
            async with self._graph_build_lock:
                # Double-check if another coroutine built it while we were waiting for the lock
                if sanitized_domain not in self.graphs:
                    logger.info(f"Graph for domain '{sanitized_domain}' not in cache. Building now...")
                    description = await self._get_description(sanitized_domain)
                    
                    member_instance = Member(
                        domainId=original_domain,
                        modifiedId=sanitized_domain,
                        description=description
                    )
                    # _build_graph is now async and must be awaited
                    self.graphs[sanitized_domain] = await member_instance._build_graph()
                    logger.info(f"Successfully built and cached graph for '{sanitized_domain}'.")
        
        return self.graphs[sanitized_domain]

    async def invoke(self, question: str, thread_id: str, domainId: str = "felp") -> dict:
        """
        The main async entry point for processing a user request.
        """
        graph = await self.get_graph_for_domain(domainId)
        
        config = {"configurable": {"thread_id": thread_id}}
        initial_state = {
            "messages": [HumanMessage(content=question)]
        }

        # Use ainvoke for the asynchronous graph
        response = await graph.ainvoke(initial_state, config=config)
        print(response)

        if response and response.get("messages"):
            try:
                structured = json.loads(response['messages'][-1].content)
                return {"response": structured}
            except Exception as e:
                # print("Under exception")
                structured = LLM_WITH_STRUCTURE.invoke([STRUCTURED_SYSTEM_PROMPT,HumanMessage(content=response['messages'][-1].content)]) 
                strucutred_response = structured.model_dump_json(indent=2)
                # print(f"Structured ==================== {type(strucutred_response)}")
                return {"response": json.loads(strucutred_response)}
        else:
            return {"response": "I'm sorry, an error occurred during processing."}