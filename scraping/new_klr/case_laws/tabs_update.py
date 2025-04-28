import json
import os
import psycopg2
from dotenv import load_dotenv

# Load database URL from .env
load_dotenv()
DB_URL = os.getenv("DATABASE_URL")

# Load the JSON data
with open("output/case_law_info.json", "r", encoding="utf-8") as f:
    case_laws = json.load(f)

def update_case_law(case):
    url = case.get("url")
    tabs = case.get("tabs", {})

    issues = tabs.get("Issues", None)
    legal_principles = tabs.get("Legal Principles", None)
    ratio_decidendi = tabs.get("Ratio Decidendi", None)
    reasoning = tabs.get("Reasoning", None)
    full_text = tabs.get("Full Case Law", None)

    try:
        conn = psycopg2.connect(dsn=DB_URL)
        cur = conn.cursor()

        cur.execute("""
            UPDATE case_laws
            SET 
                issues = %s,
                legal_principles = %s,
                ratio_decidendi = %s,
                reasoning = %s,
                full_text = %s
            WHERE url = %s
        """, (
            json.dumps(issues) if issues else None,
            json.dumps(legal_principles) if legal_principles else None,
            ratio_decidendi,
            reasoning,
            full_text,
            url
        ))

        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ Updated: {url}")
    except Exception as e:
        print(f"❌ Error updating {url}: {e}")

def process_updates():
    for case in case_laws:
        update_case_law(case)

if __name__ == "__main__":
    process_updates()