import os
import json
import csv
import uuid
import threading
import traceback
import re
from playwright.sync_api import sync_playwright, expect

# Lock to prevent multiple threads from modifying the same file
file_lock = threading.Lock()

def generate_file_name():
    return str(uuid.uuid4()) + ".pdf"

def download_file(page, locator, output_dir='./output/case_laws'):
    print(f"Attempting file download")
    file_location = None

    with page.expect_event('download', timeout=60000) as download_info:
        locator.nth(0).click()

    download = download_info.value
    file_name = download.suggested_filename or generate_file_name()
    file_location = os.path.join(output_dir, file_name)

    download.save_as(file_location)
    download.delete()

    return file_location

def extract_case_details(page):
    print(f"Extracting case details")
    case_details = {}

    try:
        metadata_button = page.locator("a[title=Metadata]")
        expect(metadata_button).to_be_visible(timeout=30000)
        metadata_button.nth(0).click()

        table_locator = page.locator("table.meta_info").nth(0)
        expect(table_locator).to_be_visible(timeout=30000)

        for row in table_locator.locator("tr").all():
            th = row.locator("th")
            td = row.locator("td")
            if th.count() and td.count():
                key = th.nth(0).text_content().strip()
                value = td.nth(0).text_content().strip()
                case_details[key] = value

    except Exception:
        print(traceback.format_exc())

    return case_details

def append_to_json(data, filename):
    existing_data = []

    if os.path.isfile(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            try:
                existing_data = json.load(file)
            except json.JSONDecodeError:
                pass

    existing_data.append(data)

    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(existing_data, file, indent=4)

def process_case_laws(urls, output_dir, case_file_path):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True, downloads_path=output_dir)

        for url in urls:
            print(f"Processing: {url}")
            file_location = None
            metadata = None

            page = browser.new_page()

            try:
                page.goto(url, timeout=120000)
                metadata = extract_case_details(page)

                # Locate and download the PDF
                download_link_locator = None
                all_links = page.locator("a[title]")

                for link in all_links.all():
                    title = link.get_attribute("title")
                    if re.match(r"(?i)Download PDF", title):
                        download_link_locator = link
                        break

                if download_link_locator:
                    file_location = download_file(page, download_link_locator, output_dir)

                if file_location and metadata:
                    with file_lock:
                        append_to_json(
                            {"url": url, "file_location": file_location, "metadata": metadata},
                            case_file_path
                        )

            except Exception:
                print(f"Error processing {url}:\n{traceback.format_exc()}")

            page.close()

        browser.close()

def get_case_law_files(output_dir='./output/case_laws', num_threads=10):
    case_file_path = os.path.join(output_dir, "case_laws.json")
    links_file_path = os.path.join(output_dir, "case_law_links.csv")

    if not os.path.exists(links_file_path):
        raise FileNotFoundError("Case law links file is missing.")

    with open(links_file_path, "r") as links_file:
        urls = [row[0] for row in csv.reader(links_file)]

    scraped_urls = set()
    if os.path.exists(case_file_path):
        with open(case_file_path, "r") as fo:
            try:
                scraped_urls = set(entry["url"] for entry in json.load(fo))
            except json.JSONDecodeError:
                pass

    urls = [url for url in urls if url not in scraped_urls]
    print(f"Scraping {len(urls)} links.")

    chunk_size = max(1, len(urls) // num_threads)
    chunks = [urls[i:i + chunk_size] for i in range(0, len(urls), chunk_size)]
    
    threads = [threading.Thread(target=process_case_laws, args=(chunk, output_dir, case_file_path)) for chunk in chunks]

    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

if __name__ == "__main__":
    get_case_law_files()
