import csv

CSV_FILE = "./output/case_laws/case_law_links.csv"
CLEANED_CSV_FILE = "./output/case_laws/case_law_links_cleaned.csv"

def remove_duplicates():
    """Reads the CSV file, removes duplicates, and saves a cleaned version."""
    try:
        # Read all links into a set to remove duplicates
        unique_links = set()
        with open(CSV_FILE, "r", newline="") as file:
            reader = csv.reader(file)
            for row in reader:
                if row:  # Ignore empty rows
                    unique_links.add(row[0])  # Store only the first column (URL)

        # Write back only unique links
        with open(CLEANED_CSV_FILE, "w", newline="") as file:
            writer = csv.writer(file)
            for link in sorted(unique_links):  # Sort for consistency
                writer.writerow([link])

        print(f"✅ Duplicates removed! Cleaned file saved as: {CLEANED_CSV_FILE}")
        print(f"Original: {len(unique_links)} unique links found.")

    except FileNotFoundError:
        print(f"❌ Error: CSV file not found at {CSV_FILE}. Make sure you run the scraper first.")

if __name__ == "__main__":
    remove_duplicates()
