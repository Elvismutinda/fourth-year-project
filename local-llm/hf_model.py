import requests

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
HF_TOKEN = "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"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def run_hf_chat(messages: list[dict[str, str]]) -> str:
    # Build prompt from chat messages
    prompt = ""
    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "user":
            prompt += f"User: {content}\n"
        elif role == "assistant":
            prompt += f"Assistant: {content}\n"
        elif role == "system":
            prompt += f"{content}\n"
    prompt += "Assistant:"

    # Send request to Hugging Face Inference API
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()  # Raise an error for bad responses
    result = response.json()

    # Extract generated assistant response
    generated_text = result[0]["generated_text"]
    final_response = generated_text.split("Assistant:")[-1].strip()
    return final_response