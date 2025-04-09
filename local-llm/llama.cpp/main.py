import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llama_cpp import Llama
from fastapi.middleware.cors import CORSMiddleware

# Initialize the app
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

# Initialize Llama model
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)

print("Context size:", llm.context_params.n_ctx)

SYSTEM_PROMPT = """You are Intelaw, an advanced AI legal research assistant specializing in Kenyan case law and legal statutes.
Provide responses strictly based on legal documents, case law, and acts available in the system.
Maintain a formal, clear, and professional tone.
Utilize previous chat history to maintain context.
Extract relevant case law and legal provisions from available sources.
Summarize legal judgments and statutes upon request.
Provide definitions and legal interpretations within the scope of Kenyan law.
If specific case law or legal provisions are not in your dataset, you must clarify that you cannot provide a definitive answer."""

class ChatRequest(BaseModel):
    query: str
    additional_context: str = None

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        print(f"Received request: {request}")  # Log the incoming request
        # Form the prompt with the system message and query

        messages=[
            {"role": "system", "content": SYSTEM_PROMPT}
            # {"role": "user", "content": f"{request.query}"},
        ]
        
        # Append context as another message if provided
        if request.additional_context:
            messages.append({
                "role": "system",
                "content": f"Relevant Document Context:\n{request.additional_context}"
            })
            
        messages.append({
            "role": "user",
            "content": request.query
        })
        
        # if request.additional_context:
        #     prompt += f"\nContext: {request.additional_context}"

        # Generate the response from the LLaMA model
        response = llm.create_chat_completion(
            messages=messages,
            # max_tokens=512,
            temperature=0.7,
            stream=False,
        )
        

        response_text = response['choices'][0]['message']['content']

        print(f"Response: {response_text}")  # Log the response from Llama
        return {"response": response_text}
        

    
    except Exception as e:
        print(f"Error during inference: {e}")
        raise HTTPException(status_code=500, detail=f"Error during inference: {str(e)}")