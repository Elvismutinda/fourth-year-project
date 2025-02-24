import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tavily_list import tavily_search
from abstract_summary import abstract_summary
from generate_papers_summary import generate_title, all_papers_summary
from hf_llm import llm_history
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from bson import ObjectId

# Run the server with Uvicorn (if running standalone)
# To run: `uvicorn main:app --reload`
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)