import re
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
from hf_llm import llm
import aiohttp
from bs4 import BeautifulSoup

async def extract_case_details(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Navigate to the case law page
            await page.goto(url, timeout=30000)

            # Get the page content
            content = await page.content()
            soup = BeautifulSoup(content, "html.parser")

            # Extract <dl> tag with metadata
            metadata_list = {}
            dl_element = soup.find("dl", class_="document-metadata-list")
            
            if dl_element:
                dt_tags = dl_element.find_all("dt")
                dd_tags = dl_element.find_all("dd")
                
                for dt, dd in zip(dt_tags, dd_tags):
                    key = dt.text.strip()
                    
                    # Remove button tags from the value
                    for button in dd.find_all("button"):
                        button.decompose()
                        
                    value = " ".join(dd.text.strip().split())
                    metadata_list[key] = value

            await browser.close()
            return metadata_list

        except Exception as e:
            await browser.close()
            return {"Error": f"Failed to extract case details: {str(e)}"}

# Run extraction for a test case
if __name__ == "__main__":
    test_url = "https://new.kenyalaw.org/akn/ke/judgment/kehc/2021/5661/eng@2021-06-30"

    async def main():
        case_details = await extract_case_details(test_url)
        for key, value in case_details.items():
            print(f"{key}: {value}")

    asyncio.run(main())

