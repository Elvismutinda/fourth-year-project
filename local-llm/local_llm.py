from local_model import run_llm_chat
from constants import SYSTEM_PROMPT

def draft_with_llm(document_type: str, field_details: dict[str, str]) -> str:
    fields_string = "\n".join([f"{k}: {v}" for k, v in field_details.items()])

    user_prompt = f"""
    Draft a {document_type} document template under Kenyan law.

    ### Field Details:
    {fields_string}

    If provided, use the details to generate a professional and legally accurate document.
    """

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]

    response = run_llm_chat(messages)
    return response