from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

from draft import draft_with_llm
from hf_model import run_hf_chat

app = FastAPI()

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://intelaw.vercel.app"],
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
        # Just log and pass through messages
        print("Received messages:")
        for msg in request.messages:
            print(f"{msg['role']}: {msg['content']}")

        response = run_hf_chat(request.messages)
        return {"response": response}
    except Exception as e:
        print("Error during chat:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate chat response")
    
class EmbeddingRequest(BaseModel):
    text: str

@app.post("/embed")
async def embed_text(request: EmbeddingRequest):
    try:
        cleaned_text = request.text.strip().replace("\n", " ")
        if not cleaned_text:
            raise HTTPException(status_code=400, detail="Empty text provided")

        embedding = embedding_model.encode(cleaned_text, normalize_embeddings=True)
        return {"embedding": embedding.tolist()}
    except Exception as e:
        print("Error generating embedding:", str(e))
        raise HTTPException(status_code=500, detail="Embedding generation failed")
