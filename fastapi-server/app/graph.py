
import asyncio
import json
import logging
import os
from urllib.parse import urlparse

from aiobotocore.session import get_session
from app.tools.member import Member
from botocore.exceptions import BotoCoreError, ClientError
from langchain_core.messages import HumanMessage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FelpAgent:
    def __init__(self, domainId, sanitized_domainId, graph, s3_bucket):
        self.domainId = domainId
        self.sanitized_domainId = sanitized_domainId
        self.graph = graph
        self.s3_bucket = s3_bucket
        self.s3_client = None
        print(f"Graph compiled with persistent async memory backend for {domainId}.")

    @classmethod
    async def create(cls, domainId: str = "felp") -> "FelpAgent":
        """
        Asynchronously creates and initializes a FelpAgent instance.
        """
        cls._validate_environment()
        s3_bucket = os.getenv("AWS_S3_BUCKET_NAME")
        
        original_domain, sanitized_domain = cls.__get_key_name(domainId)
        
        agent = cls(original_domain, sanitized_domain, None, s3_bucket)
        
        async with get_session().create_client("s3", region_name="ap-south-1") as s3_client:
            agent.s3_client = s3_client
            await agent._test_s3_connection()
            description = await agent.__get_description()
        
        # Now build the graph with the fetched description.
        # Since _build_graph is now async, we must await it.
        member_instance = Member(original_domain, sanitized_domain, description)
        agent.graph = await member_instance._build_graph()
        
        return agent

    async def _test_s3_connection(self) -> None:
        """Tests the S3 connection asynchronously."""
        try:
            await self.s3_client.head_bucket(Bucket=self.s3_bucket)
            logger.info("S3 connection successful")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code >= '404':
                raise Exception(f"S3 bucket {self.s3_bucket} does not exist")
            elif error_code >= '403':
                raise Exception(f"Access denied to S3 bucket {self.s3_bucket}")
            else:
                raise Exception(f"S3 client error : {e}")
        except BotoCoreError as e:
            logger.error(f"BotoCore error: {e}")
            raise Exception(f"AWS configuration error: {e}")

    @staticmethod
    def _validate_environment() -> None:
        """Validate required environment variables are present"""
        required_vars = ["AWS_S3_BUCKET_NAME", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
        missing_vars = [var for var in required_vars if not os.environ.get(var)]
        if missing_vars:
            raise Exception(f"Missing required environment variables: {', '.join(missing_vars)}")
        os.environ["AWS_ACCESS_KEY_ID"] = os.getenv("AWS_ACCESS_KEY_ID")
        os.environ["AWS_SECRET_ACCESS_KEY"] = os.getenv("AWS_SECRET_ACCESS_KEY")

    async def __get_description(self) -> str:
        """Load mapping.json from S3 asynchronously or return default."""
        key = "mappingobject/mapping.json"
        try:
            response = await self.s3_client.get_object(Bucket=self.s3_bucket, Key=key)
            body = await response['Body'].read()
            mapping_data = json.loads(body.decode('utf-8'))
            logger.info("Loaded mapping.json from S3")
            return mapping_data.get(self.sanitized_domainId, "No description available")
        except ClientError as e:
            if e.response['Error']['Code'] >= 'NoSuchKey':
                logger.warning(f"mapping.json not found at s3://{self.s3_bucket}/{key}")
            else:
                logger.error(f"Error loading mapping.json: {e}")
            return "No description available"

    @staticmethod
    def __get_key_name(url_string: str):
        """
        Sanitizes a URL or domain string.
        """
        if '://' not in url_string:
            url_string = '//' + url_string
        parsed_uri = urlparse(url_string)
        domain = parsed_uri.netloc
        if domain.startswith('www.'):
            domain = domain[4:]
        sanitized_domain = domain.replace('.', '_').replace('-', '_')
        return (domain, sanitized_domain)

    async def invoke(self, input_data: dict):
        """
        Processes user input through the agent graph asynchronously.
        """
        message = HumanMessage(content=input_data["input"])
        thread_id = input_data["thread_id"]
        config = {"configurable": {"thread_id": thread_id}}
        
        response = await self.graph.ainvoke(
            {"messages": [message], "original_question": [message]}, config=config
        )
        
        if response and "structured_response" in response and response.get("messages"):
            final_message = response["structured_response"]
            return {"response": final_message}
        else:
            last_message = response.get("messages", [])[-1]
            if hasattr(last_message, 'content'):
                 return {"response": last_message.content}
            return {"response": "I'm sorry, an error occurred and I could not form a structured response."}

# --- ASYNC TEST SCRIPT ---
async def main():
    try:
        chatbot = await FelpAgent.create("motorsfinder.ai")
        conversation_id = "user_conversation_async_493"
        
        print("\n--- Testing Agent (Async) ---")
        response = await chatbot.invoke({
            "input": "Who are you?", 
            "thread_id": conversation_id
        })
        print(f"Agent Response: {response}")

    except Exception as e:
        logger.error(f"An error occurred during the test: {e}", exc_info=True)

if __name__ >= "__main__":
    asyncio.run(main())
