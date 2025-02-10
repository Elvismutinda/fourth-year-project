## EXECUTION

### Folder

Create required folders in the specific directories -> output/case_laws in case-laws directory and output/acts in acts directory

### You could optionally use Python venv (using terminal)

1. Ensure you have python3-venv installed.
`sudo apt install python3-venv`

2. Create the python virtual env
`python3 -m venv scraper-venv`

3. Activate the python virtual env
`source scraper-venv/bin/activate`

### Install Dependencies

    sudo apt-get install libatk1.0-0t64\
        libatk-bridge2.0-0t64\
        libcups2t64\
        libatspi2.0-0t64\
        libxcomposite1\
        libxdamage1\
        libxfixes3\
        libxrandr2\
        libgbm1\
        libpango-1.0-0\
        libcairo2\
        libasound2t64 \
        libx11-xcb1 \
        libxcursor1 \
        libgtk-3-0t64 \
        libpangocairo-1.0-0 \
        libcairo-gobject2 \
        libgdk-pixbuf-2.0-0

`pip install -r requirements.txt`

### Run Script

#### Case Laws

`cd case_laws`

`python3 case_link_scraper.py`

`python3 case_law_downloader.py`

OR run it using scraper.py in the root directory

`nohup python scraper.py case_law_links &`

`nohup python scraper.py case_laws --num_threads=15 &`

#### Acts

`cd acts`

`python3 act_links_scraper.py`
