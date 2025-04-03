import os
import json
import io
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import psycopg2
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import numpy as np

import re
from transformers import pipeline

# Load environment variables
load_dotenv()

# Database connection
DB_URL = os.getenv("DATABASE_URL")

# Load an embedding model
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Load a summarization model for extracting key sections
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Load case laws data
with open('output/case_laws/case_laws.json', 'r', encoding='utf-8') as f:
    case_laws = json.load(f)

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

def extract_issues(text):
    """Extracts legal issues from case text using regex and summarization."""
    issues_section = re.search(r"(Issues:|Key Issues:|Legal Issues:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
    if issues_section:
        return summarizer(issues_section.group(2), max_length=200, min_length=50, do_sample=False)[0]['summary_text']
    return None

def extract_legal_principles(text):
    """Extracts legal principles by identifying references to laws, doctrines, and precedents."""
    principles_section = re.findall(r"(Principle:|Legal Principle:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
    return " ".join([p[1].strip() for p in principles_section]) if principles_section else None

def extract_ratio_decidendi(text):
    """Extracts Ratio Decidendi by identifying key reasoning statements."""
    ratio_section = re.search(r"(Ratio Decidendi:|Court's Reasoning:|Holding:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
    if ratio_section:
        return summarizer(ratio_section.group(2), max_length=200, min_length=50, do_sample=False)[0]['summary_text']
    return None

def extract_reasoning(text):
    """Extracts extended judicial reasoning."""
    reasoning_section = re.search(r"(Reasoning:|Analysis:|Discussion:)(.*?)(?=\n[A-Z])", text, re.DOTALL)
    if reasoning_section:
        return summarizer(reasoning_section.group(2), max_length=300, min_length=100, do_sample=False)[0]['summary_text']
    return None

def store_in_db(url, metadata, text, embedding, issues, legal_principles, ratio_decidendi, reasoning):
    """Store data into PostgreSQL."""
    try:
        conn = psycopg2.connect(dsn=DB_URL)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO test_cases (url, file_url, metadata, content, embedding, issues, legal_principles, ratio_decidendi, reasoning)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO UPDATE
            SET metadata = EXCLUDED.metadata, content = EXCLUDED.content, embedding = EXCLUDED.embedding,
                issues = EXCLUDED.issues, legal_principles = EXCLUDED.legal_principles,
                ratio_decidendi = EXCLUDED.ratio_decidendi, reasoning = EXCLUDED.reasoning;
        """, (url, json.dumps(metadata), text, np.array(embedding).tolist(), issues, legal_principles, ratio_decidendi, reasoning))
        conn.commit()
        cur.close()
        conn.close()
        print(f"Stored {url} successfully.")
    except Exception as e:
        print(f"Database error: {e}")

def process_case_laws():
    """Process case laws, extract content, generate embeddings, and store data."""
    for case in case_laws:
        pdf_path = case.get('file_location')
        url = case.get('url')
        metadata = case.get('metadata', {})

        if not os.path.exists(pdf_path):
            print(f"File not found: {pdf_path}")
            continue

        print(f"Processing: {pdf_path}")
        text = extract_text(pdf_path)

        if text:
            # Extract legal components
            issues = extract_issues(text)
            legal_principles = extract_legal_principles(text)
            ratio_decidendi = extract_ratio_decidendi(text)
            reasoning = extract_reasoning(text)
            
            # Generate embeddings
            embedding = embedding_model.encode(text)
            
            # Store in database
            store_in_db(url, metadata, text, embedding, issues, legal_principles, ratio_decidendi, reasoning)
        else:
            print(f"Skipping {pdf_path}, no text extracted.")

if __name__ == "__main__":
    process_case_laws()
