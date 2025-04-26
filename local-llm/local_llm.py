from local_model import run_llm_chat  # however your local LLM is invoked

SYSTEM_PROMPT = """You are Intelaw, an advanced AI legal research assistant specializing in Kenyan case law and legal statutes.
Provide responses strictly based on legal documents, case law, and acts available in the system.
Maintain a formal, clear, and professional tone.
Utilize previous chat history to maintain context.
Extract relevant case law and legal provisions from available sources.
Summarize legal judgments and statutes upon request.
Provide definitions and legal interpretations within the scope of Kenyan law.
If specific case law or legal provisions are not in your dataset, you must clarify that you cannot provide a definitive answer."""

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