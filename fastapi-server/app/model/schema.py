from typing import List
from pydantic import BaseModel
    
from typing import List, Optional, Dict, Union
from pydantic import BaseModel, Field

class ChainOutput(BaseModel):
    """
    A class model for representing chain outputs.

    Attributes:
        chain_as_tools (list): List of chain tool objects
    """

    chain_as_tools: list = []
    
class DynamicItem(BaseModel):
    name: str = Field(
        ...,
        description="Name or title of the item. This should be directly extracted from the context (e.g., car name, event title, property name)."
    )
    image_url: Optional[str] = Field(
        None,
        description="URL of the image representing the item. If no image is available in the context, use N/A"
    )
    domain_url: Optional[str] = Field(
        None,
        description="Source domain or webpage URL where the item was listed or referenced (e.g., 'https://motorsfinder.ai'). Use only if explicitly provided in the context."
    )
    description_of_attributes: Optional[str] = Field(
        None,
        description="Natural language summary of key attributes relevant to the item, extracted **verbatim or paraphrased** from the context. Include flexible features such as price, location, mileage, number of bedrooms, fuel type, event date, etc. This must be human-readable and informative, without introducing any additional knowledge."
    )

class StructuredResponse(BaseModel):
    """
    Final structured response object for the AI output. This schema must be used as the output format.
    All values must be extracted only from the context provided to the agent. **Do not use any prior model knowledge**.
    Do not hallucinate or invent details, and do not suggest next actions or follow-ups if context is unrelated or insufficient.
    """
    content: str = Field(
        ...,
        description="A concise, context-driven summary answer to the user query. Use natural language. **Only use context provided via tools or documents**. Do not rely on external knowledge or assumptions."
    )
    items: List[DynamicItem] = Field(
        ...,
        description="List of contextually relevant items found in the retrieved information. Include only items that have explicit relevance to the user's query. If no such items are present, return an empty list (`[]`)."
    )
