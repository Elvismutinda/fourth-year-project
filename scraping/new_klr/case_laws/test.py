import os
import re
import fitz
import spacy
from collections import defaultdict

# Load English NLP model with legal vocabulary
nlp = spacy.load("en_core_web_lg")

def extract_text(pdf_path):
    """Extract text from PDF with error handling."""
    try:
        with fitz.open(pdf_path) as doc:
            return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def clean_legal_text(text):
    """Clean and normalize legal text."""
    if not text:
        return ""
    
    # Remove page numbers, headers, and footers
    text = re.sub(r'Page \d+ of \d+', '', text)
    text = re.sub(r'\n\d+\n', '\n', text)
    text = re.sub(r'KENYA LAW.*?REPUBLIC OF KENYA', '', text, flags=re.DOTALL)
    
    # Fix common OCR errors
    replacements = {
        'oence': 'offence',
        'rst': 'first',
        'ndings': 'findings',
        'le': 'file'
    }
    for wrong, right in replacements.items():
        text = text.replace(wrong, right)
    
    # Normalize whitespace
    return ' '.join(text.split())

def extract_legal_elements(doc):
    """Enhanced legal element extraction with better pattern matching."""
    analysis = defaultdict(list)
    
    # Improved patterns for legal elements
    citation_pattern = re.compile(
        r'((?:[A-Z][a-z]+\s?(?:&|and)\s)?[A-Z][a-z]+ v [A-Z][a-z]+(?: & [A-Z][a-z]+)* \[\d{4}\] [A-Z]+ \d+)'
    )
    
    section_pattern = re.compile(
        r'(Section|Article)\s\d+(?:\s*\(\d+\))?(?:\s+of the)?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*'
    )
    
    for sent in doc.sents:
        sent_text = sent.text.strip()
        if not sent_text or len(sent_text) < 20:
            continue
            
        # Extract legal issues (more precise matching)
        if re.search(r'(whether|does)\s.*\s(consti\w+|valid\w+|applic\w+|mandatory|sentence|right)', sent_text, re.IGNORECASE):
            clean_issue = re.sub(r'\s+', ' ', sent_text).strip()
            analysis["issues"].append(clean_issue)
            
        # Extract legal principles (with better citation handling)
        if section_pattern.search(sent_text):
            analysis["legal_principles"].append(sent_text)
        elif citation_pattern.search(sent_text):
            # Extract the full citation context
            citation = citation_pattern.search(sent_text).group(1)
            context = sent_text.split(citation)[0] + citation
            analysis["legal_principles"].append(context)
            
        # Extract ratio decidendi (court's core reasoning)
        ratio_phrases = [
            "the court (?:holds|finds|determines) that",
            "we (?:hold|find|determine) that",
            "accordingly,? (?:we )?(?:conclude|hold|find)",
            "the ratio (?:decidendi )?is"
        ]
        if any(re.search(phrase, sent_text.lower()) for phrase in ratio_phrases):
            analysis["ratio_decidendi"].append(sent_text)
            
        # Extract holdings (final decisions)
        if re.search(r'(therefore|accordingly|consequently)[^.]*(dismiss|allow|grant|deny|uphold)', sent_text, re.IGNORECASE):
            analysis["holdings"].append(sent_text)
            
        # Extract reasoning (supporting arguments)
        reasoning_triggers = [
            "because", "since", "therefore", "thus", 
            "in light of", "having considered", "as established in",
            "for these reasons", "in view of"
        ]
        if any(trigger in sent_text.lower() for trigger in reasoning_triggers):
            analysis["reasoning"].append(sent_text)
            
    return analysis

def post_process_analysis(analysis):
    """Refine and organize the extracted legal elements."""
    # Remove duplicates while preserving order
    for key in analysis:
        seen = set()
        analysis[key] = [x for x in analysis[key] if not (x in seen or seen.add(x))]
    
    # Prioritize more relevant items
    def relevance_score(text):
        score = 0
        score += 10 if 'section' in text.lower() or 'article' in text.lower() else 0
        score += 5 if any(c in text for c in ['[', '(']) else 0  # Likely contains citation
        score += len(text) / 100  # Longer texts often more substantive
        return score
    
    for key in ['legal_principles', 'ratio_decidendi', 'reasoning']:
        if key in analysis:
            analysis[key].sort(key=relevance_score, reverse=True)
    
    return analysis

def analyze_case(text):
    """Analyze case text and return structured data."""
    if not text:
        return None
        
    text = clean_legal_text(text)
    doc = nlp(text)
    analysis = extract_legal_elements(doc)
    return post_process_analysis(analysis)

def display_analysis(case_name, analysis):
    """Display analysis results in a more professional format."""
    if not analysis:
        print("No analysis available")
        return
        
    print(f"\nCase: {case_name}")
    
    categories = {
        "issues": "Legal Issues",
        "legal_principles": "Authorities Cited",
        "ratio_decidendi": "Ratio Decidendi",
        "holdings": "Court's Decision",
        "reasoning": "Supporting Reasoning"
    }
    
    for key, label in categories.items():
        if analysis.get(key):
            print(f"\n{label.upper()}:")
            for i, item in enumerate(analysis[key][:5], 1):
                # Clean up the output
                item = re.sub(r'\s+', ' ', item).strip()
                # Highlight citations and sections
                item = re.sub(r'(\[.*?\])', r'\033[1m\1\033[0m', item)  # Bold citations
                item = re.sub(r'(Section|Article \d+)', r'\033[1m\1\033[0m', item)  # Bold laws
                print(f"{i}. {item[:250]}{'...' if len(item) > 250 else ''}")

def process_case_file(pdf_path):
    """Process a case file end-to-end."""
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return None

    print(f"\nProcessing: {pdf_path}")
    
    text = extract_text(pdf_path)
    if not text:
        print("No text extracted")
        return None
        
    analysis = analyze_case(text)
    if not analysis:
        print("No analysis generated")
        return None
        
    return {
        "case_name": os.path.basename(pdf_path),
        "analysis": analysis
    }

if __name__ == "__main__":
    test_pdf = "./output/case_laws/Agani v Republic (Criminal Appeal 2of2022) 2024KEHC2892(KLR) (18March2024) (Judgment).pdf"
    case_data = process_case_file(test_pdf)
    
    if case_data:
        display_analysis(case_data["case_name"], case_data["analysis"])