import os
import fitz  # PyMuPDF
import pdfplumber
import pandas as pd
from tqdm import tqdm

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using PyMuPDF and fallback to pdfplumber."""
    text = ""
    
    try:
        # Try extracting using PyMuPDF
        doc = fitz.open(pdf_path)
        text = "\n".join([page.get_text("text") for page in doc])
        
        # If PyMuPDF extraction fails, try pdfplumber
        if not text.strip():
            with pdfplumber.open(pdf_path) as pdf:
                text = "\n".join([page.extract_text() or "" for page in pdf.pages])
    
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")
    
    return text.strip()

def process_pdfs_in_folder(folder_path, output_csv):
    """Processes all PDFs in a folder and saves extracted text to a CSV file."""
    pdf_files = [f for f in os.listdir(folder_path) if f.endswith(".pdf")]
    data = []

    for pdf_file in tqdm(pdf_files, desc="Extracting PDFs"):
        pdf_path = os.path.join(folder_path, pdf_file)
        text = extract_text_from_pdf(pdf_path)
        if text:  # Save only if text was extracted
            data.append({"filename": pdf_file, "text": text})

    # Save to CSV
    df = pd.DataFrame(data)
    df.to_csv(output_csv, index=False)
    print(f"Extraction complete. Saved to {output_csv}")

# Set paths
input_folder = "output/acts"  # Change this to your actual PDF directory
output_csv = "acts_dataset.csv"  # Output file

# Run extraction
process_pdfs_in_folder(input_folder, output_csv)
