import asyncio
from urllib.parse import urljoin
from playwright.async_api import async_playwright
import csv
import os

OUTPUT_DIR = "./output/case_laws"
CSV_FILE = f"{OUTPUT_DIR}/case_law_links.csv"
LAST_PAGE_FILE = f"{OUTPUT_DIR}/last_page.txt"

BASE_URL = "https://new.kenyalaw.org/judgments/all/2024/1/?taxonomies=case-indexes-criminal-law&q=&sort=-date&page="

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def scrape_links(page, url, all_links_set):
    """Scrapes case links from a given page and finds the next pagination link."""
    print(f"Processing: {url}")

    try:
        await page.goto(url, timeout=0)  # Load page fully
    except Exception as e:
        print(f"Error loading {url}: {e}")
        return None

    # Extract case law links from <td class="cell-title">
    links = await page.locator('td.cell-title a').all()

    for link in links:
        href = await link.get_attribute("href")
        if href and href.startswith("/akn/ke/judgment/"):
            full_url = urljoin("https://new.kenyalaw.org", href)  # Convert to absolute URL
            if full_url not in all_links_set:
                all_links_set.add(full_url)
                with open(CSV_FILE, "a+", newline="") as file:
                    csv.writer(file).writerow([full_url])

    # Save last processed page
    with open(LAST_PAGE_FILE, "w") as fw:
        fw.write(url)

    # Find next page button
    next_button_element = page.locator('li.page-item a.page-link', has_text="Next")
    next_button_href = await next_button_element.get_attribute("href") if await next_button_element.count() > 0 else None

    return urljoin("https://new.kenyalaw.org/judgments/all/2024/1/", next_button_href) if next_button_href else None

def get_last_page():
    """Returns the last processed page or the first page."""
    if os.path.exists(LAST_PAGE_FILE):
        with open(LAST_PAGE_FILE, "r") as fr:
            return fr.read()
    return f"{BASE_URL}1"  # Start from page 1

async def get_case_links():
    """Main function to loop through pages and extract case links."""
    url = get_last_page()
    all_links_set = set()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        while url:
            url = await scrape_links(page, url, all_links_set)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(get_case_links())
