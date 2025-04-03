# import os
# import io
# import json
# import fitz  # PyMuPDF
# import pytesseract
# from PIL import Image
# import numpy as np
# import psycopg2
# from sentence_transformers import SentenceTransformer
# from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
# import torch
# from dotenv import load_dotenv

# import re

# # Load environment variables
# load_dotenv()

# # Database connection
# DB_URL = os.getenv("DATABASE_URL")

# # Load embedding model
# embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# # Load LLM
# MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1"  # Update if needed
# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# model = AutoModelForCausalLM.from_pretrained(
#     MODEL_NAME,
#     torch_dtype=torch.float16,  # Use float16 for efficiency
#     device_map="auto"  # Automatically use GPU if available
# )

# def generate_summary(text, max_length=200, min_length=50):
#     prompt = f"Summarize the following legal text:\n\n{text}\n\nSummary:"
#     inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=4096)
#     outputs = model.generate(**inputs, max_new_tokens=max_length)
#     return tokenizer.decode(outputs[0], skip_special_tokens=True)

# def extract_text(pdf_path):
#     """Extract text from PDF, using OCR if needed."""
#     doc = fitz.open(pdf_path)
#     text = ""

#     for page in doc:
#         page_text = page.get_text()
#         if not page_text.strip():  # Use OCR if no text is found
#             pix = page.get_pixmap()
#             img = Image.open(io.BytesIO(pix.tobytes()))
#             page_text = pytesseract.image_to_string(img)
#         text += page_text + "\n"

#     return text.strip()

# def extract_issues(text):
#     """Extracts legal issues from case text using regex and summarization."""
#     issues_section = re.search(r"(Issues:|Key Issues:|Legal Issues:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
#     if issues_section:
#         return generate_summary(issues_section.group(2))
#     return "No explicit issues found."

# def extract_legal_principles(text):
#     """Extracts legal principles by identifying references to laws, doctrines, and precedents."""
#     principles_section = re.findall(r"(Principle:|Legal Principle:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
#     return " ".join([p[1].strip() for p in principles_section]) if principles_section else "No explicit legal principles found."

# def extract_ratio_decidendi(text):
#     """Extracts Ratio Decidendi by identifying key reasoning statements."""
#     ratio_section = re.search(r"(Ratio Decidendi:|Court's Reasoning:|Holding:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
#     if ratio_section:
#         return generate_summary(ratio_section.group(2))
#     return "No explicit ratio decidendi found."

# def extract_reasoning(text):
#     """Extracts extended judicial reasoning."""
#     reasoning_section = re.search(r"(Reasoning:|Analysis:|Discussion:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
#     if reasoning_section:
#         return generate_summary(reasoning_section.group(2))
#     return "No explicit reasoning found."

# def generate_embedding(text):
#     """Generates an embedding for the extracted text."""
#     return embedding_model.encode(text)

# def test_single_file(pdf_path):
#     """Test case law extraction and analysis on a single PDF."""
    
#     if not os.path.exists(pdf_path):
#         print(f"File not found: {pdf_path}")
#         return

#     print(f"\n🔍 Processing: {pdf_path}\n")
    
#     # Extract text
#     text = extract_text(pdf_path)
#     if not text:
#         print("❌ No text extracted. Skipping.")
#         return

#     # Extract legal components
#     issues = extract_issues(text)
#     legal_principles = extract_legal_principles(text)
#     ratio_decidendi = extract_ratio_decidendi(text)
#     reasoning = extract_reasoning(text)

#     # Generate embedding
#     embedding = generate_embedding(text)

#     # Print results
#     print("\n📜 **Extracted Information**")
#     print(f"\n🔹 **Issues:** {issues}")
#     print(f"\n🔹 **Legal Principles:** {legal_principles}")
#     print(f"\n🔹 **Ratio Decidendi:** {ratio_decidendi}")
#     print(f"\n🔹 **Reasoning:** {reasoning}")
#     print("\n✅ **Embedding Generated Successfully!**")

# if __name__ == "__main__":
#     # Specify a test PDF file here
#     test_pdf_path = "./output/case_laws/Agani v Republic (Criminal Appeal 2of2022) 2024KEHC2892(KLR) (18March2024) (Judgment).pdf"
    
#     # Run test
#     test_single_file(test_pdf_path)


import os
import io
import json
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import numpy as np
import psycopg2
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from dotenv import load_dotenv

import re

# Load environment variables
load_dotenv()

# Database connection
DB_URL = os.getenv("DATABASE_URL")

# Load embedding model
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Load summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def extract_text(pdf_path):
    """Extract text from PDF, using OCR if needed."""
    doc = fitz.open(pdf_path)
    text = ""

    for page in doc:
        page_text = page.get_text()
        if not page_text.strip():  # Use OCR if no text is found
            pix = page.get_pixmap()
            img = Image.open(io.BytesIO(pix.tobytes()))
            page_text = pytesseract.image_to_string(img)
        text += page_text + "\n"

    return text.strip()



def generate_embedding(text):
    """Generates an embedding for the extracted text."""
    return embedding_model.encode(text)

def test_single_file(pdf_path):
    """Test case law extraction and analysis on a single PDF."""
    
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return

    print(f"\n🔍 Processing: {pdf_path}\n")
    
    # Extract text
    text = extract_text(pdf_path)
    if not text:
        print("❌ No text extracted. Skipping.")
        return
    
    print("\n📜 **Extracted Raw Text:**\n")
    print(text[:2000])  # Print first 2000 characters for readability

    # Extract legal components
    issues = extract_issues(text)
    legal_principles = extract_legal_principles(text)
    ratio_decidendi = extract_ratio_decidendi(text)
    reasoning = extract_reasoning(text)

    # Generate embedding
    embedding = generate_embedding(text)

    # Print results
    print("\n📜 **Extracted Information**")
    print(f"\n🔹 **Issues:** {issues}")
    print(f"\n🔹 **Legal Principles:** {legal_principles}")
    print(f"\n🔹 **Ratio Decidendi:** {ratio_decidendi}")
    print(f"\n🔹 **Reasoning:** {reasoning}")
    print("\n✅ **Embedding Generated Successfully!**")
    
    # Print part of the embedding vector for verification
    print("\n🧠 **Generated Embedding (First 10 Dimensions):**\n")
    print(embedding[:10])  # Print first 10 dimensions for readability
    
if __name__ == "__main__":
    # Specify a test PDF file here
    test_pdf_path = "./output/case_laws/Agani v Republic (Criminal Appeal 2of2022) 2024KEHC2892(KLR) (18March2024) (Judgment).pdf"

    # Run test
    test_single_file(test_pdf_path)