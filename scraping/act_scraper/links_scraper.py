from playwright.sync_api import sync_playwright
import csv
import logging
from pathlib import Path
from bs4 import BeautifulSoup
import os
from urllib.request import urlretrieve

ROOT_URL = "http://kenyalaw.org:8181/exist/kenyalex/index.xql"
BASE_URL = "http://kenyalaw.org:8181/exist/"

def get_all_links(url: str):
    links_output = "output/acts/links.csv"
    links = []

    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        page.goto(url)
        page.wait_for_load_state('networkidle')
        
        content = page.content()

        soup = BeautifulSoup(content, "html.parser")

        try:
            for a in soup.find_all('a'):
                if 'here' in a.text or '.pdf' in a.get('href', ''):
                    pdf_url = f"{a['href']}"
                    links.append(pdf_url)
                    logging.info(f"Found PDF link: {pdf_url}")
                elif 'actview' in a.get('href', ''):
                    page_url = f"{BASE_URL}kenyalex/{a['href']}"
                    links.append(page_url)
                    logging.info(f"Found act page link: {page_url}")

        except Exception as e:
            logging.error(f"Error scraping {url}: {e}")

        # Saving links to links.csv
        with open(links_output, "w", newline='', encoding="utf-8") as links_file:
            writer = csv.writer(links_file)
            for link in links:
                writer.writerow([link])
            
            logging.info(f"Saved links to {links_output}")  
    
    return links
        
def read_urls_from_csv(file_path="output/acts/links.csv"):
    urls = []
    if os.path.exists(file_path):
        with open(file_path, mode='r', newline='', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            urls = [row[0] for row in csv_reader]
    
    else:
        urls = get_all_links(ROOT_URL)

    return urls

def download_file(url, output_dir):
    filename = os.path.join(output_dir, url.split("/")[-1])
    if os.path.exists(filename):
        logging.info(f"File {filename} already exists. Skipping download.")
        return
    urlretrieve(url, filename)
    logging.info(f"Downloaded pdf: {filename}")
    
def read_failed_urls(file_path="output/acts/failed_pdf.csv"):
    failed_urls = set()
    if os.path.exists(file_path):
        with open(file_path, mode='r', newline='', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            failed_urls = {row[0] for row in csv_reader}
    return failed_urls
    
def scrape_urls(output_dir):
    urls = read_urls_from_csv()
    failed_urls = read_failed_urls()

    print(f"Scraping {len(urls)} urls")

    for url in urls:
        try:
            if url.endswith('.pdf'):
                download_file(url, output_dir)
                continue

            with sync_playwright() as p:
                browser = p.firefox.launch(headless=True)
                context = browser.new_context()
                page = context.new_page()
                
                page.goto(url)
                page.wait_for_load_state('domcontentloaded') # Wait for the entire DOM to be loaded
                
                content = page.content()

                soup = BeautifulSoup(content, 'html.parser')


                for link in soup.find_all('a', href=True):
                    pdf_link = f"http://kenyalaw.org:8181/exist{link['href'].strip('..')}".replace(" ", "%20")
                    if pdf_link.endswith('.pdf'):
                        download_file(pdf_link, output_dir)
        except:
            if url not in failed_urls:
                with open(f"output/acts/failed_pdf.csv", "a+", newline='', encoding="utf-8") as links_file:
                    writer = csv.writer(links_file)
                    writer.writerow([url])
                failed_urls.add(url)

def get_or_create_output_dir():
    base_path = os.path.dirname(os.path.abspath(__file__))
    folder_path = os.path.join(base_path, 'output/acts')
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Output folder created at: {folder_path}")
    else:
        print(f"Output folder already exists at: {folder_path}")
    
    return folder_path

def get_act_links():
    logging.basicConfig(level=logging.INFO)
    output_dir = get_or_create_output_dir()
    scrape_urls(output_dir)
    
if __name__ == "__main__":
    get_act_links()