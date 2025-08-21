from dotenv import load_dotenv
load_dotenv()
from langchain_openai import ChatOpenAI 
import os 
from app.model.schema import StructuredResponse
LLM = ChatOpenAI(model="gpt-4.1-mini",api_key=os.environ["OPENAI_API_KEY"],temperature=0)
LLM_WITH_STRUCTURE = LLM.with_structured_output(StructuredResponse,method="json_schema")
RAG_TOP_K=int(os.environ.get('OPTIONAL_RAG_TOP_K') if os.environ.get('OPTIONAL_RAG_TOP_K') else 5)
RETRIEVAL_SCORE_THRESHOLD=float(os.environ.get('OPTIONAL_RETRIEVAL_SCORE_THRESHOLD') if os.environ.get('OPTIONAL_RETRIEVAL_SCORE_THRESHOLD') else 0.5)
# Knowledge base Configs
KNOWLEDGE_BASE_ENDPOINT=os.environ.get('AWS_BEDROCK_KNOWLEDGE_BASE_ENDPOINT')
# Memory checkpoint postgres
POSTGRES_MEMORY_CHECKPOINT=os.environ.get('POSTGRES_MEMORY_CHECKPOINT')
BEDROCK_REGION_NAME = os.environ.get('BEDROCK_REGION')
REWRITE_LIMIT = 1
