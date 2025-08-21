from fastapi import APIRouter, Depends, Request, HTTPException, status, Query
from typing import Optional, Any, Dict, List, Union
from app.limiter import limiter
from pymongo.errors import BulkWriteError
from ..utils.ai_message_parser import format_agent_response
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.server import get_db
# from app.graph import FelpAgent
import json
import uuid
# import logging



router = APIRouter()

@router.get("/chat")
async def search(
    request: Request,
    search: Optional[str] = Query(None, description="Search query"),
    domain: Optional[str] = Query(None, description="Website domains")):
    try:

      conversation_id = uuid.uuid4()

      agent_manager = request.app.state.agent_manager
      response = await agent_manager.invoke(
            domainId=domain,
            question=search,
            thread_id=conversation_id
        )      

      return {"success": True, "botresponse": response}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unexpected error occurred") 

@router.post(
    "/bulk_ingest",
    status_code=status.HTTP_201_CREATED,
    summary="Bulk‐dump arbitrary JSON docs into raw_centralized",
    description="""
Accepts either a single JSON object or a list of objects.
Each object **must** include a `metadata` field.
"""
)
async def bulk_ingest(
    payload: Union[Dict[str, Any], List[Dict[str, Any]]],
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    # Normalize to list
    docs = payload if isinstance(payload, list) else [payload]

    sanitized = []
    for i, doc in enumerate(docs):
        # Basic shape checks
        if not isinstance(doc, dict):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Item at index {i} is not a JSON object."
            )
        if "metadata" not in doc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Missing 'metadata' in item at index {i}."
            )

        # Sanitize incoming _id if present
        if "_id" in doc:
            incoming = doc["_id"]
            if isinstance(incoming, dict) and "$oid" in incoming:
                try:
                    doc["_id"] = ObjectId(incoming["$oid"])
                except Exception as e:
                    print(f"Invalid $oid at index {i}: {incoming['$oid']}, removing _id. Error: {e}")
                    del doc["_id"]
            else:
                # any other non-ObjectId _id, drop it
                if not isinstance(incoming, ObjectId):
                    print(f"Dropping non-ObjectId _id at index {i}: {incoming}")
                    del doc["_id"]

        sanitized.append(doc)

    # Bulk insert
    try:
        result = await db["raw_centralized"].insert_many(sanitized)
    except BulkWriteError as bwe:
        print("Bulk write error:", bwe.details)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to bulk insert documents."
        )
    except Exception as e:
        print("Unexpected error during bulk insert:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )

    inserted_ids = [str(_id) for _id in result.inserted_ids]
    print(f"Inserted {len(inserted_ids)} documents into raw_centralized:", inserted_ids)
    return {
        "inserted_count": len(inserted_ids),
        "inserted_ids": inserted_ids
    }
      
