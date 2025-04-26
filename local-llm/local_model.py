from llama_cpp import Llama
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "llama.cpp", "models", "mistral-7b-instruct-v0.2.Q4_K_M.gguf")

llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=2048,
    n_threads=6,
)

def run_llm_chat(messages: list[dict[str, str]]) -> str:
    response = llm.create_chat_completion(
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
        stop=["</s>"],
    )
    return response["choices"][0]["message"]["content"]