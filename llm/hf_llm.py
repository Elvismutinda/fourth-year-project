import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

# The LLM model
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

client = InferenceClient(api_key=HUGGINGFACE_API_TOKEN)

system_prompt_content = f"""
You are Intelaw, an advanced AI legal research assistant specializing in Kenyan case law and legal statutes. Your primary function is to assist legal professionals by providing accurate, concise, and relevant legal information.

### Role:
- Your expertise is in Kenyan law, case law, legal acts, and legal reasoning.
- You help users find legal precedents, summarize case law, and explain legal principles.
- You provide responses based strictly on the legal documents, case law, and acts available in the system.

### Data Access:
- Your responses are derived from stored Kenyan case law and legal acts.
- You should cite case laws and legal provisions where applicable.
- If the requested information is outside your dataset, inform the user and suggest alternative sources.

### Tone & Style:
- Maintain a formal, clear, and professional tone.
- Avoid speculative legal advice; provide well-supported responses.
- Ensure that explanations are precise and legally sound.

### Capabilities:
- Utilize previous chat history to maintain context.
- Extract relevant case law and legal provisions from available sources.
- Summarize legal judgments and statutes upon request.
- Provide definitions and legal interpretations within the scope of Kenyan law.

### Limitations:
- You do not provide personal legal advice.
- If specific case law or legal provisions are not in your dataset, you must clarify that you cannot provide a definitive answer.
"""

def llm(content, role="user"):
    """
    Send a single query to the legal AI model and retrieve its response.

    Parameters:
        content (str): The message content to send to the model (typically a user query or instruction).
        role (str, optional): The role of the message sender (e.g., "user", "assistant").
                              Defaults to "user".

    Returns:
        str: The concatenated response based on Kenyan legal sources.
    
    Usage Example:
        response = llm("What is the legal definition of self-defense in Kenya?")
        print(response)
    """
    full_content = "".join(
        message.choices[0].delta.content for message in client.chat_completion(
            model="meta-llama/Llama-3.2-3B-Instruct",
            messages=[
                {"role": "system", "content": system_prompt_content},
                {"role": role, "content": content}
            ],
            max_tokens=1500,
            stream=True,
        )
    )
    return full_content

def llm_history(*messages):
    """
    Send a conversation history to the Llama 3.2 model and retrieve its response.

    This function allows you to pass multiple messages (each represented as a dictionary with keys "role"
    and "content") to simulate a conversation history. It prepends the conversation with the predefined
    system prompt and then streams the model's response, concatenating the streamed tokens into a final string.

    Parameters:
        *messages: Variable length argument list, where each argument is a dictionary with:
            - "role": The role of the message sender (e.g., "user", "assistant").
            - "content": The text content of the message.
        
    Returns:
        str: The concatenated response based on Kenyan legal sources and previous conversation history.
    
    Usage Example:
        # Define the conversation history
        history = [
            {"role": "user", "content": "What is the principle of stare decisis in Kenyan law?"},
            {"role": "assistant", "content": "The principle of stare decisis is a fundamental concept in common law legal systems..."}
            {"role": "user", "content": "How does stare decisis apply in the Kenyan judicial system?"}
        ]
        # Get response based on the conversation history
        response = llm_history(*history)
        print(response)
    """
    message_list = [{"role": msg["role"], "content": msg["content"]} for msg in messages]

    full_content = "".join(
        message.choices[0].delta.content for message in client.chat_completion(
            model="meta-llama/Llama-3.2-3B-Instruct",
            messages=[{"role": "system", "content": system_prompt_content}] + message_list,
            max_tokens=1500,
            stream=True,
        )
    )
    return full_content

# Example usage:
print(llm("Give details on this case: VICTOR OKUMU OKWATCHO vs ATTORNEY GENERAL [2002] KEHC 1267 (KLR)"))
