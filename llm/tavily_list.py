import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

tavily_client= TavilyClient(api_key=TAVILY_API_KEY)

# Define the search function
def tavily_search(query, max_results=5):
    """
    Perform a legal search using the TavilyClient with the given query.

    Args:
        query (str): The search query string provided by the user.
        max_results (int, optional): The maximum number of search results to return.
                                     Defaults to 5 if not provided.

    Returns:
        dict: A dictionary containing the search response from TavilyClient, including 
              search results and any additional information like summaries.

    Example:
        response = tavily_search("Judicial review principles in Kenya", 5)
        print(response)

    Notes:
        - The search prioritizes legal sources such as Kenya Law Reports.
        - It excludes general, non-legal domains.
        - The search includes short summaries but excludes images and raw content.
    """

    # Define the legal search parameters
    params = {
        "search_depth": "advanced",  # "basic" or "advanced"
        "topic": "general",  # "general" or "news"
        "max_results": max_results,  # User-specified max number of results
        "include_images": False,  # Include images in the response
        "include_image_descriptions": False,  # Include descriptions of the images
        "include_answer": True,  # Include a short answer to the query
        "include_raw_content": False,  # Exclude the raw content of the search results
        "include_domains": [
            "new.kenyalaw.org" # New official Kenya Law Reports judgments
        ],  
        "exclude_domains": ["*"],  # Exclude non-legal sources unless explicitly included
    }

    # Perform the search
    response = tavily_client.search(query, **params)

    return response

if __name__ == "__main__":
    query = "Judicial review principles in Kenya"
    response = tavily_search(query, 2)
    print(response)
