import asyncio
import os
import requests
import threading
from queue import Queue
from urllib.parse import urljoin
from playwright.async_api import async_playwright
from utils import upload_to_aws, FILE_STORAGE

# Global set to track visited PDF links
visited_pdfs = set()
missing_pdfs = []
processed_pdfs = set()  # Set to track processed PDF links

# Function to scrape links from the main page
async def scrape_links(url, link_queue):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url)
        await page.wait_for_timeout(25000)  # Wait for 10 seconds to ensure page is fully loaded
        
        links = await page.eval_on_selector_all('#toc-listing a', 'elements => elements.map(e => e.href)')
        for link in links:
            if link != url and link not in link_queue.queue:
                print(f"Scraping link and saving to queue: {link}")
                link_queue.put(link)
        await browser.close()

# Function to download PDFs from a given page link
def download_pdfs(link, base_url, lock, thread_name):
    global visited_pdfs, missing_pdfs, processed_pdfs
    response = requests.get(link)
    if response.status_code == 200:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        pdf_links = [urljoin(base_url, a['href']) for a in soup.find_all('a', href=True) if a['href'].endswith('.pdf')]
        
        for pdf_link in pdf_links:
            with lock:
                if pdf_link in processed_pdfs:
                    print(f"[{thread_name}] Skipping already processed PDF: {pdf_link}")
                    continue  # Skip if already processed
                processed_pdfs.add(pdf_link)
            
            # Retry logic
            retries = 3
            while retries > 0:
                try:
                    response = requests.get(pdf_link)
                    if response.status_code == 200:
                        filename = pdf_link.split('/')[-1]
                        pdf_dir = 'output/acts/pdfs'
                        if not os.path.exists(pdf_dir):
                            os.makedirs(pdf_dir)
                        filepath = os.path.join(pdf_dir, filename)
                        
                        # Save the PDF locally
                        with open(filepath, 'wb') as f:
                            f.write(response.content)
                        print(f"[{thread_name}] Downloaded PDF: {pdf_link}")
                        
                        # Upload to AWS S3 if configured
                        if FILE_STORAGE == 'aws':
                            s3_file_location = upload_to_aws(filepath, f"acts/{filename}")
                            os.remove(filepath)  # Delete the local file after uploading
                            filepath = s3_file_location  # Update the file path to the S3 location
                            print(f"Saved in AWS!: {filepath}")
                        
                        break  # Exit retry loop on success
                    else:
                        retries -= 1
                        print(f"[{thread_name}] Retrying PDF download ({retries} retries left): {pdf_link}")
                except requests.exceptions.RequestException as e:
                    retries -= 1
                    print(f"[{thread_name}] Error downloading PDF ({retries} retries left): {pdf_link}, Error: {e}")
            else:
                with lock:
                    missing_pdfs.append(pdf_link)
                print(f"[{thread_name}] Missing PDF after retries: {pdf_link}")
    else:
        with lock:
            missing_pdfs.append(link)
        print(f"[{thread_name}] Missing PDF (status code {response.status_code}): {link}")


# Worker function for threading
def worker(link_queue, base_url, lock, thread_name):
    while True:
        link = link_queue.get()
        if link is None:  # Sentinel value to signal thread to exit
            print(f"[{thread_name}] Exiting.")
            link_queue.task_done()
            break
        print(f"[{thread_name}] Processing link: {link}")
        download_pdfs(link, base_url, lock, thread_name)
        link_queue.task_done()

async def get_acts_files():
    print(f"File storage: {FILE_STORAGE}")
    url = 'http://kenyalaw.org:8181/exist/kenyalex/index.xql'
    link_queue = Queue()
    
    await scrape_links(url, link_queue)
    num_threads = int(input("Enter the number of threads (30 is recommended): "))
    # Recommended to use up to 30 threads for optimal performance
    # Reasons:
    # 1. Network Overhead: Using too many threads can lead to excessive network requests
    #    that can overwhelm the server and cause rate limiting or blocking.
    # 2. Resource Contention: High number of threads can cause contention for CPU and memory
    #    resources, leading to decreased performance and potential crashes.
    # 3. Diminishing Returns: Beyond a certain point, the benefit of additional threads
    #    decreases as the overhead of managing more threads outweighs the performance gain.
    lock = threading.Lock()

    threads = []
    for i in range(num_threads):
        thread_name = f"Thread-{i+1}"
        thread = threading.Thread(target=worker, args=(link_queue, url, lock, thread_name))
        thread.start()
        threads.append(thread)
    
    # Wait for the queue to be empty
    link_queue.join()

    # Send sentinel value to signal threads to exit
    for _ in range(num_threads):
        link_queue.put(None)
    
    for thread in threads:
        thread.join()
    
    with open('output/acts/missing.txt', 'w') as f:
        for pdf_link in missing_pdfs:
            f.write(pdf_link + '\n')
            print(f"Logged missing PDF to missing.txt: {pdf_link}")
    
    print("All the PDFs saved after finishing processing all the links and the queue is empty.")

# Run the async main function
# Run the script
if __name__ == "__main__":
    asyncio.run(get_acts_files())
