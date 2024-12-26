## EXECUTION

### Folder

Create required folders -> output/case_laws, acts, legal_notices

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


### Environment Variables

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`FILE_STORAGE`

`AWS_BUCKET`

### Run Script

#### Case Laws

`nohup python scraper.py case_law_links &`

`nohup python scraper.py case_laws --num_threads=15 &`

#### Acts

`nohup python scraper.py acts_files`

#### Legal Notices

`nohup python scraper.py legal_files`

#### Gazette Notices

`python scraper.py gazette_files`

#### Bills

`python scraper.py bill_files`

#### Repealed Statutes

`python scraper.py repealed_files`

#### Recent Legislation

`python scraper.py recent_legislation_files`

#### EAC Legislation

`python scraper.py eac_legislation_files`

#### County Legislative Information

`python scraper.py county_legislation_files`

#### Constitutional Amendment

`python scraper.py constitutional_amendment_files`


