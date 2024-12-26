import os
import asyncio
import requests
import threading
from queue import Queue
from urllib.parse import urljoin
from playwright.async_api import async_playwright
from utils import upload_to_aws, FILE_STORAGE

# Define the directory to save PDFs
pdf_directory = 'output/bills/pdfs'
os.makedirs(pdf_directory, exist_ok=True)

# Track visited URLs to avoid redundant visits
visited_urls = set()
visited_pdfs = set()

# Queue to manage URLs to be visited
url_queue = Queue()


def download_pdf(pdf_url, filename, thread_name):
    """Download PDF and save it to the specified filename, then optionally upload it to AWS S3."""
    local_file_path = os.path.join(pdf_directory, filename)
    try:
        response = requests.get(pdf_url, stream=True)
        if response.status_code == 200:
            # Download the PDF
            with open(local_file_path, 'wb') as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            print(f"[{thread_name}] Successfully downloaded PDF: {filename}")

            # Upload to AWS S3 if configured
            if FILE_STORAGE == 'aws':
                s3_file_location = upload_to_aws(local_file_path, f"bills/{filename}")
                os.remove(local_file_path)  # Delete the local file after uploading
                local_file_path = s3_file_location  # Update the file path to the S3 location
                print(f"Saved in AWS!: {local_file_path}")

            return local_file_path  # Return the file path, either local or S3
        else:
            print(f"[{thread_name}] Failed to download PDF from {pdf_url}")
    except Exception as e:
        print(f"[{thread_name}] Error downloading PDF from {pdf_url}: {e}")


async def enqueue_links(browser, start_url):
    """Enqueue all links from the start URL, avoiding duplicates."""
    try:
        page = await browser.new_page()
        await page.goto(start_url, timeout=0)

        link_twos = await page.eval_on_selector_all(
            '.vert-two a[href]', 'elements => elements.map(el => el.href)'
        )

        for link_two in link_twos:
            if link_two not in visited_urls:
                print(f"Enqueuing link from {link_two}")
                url_queue.put(link_two)
                visited_urls.add(link_two)
                nested_two = await browser.new_page()
                await nested_two.goto(link_two, timeout=0)

                # Extract links with class 'vert-three'
                link_hrefs = await nested_two.eval_on_selector_all(
                    '.vert-three a[href]', 'elements => elements.map(el => el.href)'
                )
                for link_href in link_hrefs:
                    if link_href not in visited_urls:
                        print(f"Enqueuing link from {link_href}")
                        url_queue.put(link_href)
                        visited_urls.add(link_href)

                        # Extract links with class 'vert-four'
                        nested_page = await browser.new_page()
                        await nested_page.goto(link_href, timeout=0)
                        nested_link_hrefs = await nested_page.eval_on_selector_all(
                            '.vert-four a[href]', 'elements => elements.map(el => el.href)'
                        )

                        for nested_link_href in nested_link_hrefs:
                            if nested_link_href not in visited_urls:
                                url_queue.put(nested_link_href)
                                visited_urls.add(nested_link_href)

                        await nested_page.close()
                await nested_two.close()
        await page.close()
    except Exception as e:
        print(f"Error enqueueing links from {start_url}: {e}")


def worker(thread_name, base_url):
    """Worker function to process URLs from the queue and download PDFs."""
    while not url_queue.empty():
        url = url_queue.get()
        try:
            # Use Playwright to open the page and find PDFs
            async def fetch_pdfs():
                async with async_playwright() as p:
                    browser = await p.chromium.launch()
                    page = await browser.new_page()
                    await page.goto(url, timeout=0)

                    # Extract PDF links from the page
                    pdf_links = await page.eval_on_selector_all(
                        '.span9 a[href$=".pdf"]',
                        'elements => elements.map(el => el.href)'
                    )

                    for pdf_url in pdf_links:
                        filename = pdf_url.split('/')[-1]
                        with threading.Lock():
                            if pdf_url not in visited_pdfs:
                                visited_pdfs.add(pdf_url)
                                print(f"[{thread_name}] Downloading PDF: {pdf_url} as {filename}")
                                # Download PDF using requests
                                download_pdf(pdf_url, filename, thread_name)

                    await page.close()
                    await browser.close()

            asyncio.run(fetch_pdfs())

        except Exception as e:
            print(f"[{thread_name}] Error processing {url}: {e}")
        finally:
            url_queue.task_done()
    print(f"[{thread_name}] Exiting.")


async def get_bill_files():
    print(f"File storage: {FILE_STORAGE}")
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Start with the initial URL
        initial_url = 'https://kenyalaw.org/kl/index.php?id=12043'

        # Enqueue all links from the initial URL
        await enqueue_links(browser, initial_url)

        # Start worker threads
        num_threads = 30  # For example, start with 5 threads
        threads = []
        for i in range(num_threads):
            thread_name = f"Thread-{i + 1}"
            thread = threading.Thread(target=worker, args=(thread_name, initial_url))
            thread.start()
            threads.append(thread)

        # Wait for all threads to complete
        for thread in threads:
            thread.join()

        await browser.close()


# Run the script
if __name__ == "__main__":
    asyncio.run(get_bill_files())
