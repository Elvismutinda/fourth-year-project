import os
import io
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import psycopg2
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import numpy as np

# Load environment variables
load_dotenv()

# Database connection
DB_URL = os.getenv("DATABASE_URL")

# Initialize Hugging Face embedding model
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Path to local PDFs
PDF_DIR = "output/acts"

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

def store_in_db(file_id, text, embedding):
    """Store extracted text and embedding into PostgreSQL."""
    try:
        conn = psycopg2.connect(dsn=DB_URL)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO klr_docs (file_id, content, embedding)
            VALUES (%s, %s, %s)
            ON CONFLICT (file_id) DO UPDATE
            SET content = EXCLUDED.content, embedding = EXCLUDED.embedding;
        """, (file_id, text, np.array(embedding).tolist()))
        conn.commit()
        cur.close()
        conn.close()
        print(f"Stored {file_id} successfully.")
    except Exception as e:
        print(f"Database error: {e}")

def process_local_pdfs():
    """Process all PDFs in the local folder and store embeddings."""
    for filename in os.listdir(PDF_DIR):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(PDF_DIR, filename)
            print(f"Processing {filename}...")
            
            text = extract_text(pdf_path)
            if text:
                embedding = model.encode(text)
                store_in_db(filename, text, embedding)
            else:
                print(f"Skipping {filename}, no text extracted.")

if __name__ == "__main__":
    process_local_pdfs()