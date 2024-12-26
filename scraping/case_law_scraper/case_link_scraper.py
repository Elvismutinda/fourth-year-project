import asyncio
from playwright.async_api import async_playwright
import csv
import os

async def scrape_links(page, url, all_links_set):
    print(f"Processing: {url}")
    try:
        await page.goto(url, timeout=0)  # Wait indefinitely until the page is fully loaded
    except Exception as e:
        print(f"Error while trying to load {url}: {e}")
        return None  # Stop if the page cannot be loaded

    # Scrape the links
    content = await page.inner_html("#myTabContent")
    links = page.locator("#myTabContent a")
    count = await links.count()

    for i in range(count):
        href = await links.nth(i).get_attribute("href")
        if href and href.startswith("https://kenyalaw.org/caselaw/cases/view/"):
            if href not in all_links_set:
                all_links_set.add(href)

                with open("./output/case_laws/case_law_links.csv", "a+") as file:
                    csv.writer(file).writerow([href])
    
    # This file will help us avoid starting over in case something goes wrong
    with open("./output/case_laws/last_page.txt", "w") as fw:
        fw.write(url)

    # Find and return the next pagination link
    next_links = page.locator(".next a")

    if await next_links.count() == 0:
        return None

    return await next_links.first.get_attribute("href")  # Select the first "next" link


def get_last_page(last_page_file="./output/case_laws/last_page.txt"):
    last_page = "https://kenyalaw.org/caselaw/cases/advanced_search/"

    if os.path.exists(last_page_file):
        with open(last_page_file, "r") as fr:
            last_page = fr.read()

    return last_page

async def get_case_links():
    url = get_last_page()  # Initial URL

    all_links_set = set()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)  # Set headless to False if you want to see the browser actions
        page = await browser.new_page()

        while url:
            url = await scrape_links(page, url, all_links_set)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(get_case_links())