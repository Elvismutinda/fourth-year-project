import sys
import argparse
import asyncio
from case_law_scraper.case_law_downloader import get_case_law_files
from case_law_scraper.case_link_scraper import get_case_links
from act_scraper.links_scraper import get_act_links
from act_scraper.act_scraper_threads import get_acts_files
from legal_notice_scraper.legal_notice import get_legal_files
from gazette_scrapper.gazette_scraper import scrape_gazettes
from bills_scrapper.bills_scrapper import get_bill_files
from repealed_statutes.repealed_statutes import repealed_download
from recent_legislation.recent_legislation import recent_legislation_files
from eac_legislation.eac_legislation import eac_legislation_files
from county_legislative.county_legislative import county_legislative_files
from constitutional_amendment.constitutional_amendment import constitutional_amendment_files


def main():
    parser = argparse.ArgumentParser(description="Run a specific scraper with optional number of threads.")
    
    parser.add_argument("scraper", choices=["case_laws", "case_law_links", "acts_links", "acts_files", "legal_files", "gazette_files", "bill_files", "repealed_files", "recent_legislation_files", "county_legislation_files", "eac_legislation_files", "constitutional_amendment_files"],
                        help="Choose a scraper to run.")
    
    parser.add_argument("--num_threads", type=int, default=10,
                        help="Number of threads to use (default: 10)")
    
    args = parser.parse_args()
    
    scraper = args.scraper
    num_threads = args.num_threads
    print(f"Running scraper: {scraper}. {num_threads} threads will be used for multi-threaded scrapers")

    if scraper == "case_laws":
        get_case_law_files(num_threads=num_threads)
    elif scraper == "case_law_links":
        asyncio.run(get_case_links())
    elif scraper == "acts_links":  # To scrape links and download PDFs
        asyncio.run(get_act_links())
    elif scraper == "acts_files": 
        asyncio.run(get_acts_files())
    elif scraper == "legal_files": 
        asyncio.run(get_legal_files())
    elif scraper == "gazette_files": 
        asyncio.run(scrape_gazettes())
    elif scraper == "bill_files":
        asyncio.run(get_bill_files())
    elif scraper == "repealed_files":
        repealed_download()
    elif scraper == "recent_legislation_files":
        asyncio.run(recent_legislation_files())
    elif scraper == "eac_legislation_files":
        asyncio.run(eac_legislation_files())
    elif scraper == "county_legislation_files":
        asyncio.run(county_legislative_files())
    elif scraper == "constitutional_amendment_files":
        asyncio.run(constitutional_amendment_files())
    else:
        print(f"{scraper} is not recognized.")

if __name__ == "__main__":
    main()