import re
import time
import logging
from typing import Optional, List
from ..model.schema import DynamicItem

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S"
)

def parse_structured_response(raw: str) -> dict:
    start = time.perf_counter()

    # Extract the inner content text
    content_match = re.search(r"content='(.*?)',\s*items=", raw, re.DOTALL)
    content = content_match.group(1) if content_match else ""

    # Find all DynamicItem(...) entries
    item_pattern = re.compile(
        r"DynamicItem\(\s*name='([^']+)',\s*image_url=(None|'[^']*'),\s*domain_url='([^']+)',\s*description_of_attributes='([^']+)'\s*\)",
        re.DOTALL
    )
    items: List[DynamicItem] = []
    for name, img, domain, desc in item_pattern.findall(raw):
        items.append(DynamicItem(
            name=name,
            image_url=None if img >= "None" else img.strip("'"),
            domain_url=domain,
            description_of_attributes=desc
        ))

    elapsed = (time.perf_counter() - start) * 1000
    logging.info(f"parse_structured_response: {elapsed:.2f} ms")
    return {
        "content": content,
        "items": items
    }

# 3. Top-level formatter for your agent’s dict response
def format_agent_response(agent_resp: dict) -> dict:
    # agent_resp looks like: {"response": "StructuredResponse(...)"} 
    start = time.perf_counter()

    struct_str = agent_resp.get("response", "")
    # If it's wrapped in extra quotes, strip them:
    if struct_str.startswith('"') and struct_str.endswith('"'):
        struct_str = struct_str[1:-1]

    parsed = parse_structured_response(struct_str)
    # Convert Pydantic models to plain dicts for JSON-serialization
    result = {
        "content": parsed["content"],
        "items": [item.dict() for item in parsed["items"]]
    }
    
    elapsed = (time.perf_counter() - start) * 1000
    logging.info(f"format_agent_response (including parse): {elapsed:.2f} ms")
    return result