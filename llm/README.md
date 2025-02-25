## LLM Setup

This folder contains the llm logic for the AI models.

1. **Set Up a Virtual Environment**  
   Create a virtual environment named `.venv` and activate it.

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate    # For Linux/Mac
   .venv\Scripts\activate       # For Windows
   ```

2. **Install Dependencies**  
   Install the required packages from `requirements.txt`.

   ```bash
   pip install -r requirements.txt
   ```

3. **Create the `.env` File**  
   In the root directory, create a `.env` file with the following environment variables:

   - `HUGGINGFACE_API_TOKEN` - Your Hugging Face API key. You can obtain it by creating an account and generating an API token [here](https://huggingface.co/settings/tokens) and requesting access to the Llama 3.2 model [here](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct).
   - `TAVILY_API_KEY` - Your Tavily API key. Create an account and generate an API key [here](https://tavily.com/).
   - `MONGO_URI` - MongoDB URI (optional). Use if you prefer to connect to a local MongoDB instance rather than Atlas.

   Example `.env` file:

   ```plaintext
   HUGGINGFACE_API_TOKEN=your_huggingface_api_key
   TAVILY_API_KEY=your_tavily_api_key
   MONGO_URI=your_mongo_connection_uri   # Optional for local MongoDB
   ```

4. **Set Up MongoDB**  
    Create a MongoDB database named `research_assistant` with the following collections:

   - `research_list`
   - `paper_summary`

5. **Run fastapi**
   ```bash
   python fastapi_main
   ```

---
