import os
import json
import csv
import uuid
import threading
import traceback
from playwright.sync_api import sync_playwright, expect

# Lock to prevent multiple threads from modifying the same file
file_lock = threading.Lock()

def generate_file_name():
    return str(uuid.uuid4()) + ".pdf"

def download_pdf(page, output_dir='./output/case_laws'):
    print(f"Attempting file download")
    file_location = None
    file_url = None
    base_url = "https://new.kenyalaw.org"

    try:
        # Check for a direct "Download PDF" button
        direct_pdf_button = page.locator("a:has-text('Download PDF')")
        if direct_pdf_button.count() > 0:
            print("Found direct PDF download button")
            href = direct_pdf_button.get_attribute("href")
            file_url = base_url + href if href else None
            
            with page.expect_event('download', timeout=60000) as download_info:
                direct_pdf_button.click()
            download = download_info.value
        else:
            # If no direct download button, look for the dropdown menu
            print("Checking for dropdown PDF button")
            dropdown_button = page.locator(".btn-group .dropdown-toggle")
            expect(dropdown_button).to_be_visible(timeout=10000)
            dropdown_button.click()

            # Select the PDF download link
            pdf_link = page.locator("ul.dropdown-menu a[href$='.pdf']")
            expect(pdf_link).to_be_visible(timeout=10000)
            
            href = pdf_link.get_attribute("href")
            file_url = base_url + href if href else None

            with page.expect_event('download', timeout=60000) as download_info:
                pdf_link.click()
            download = download_info.value

        file_name = download.suggested_filename or generate_file_name()
        file_location = os.path.join(output_dir, file_name)

        download.save_as(file_location)
        download.delete()

        print(f"Downloaded PDF: {file_name}")
        print(f"PDF URL: {file_url}")
    except Exception:
        print("Failed to download PDF")
        print(traceback.format_exc())

    return file_location, file_url

def extract_case_details(page):
    print(f"Extracting case details")
    case_details = {}

    try:
        details_tab = page.locator("#document-detail-tab")
        expect(details_tab).to_be_visible(timeout=15000)
        
        # Find all <dl> elements under the details tab
        dl_elements = details_tab.locator("dl").all()
        
        for dl in dl_elements:
            dt_elements = dl.locator("dt").all()
            dd_elements = dl.locator("dd").all()
            
            #Ensure dt and dd count matches
            if len(dt_elements) == len(dd_elements):
                for dt, dd in zip(dt_elements, dd_elements):
                    key = dt.text_content().strip().replace(" ", "_").lower()
                    value = dd.text_content().strip()
                    case_details[key] = value
            else:
                print("Mismatched dt and dd elements")

    except Exception:
        print("Failed to extract case details")
        print(traceback.format_exc())

    return case_details

def chunk_list(lst, num_chunks):
    # Calculate the size of each chunk
    chunk_size = len(lst) // num_chunks
    # Calculate the remainder to distribute among the first chunks
    remainder = len(lst) % num_chunks

    chunks = []
    start = 0

    for i in range(num_chunks):
        # Calculate the end index for the current chunk
        end = start + chunk_size + (1 if i < remainder else 0)
        # Append the chunk to the list
        chunks.append(lst[start:end])
        # Update the start index for the next chunk
        start = end

    return (chunk_size, chunks)


def append_to_json(data, filename):
    if os.path.isfile(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
    else:
        existing_data = []

    existing_data.append(data)

    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(existing_data, file, indent=4)
    

    return

def download_files_from_links(urls, output_dir, case_file_path):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True, downloads_path=output_dir)

        for url in urls:
            print(f"🔍 Processing: {url}")
            file_location = None
            file_url = None
            metadata = None
            page = browser.new_page()

            try:
                page.goto(url, timeout=120000)
                metadata = extract_case_details(page)

                # Download the PDF
                file_location, file_url = download_pdf(page, output_dir)

                if file_location and metadata:
                    with file_lock:
                        append_to_json(
                            {"url": url, "file_location": file_location, "file_url": file_url, "metadata": metadata},
                            case_file_path
                        )

            except Exception:
                print(f"Error processing {url}:\n{traceback.format_exc()}")

            page.close()

        browser.close()
        
    return (metadata, file_location)

def get_case_law_files(output_dir='./output/case_laws', num_threads=10):
    case_file_path = os.path.join(output_dir, "case_laws.json")
    links_file_path = os.path.join(output_dir, "case_law_links.csv")
    scraped_urls = set()
    urls = []

	# Retrieve the links to be scraped
    if not os.path.exists(links_file_path):
        raise FileNotFoundError("Case law links file is missing.")

    with open(links_file_path, "r") as links_file:
        urls = [row[0] for row in csv.reader(links_file)]

	# Check the files we have already downloaded
    if os.path.exists(case_file_path):
        with open(case_file_path, "r") as file:
            scraped_urls = set(x["url"] for x in json.load(file))

	# Use list comprehension to get a list of links that have not been downloaded yet -> O(1) set()
    urls = [y for y in urls if y not in scraped_urls]
    print(f"Scraping {len(urls)} links.\n")


	# Chunk the list into NUM_THREADS lists
    chunk_size, chunked_list = chunk_list(urls, num_threads)
    threads = []
    
    # Divide the work among threads
    print(f"Splitting work into {num_threads} threads of {chunk_size} urls")
    for i in chunked_list:
        threads.append(
            threading.Thread(
                target=download_files_from_links,
                args=(i, output_dir, case_file_path)
            )
        )

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    get_case_law_files()
