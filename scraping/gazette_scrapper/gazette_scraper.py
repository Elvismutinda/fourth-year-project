import os
import asyncio
import requests
import threading
from queue import Queue
from urllib.parse import urljoin
from playwright.async_api import async_playwright
from utils import upload_to_aws, FILE_STORAGE

# Define the directory to save PDFs
pdf_directory = 'output/gazettes/'
os.makedirs(pdf_directory, exist_ok=True)

# Track visited URLs to avoid redundant visits
visited_urls = set()
visited_pdfs = set()

# Queues to manage URLs to be visited
queue_one = Queue()
queue_two = Queue()

def download_pdf(pdf_url, filename, year, thread_name):
    """Download PDF and save it to the specified filename, then optionally upload it to AWS S3."""
    year_directory = os.path.join(pdf_directory, year)
    os.makedirs(year_directory, exist_ok=True)
    local_file_path = os.path.join(year_directory, filename)

    try:
        response = requests.get(pdf_url, stream=True)
        if response.status_code == 200:
            with open(local_file_path, 'wb') as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f"[{thread_name}] Successfully downloaded PDF: {filename}")

            # Upload to AWS S3 if configured
            if FILE_STORAGE == 'aws':
                s3_file_location = upload_to_aws(local_file_path, f"gazette/{year}/{filename}")
                os.remove(local_file_path)  # Delete the local file after uploading
                local_file_path = s3_file_location  # Update the file path to the S3 location
                print(f"Saved in AWS!: {local_file_path}")

            return local_file_path  # Return the file path, either local or S3
        else:
            print(f"[{thread_name}] Failed to download PDF from {pdf_url}")
    except Exception as e:
        print(f"[{thread_name}] Error downloading PDF from {pdf_url}: {e}")

async def enqueue_links(browser, start_url):
    """Enqueue all links from the start URL that match the specified pattern."""
    try:
        page = await browser.new_page()
        await page.goto(start_url, timeout=0)

        # Extract links matching the year pattern
        link_hrefs = await page.eval_on_selector_all(
            'a[href^="https://kenyalaw.org/kenya_gazette/gazette/year/"]',
            'elements => elements.map(el => el.href)'
        )
        for link_href in link_hrefs:
            if link_href not in visited_urls:
                print(f"Enqueuing year link: {link_href}")
                queue_one.put(link_href)
                visited_urls.add(link_href)

        await page.close()
    except Exception as e:
        print(f"Error enqueueing links from {start_url}: {e}")

async def process_year_links(browser, thread_name):
    """Process links from queue_one, enqueue volume links, and download PDFs."""
    while not queue_one.empty():
        year_url = queue_one.get()
        year = year_url.split('/')[-2]  # Extract the year from the URL

        try:
            page = await browser.new_page()
            await page.goto(year_url, timeout=0)

            # Extract volume links
            volume_links = await page.eval_on_selector_all(
                'a[href^="https://kenyalaw.org/kenya_gazette/gazette/volume/"]',
                'elements => elements.map(el => el.href)'
            )
            for volume_link in volume_links:
                if volume_link not in visited_urls:
                    print(f"[{thread_name}] Enqueuing volume link: {volume_link}")
                    queue_two.put((volume_link, year))
                    visited_urls.add(volume_link)

            await page.close()
        except Exception as e:
            print(f"[{thread_name}] Error processing year link {year_url}: {e}")
        finally:
            queue_one.task_done()

async def process_volume_links(browser, thread_name):
    """Process links from queue_two and download PDFs."""
    while not queue_two.empty():
        volume_url, year = queue_two.get()

        try:
            page = await browser.new_page()
            await page.goto(volume_url, timeout=0)

            # Extract PDF links
            pdf_links = await page.eval_on_selector_all(
                'a[href$=".pdf"]',
                'elements => elements.map(el => el.href)'
            )
            for pdf_url in pdf_links:
                filename = pdf_url.split('/')[-1]
                if pdf_url not in visited_pdfs:
                    visited_pdfs.add(pdf_url)
                    print(f"[{thread_name}] Downloading PDF: {pdf_url} as {filename}")
                    download_pdf(pdf_url, filename, year, thread_name)

            await page.close()
        except Exception as e:
            print(f"[{thread_name}] Error processing volume link {volume_url}: {e}")
        finally:
            queue_two.task_done()

async def worker(thread_name):
    """Worker function to process both queues."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        while not queue_one.empty() or not queue_two.empty():
            await process_year_links(browser, thread_name)
            await process_volume_links(browser, thread_name)

        await browser.close()

    print(f"[{thread_name}] Exiting.")

async def scrape_gazettes():
    start_url = 'https://kenyalaw.org/kenya_gazette/'

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        await enqueue_links(browser, start_url)
        await browser.close()

    # Start worker threads
    num_threads = 20
    threads = []
    for i in range(num_threads):
        thread_name = f"Thread-{i+1}"
        thread = threading.Thread(target=asyncio.run, args=(worker(thread_name),))
        thread.start()
        threads.append(thread)

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    print("All tasks completed.")

if __name__ == "__main__":
    asyncio.run(scrape_gazettes())
