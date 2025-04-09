import os
from fastapi import FastAPI, Body
from llama_cpp import Llama
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows all origins (you can restrict this to specific domains like ["http://localhost:3000"] for better security)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Path to your model file
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mistral-7b-openorca.Q4_K_M.gguf")

llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=4096,
    n_threads=8,
    n_batch=128,
    verbose=True,
)

@app.post("/draft")
def draft_legal_doc(payload: dict = Body(...)):
    document_type = payload.get("document_type", "Legal Document")
    instructions = payload.get("instructions", "Use Kenyan legal language and format.")
    inputs = payload.get("inputs", {})
    
    # Build structured prompt
    prompt = f"""You are a legal expert drafting a {document_type} under Kenyan law.

Instructions:
{instructions}

Inputs:
{inputs}

Output:
Draft the full {document_type} below.
"""

    output = llm(prompt, max_tokens=2048, stop=["</s>"])
    return {"document": output["choices"][0]["text"]}