from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from local_llm import draft_with_llm  # Your custom LLM call logic
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DraftRequest(BaseModel):
    documentType: str
    fieldDetails: dict[str, str]

@app.post("/draft")
async def draft_document(request: DraftRequest):
    try:
        document = draft_with_llm(request.documentType, request.fieldDetails)
        return {"document": document}
    except Exception as e:
        print("Error generating document:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate document")

class ChatRequest(BaseModel):
    messages: list[dict[str, str]]
    
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        from local_model import run_llm_chat
        response = run_llm_chat(request.messages)
        return {"response": response}
    except Exception as e:
        print("Error during chat:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate chat response")