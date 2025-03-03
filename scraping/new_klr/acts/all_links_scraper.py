from playwright.sync_api import sync_playwright
import csv
import logging
import os
from bs4 import BeautifulSoup
from urllib.request import urlretrieve

ROOT_URL = "https://new.kenyalaw.org/legislation/"
ACTS_URL = "https://new.kenyalaw.org/"
TOTAL_PAGES = 10

def get_all_links():
    links_output = "output/acts/links.csv"
    links = []
    
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        for i in range(1, TOTAL_PAGES + 1):
            url = f"{ROOT_URL}?page={i}"
            page.goto(url, timeout=120000)
            
            soup = BeautifulSoup(page.content(), "html.parser")
            
            for td in soup.find_all('td', class_='cell-title'):
                act_link = td.find('a', href=True)
                if act_link:
                    full_url = f"{ACTS_URL.rstrip('/')}{act_link['href']}"
                    act_title = act_link.text.strip().replace("/", "-")  # Clean filename
                    links.append((full_url, act_title))
                    logging.info(f"Found act page link: {full_url} with title {act_title}")
    
    with open(links_output, "w", newline='', encoding="utf-8") as links_file:
        writer = csv.writer(links_file)
        for link, title in links:
            writer.writerow([link, title])
    
    logging.info(f"Saved links to {links_output}")
    return links

def read_urls_from_csv(file_path="output/acts/links.csv"):
    if os.path.exists(file_path):
        with open(file_path, mode='r', newline='', encoding='utf-8') as file:
            return [tuple(row) for row in csv.reader(file)]
    return get_all_links()

def download_file(url, title, output_dir):
    filename = os.path.join(output_dir, f"{title}.pdf")
    if os.path.exists(filename):
        logging.info(f"File {filename} already exists. Skipping download.")
        return
    urlretrieve(url, filename)
    logging.info(f"Downloaded pdf: {filename}")

def scrape_urls(output_dir):
    url_data = read_urls_from_csv()
    failed_urls = set()
    
    for url, title in url_data:
        try:
            with sync_playwright() as p:
                browser = p.firefox.launch(headless=True)
                context = browser.new_context()
                page = context.new_page()
                
                page.goto(url, timeout=120000)
                
                soup = BeautifulSoup(page.content(), 'html.parser')
                pdf_link = None
                
                for a in soup.find_all('a', href=True):
                    if a['href'].endswith('/source'):
                        pdf_link = f"{ACTS_URL.rstrip('/')}{a['href']}"
                        break
                
                if pdf_link:
                    download_file(pdf_link, title, output_dir)
                else:
                    logging.warning(f"No PDF found on {url}")
                    failed_urls.add(url)
        except Exception as e:
            logging.error(f"Error scraping {url}: {e}")
            failed_urls.add(url)
    
    if failed_urls:
        with open("output/acts/failed_pdf.csv", "w", newline='', encoding="utf-8") as failed_file:
            writer = csv.writer(failed_file)
            for failed_url in failed_urls:
                writer.writerow([failed_url])

def get_or_create_output_dir():
    folder_path = os.path.join(os.getcwd(), 'output/acts')
    os.makedirs(folder_path, exist_ok=True)
    return folder_path

def get_act_links():
    logging.basicConfig(level=logging.INFO)
    output_dir = get_or_create_output_dir()
    scrape_urls(output_dir)
    
if __name__ == "__main__":
    get_act_links()
