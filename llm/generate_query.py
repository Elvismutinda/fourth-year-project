from hf_llm import llm
from tavily_list import tavily_search

def get_search_query(user_query):
    """
    Transform the user's legal query into an optimized search query for retrieving relevant case laws,
    statutes, and legal principles.
    """

    prompt = f"""
    You are an expert in transforming legal research questions into effective search queries optimized for the Tavily search engine.
    Your task is to extract the primary legal issue and essential keywords from the user's input and construct a concise search query 
    that maximizes the relevance of Kenyan case law, statutes, and legal principles.

    ### Instructions:
    1. Identify the core legal issue and relevant jurisdiction (Kenyan law).
    2. Use the primary legal topic as the main keyword.
    3. Connect additional specific keywords using "OR" to include related legal aspects.
    4. Exclude general terms like "legal research", "case law database", or "legal articles."
    5. Ensure the query is no longer than 10 words and includes domain-specific legal terminology.

    ### Output Requirements:
    - Provide only the transformed search query.
    - Do not include any additional commentary or explanation.
    - Use logical operators like "OR" to broaden the search while maintaining legal relevance.

    ### Example Transformation:

    - **User Query:** "What are the legal principles of adverse possession in Kenya?"
    - **Transformed Query:** "Adverse possession OR land law OR Kenya"

    Now, generate a search query based on the following user's input:

    **User's input:** "{user_query}"

    **Constraints:**
    - **Length:** Strictly less than 10 words.
    - **Content:** Use legal keywords relevant to Kenyan law.
    - **Format:** Only the search query, no additional text.
    """

    query = llm(prompt)
    return query

def get_query_links(user_query):
    """
    Generate a legal search query and fetch related case law and statutes using Tavily search.
    """
    query = get_search_query(user_query)
    response = tavily_search(query)
    return response

if __name__ == "__main__":
    user_query = "Find Kenyan case law on judicial review and administrative actions"
    query = get_search_query(user_query)
    print(query)

    response = tavily_search(query)
    print(response)

    print("Second function")
    response_1 = get_query_links(user_query)
    print(response_1)

    response_2 = get_query_links("Legal precedent for breach of contract in Kenyan courts")
    print(response_2)
