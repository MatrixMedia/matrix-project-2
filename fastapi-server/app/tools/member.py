import os
from typing import Annotated, Optional

import aiosqlite  # <-- Import aiosqlite
from app.config.configs import (BEDROCK_REGION_NAME, KNOWLEDGE_BASE_ENDPOINT,
                                LLM, POSTGRES_MEMORY_CHECKPOINT)
from app.model.schema import ChainOutput, StructuredResponse
from app.templates.prompt import SYSTEM_PROMPT
from langchain_aws.retrievers import AmazonKnowledgeBasesRetriever
from langchain_core.documents import Document
from langchain_core.tools import tool
# Use async checkpointers
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
# from langgraph.checkpoint.base import AsyncCheckpointer
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import SystemMessage
from langchain_core.output_parsers.pydantic import PydanticOutputParser
class Member:
    def __init__(self, domainId:str, modifiedId:str, description:str):
        self.tools=[]
        self.domainId = domainId
        self.modifiedId = modifiedId
        self.description = description
        self.system_prompt = SYSTEM_PROMPT.format(
            domain_name=self.domainId,
            description=(desc := self.description) or "No description available for this site"
        )
        print(f"Prompt >>>>>>> {self.system_prompt}")
        self.__get_tools()

    def _format_docs(self, docs: list[Document]) -> str:
        """
        Formats documents into a single string, including content and an image URL,
        and filters by relevance score.
        """
        print("--- Formatting documents with images ---")
        if not docs:
            return "No relevant documents found."
        formatted_blocks = []
        for i, doc in enumerate(docs):
            # A lower score is better for Bedrock retrievers. Adjust threshold as needed.
            if doc.metadata.get('score') < 0.2:
                continue
            image_url = self._extract_image_url(doc)
            block = (
                f"--- Retrieved Document {i+1} ---\n"
                f"Content: {doc.page_content}\n"
                f"Associated Image URL: {image_url if image_url else 'N/A'}"
            )
            formatted_blocks.append(block)
        if not formatted_blocks:
            return "No documents passed the relevance score threshold."
        return "\n\n".join(formatted_blocks)

    def __get_tools(self):
        """
        Load and configure tools from configuration settings.
        This method creates and adds the asynchronous retriever tool.
        """
        chains = self._create_retriever_tool()
        self.tools += chains.chain_as_tools

    def _extract_image_url(self, doc: Document) -> Optional[str]:
        """Safely extracts an image URL from a document's metadata with priority."""
        source_meta = doc.metadata.get('source_metadata')
        if not source_meta:
            return None
        images = source_meta.get('images')
        if images and isinstance(images, list) and len(images) > 0:
            return images[0]
        fav_image = source_meta.get('fav_image')
        if fav_image and isinstance(fav_image, str):
            return fav_image
        return None

    def _create_retriever_tool(self):
        chain_as_tool=[]
        
        @tool(name_or_callable="rag_knowledge_base",description="Always use this tool for general, descriptive, or conceptual questions about the company, its products, policies, or services. "
            "For example: 'Tell me about the Hyundai Creta', 'What are the safety features?', 'What is the company's return policy?'. "
            "Do NOT use this for specific data lookups that involve filtering by price, counting items, or listing multiple items based on specific criteria.This is a company specific knowledgebase for RAG.")
        async def rag_knowledge_base(question:Annotated[str,"The formulated question from conversation history to be asked in the knowledgebase for better semantic search."],k:Annotated[int,"Specific number of results that was asked by user. If user didn't specifiy anything then it will default to 3"]) -> str:
            """Uses the internal knowledge base to answer domain-specific questions asynchronously.
            Args:
                question (str): The questions to be asked in the knowledgebase
                k(int): Specific number of results that was asked by user. If user didn't specifiy anything then it will default to 3.
            Return:
                str: Answer of the question
            """
            print(f">>>>>>> under async rag_tool <<<<<<")
            print(f"Question: >>> {question}")
            print(f"Number of results (k): {k}")
            
            k = int(k) if k else 3
            retriever = self.__create_retriever(k)
            print("--- Invoking Bedrock Knowledge Base retriever... ---")
            relevant_docs = await retriever.ainvoke(question)
            print(f"--- Retriever invocation successful. Found {len(relevant_docs)} documents. ---")
            
            context = self._format_docs(relevant_docs)
            print(f"Context: {context}")

            return f"Context : {context}"

        chain_as_tool.append(rag_knowledge_base)
        return ChainOutput(
            chain_as_tools=chain_as_tool
        )

    # Make this method async to handle async connection creation
    async def _build_graph(self):
        """
        Builds the ReAct agent graph with an async-compatible checkpoint memory and system prompt.
        """
        # checkpointer: AsyncCheckpointer
        if os.environ.get("ENV")>="DEV":
            db_file = f"app/checkpoints/checkpoints_{self.domainId}.sqlite"
            # aiosqlite.connect() returns a coroutine. We must await it to get the connection object.
            conn = await aiosqlite.connect(db_file)
            # Now pass the actual connection object to the saver.
            checkpointer = AsyncSqliteSaver(conn=conn)
        else:
            # from_conn_string for Postgres handles its connection pooling internally and returns a ready instance.
            checkpointer = AsyncPostgresSaver.from_conn_string(POSTGRES_MEMORY_CHECKPOINT)
        return create_react_agent(
            LLM.bind_tools(self.tools),
            tools=self.tools,
            checkpointer=checkpointer, 
            prompt=SystemMessage(content=self.system_prompt)) 
# ,response_format=StructuredResponse
    def __create_retriever(self, k:int):
        """Creates the AmazonKnowledgeBasesRetriever instance."""
        retrieval_config = {
            "vectorSearchConfiguration": {
                "numberOfResults": k
            }
        }

        if self.domainId != "felp":
            retrieval_config["vectorSearchConfiguration"]["filter"] = {
                "equals": {"key": "domain_id", "value": self.modifiedId}
            }

        retriever = AmazonKnowledgeBasesRetriever(
            knowledge_base_id=KNOWLEDGE_BASE_ENDPOINT,
            retrieval_config=retrieval_config,
            region_name=BEDROCK_REGION_NAME
        )
        return retriever