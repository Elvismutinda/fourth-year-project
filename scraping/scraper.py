import sys
import argparse
import asyncio
from case_laws.case_law_downloader import get_case_law_files
from case_laws.case_link_scraper import get_case_links


def main():
    parser = argparse.ArgumentParser(description="Run a specific scraper with optional number of threads.")
    
    parser.add_argument("scraper", choices=["case_laws", "case_law_links"],
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
    else:
        print(f"{scraper} is not recognized.")

if __name__ == "__main__":
    main()