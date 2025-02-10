import os
import json
from playwright.sync_api import sync_playwright, expect
import traceback
import csv
import re
import uuid
import threading


# Lock to prevent several threads from modifying the same file simultaneously
file_lock = threading.Lock()


def generate_file_name():
	return str(uuid.uuid4())


def download_file(page, locator, output_dir='./output/case_laws'):
	print(f"Attempting file dowload")
	local_file_location = file_location = None

	# Wait for the download event and click the download button
	with page.expect_event('download', timeout=60000) as download_info:
		locator.nth(0).click()
	
	download = download_info.value
	suggested_filename = download.suggested_filename
	file_name = suggested_filename if suggested_filename else generate_file_name()
	local_file_location = file_location = f"{output_dir}/{file_name}"

	download.save_as(file_location)

	# Save the download object
	# if FILE_STORAGE == 'aws':
	# 	file_location = upload_to_aws(file_location, f"case_laws/{file_name}")
	# 	# Delete the copied file
	# 	os.remove(local_file_location)

	# Delete the temporary download file
	download.delete()

	return file_location


def extract_table_data(page, locator):
	print(f"Attempting metadata extraction")
	table_data = []

	try:
		# Click on the first Metadata button encountered
		locator.nth(0).click()

		# At this point we expect the page table to be visible
		table_locator = page.locator("table[class=meta_info]").nth(0)

		expect(table_locator).to_be_visible(timeout=30000)

		row_locator = table_locator.locator("tr")

		# Loop through all rows
		for i in row_locator.all():
			th = i.locator("th")
			td = i.locator("td")

			if th.count() and td.count():
				header = th.nth(0).text_content().strip()
				value = td.nth(0).text_content().strip()
				table_data.append((header, value))

		return dict(table_data)

	except:
		error_message = traceback.format_exc()
		print(error_message) # Log this to AWS Cloudwatch if FILE_STORAGE is set to 'aws'

def chunk_list(lst, num_chunks):
    # Calculate the size of each chunk
    chunk_size = len(lst) // num_chunks
    # Calculate the remainder to distribute among the first chunks
    remainder = len(lst) % num_chunks

    chunks = []
    start = 0

    for i in range(num_chunks):
        # Calculate the end index for the current chunk
        end = start + chunk_size + (1 if i < remainder else 0)
        # Append the chunk to the list
        chunks.append(lst[start:end])
        # Update the start index for the next chunk
        start = end

    return (chunk_size, chunks)


def append_to_json(data, filename):
    if os.path.isfile(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
    else:
        existing_data = []

    existing_data.append(data)

    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(existing_data, file, indent=4)
    

    return

def download_files_from_links(urls, output_dir, case_file_path):
	# Compile download link patterns - We will use this to detect download buttons
	# Using Regex
	preferred_formats = ['PDF', 'DOCX', 'DOC', 'Original Document', 'XML']

	download_link_patterns = {
		fmt: re.compile(rf"(?i)Download {fmt}")
		for fmt in preferred_formats
	}

	with sync_playwright() as p:
		browser = p.firefox.launch(headless=True, downloads_path=output_dir)

		for url in urls:
			print(f"{'*'*50}\n{url}\n")

			file_location = None
			metadata = None
			download_link_locator = None

			page = browser.new_page()

			try:               
				page.goto(url, timeout=120000)

				# Get all anchor tags with a title attribute
				# with the value 'Show Metadata'

				# Locate all anchor tags with a title attribute having value 'Show Metadata'	
				metadata_locator = page.locator("a[title=Metadata]")

				# Locate all anchor tags with a title attribute
				all_anchor_tags = page.locator("a[title]")

				# At this point we expect metadata button to be visible
				expect(metadata_locator).to_be_visible()

				for fmt in preferred_formats:
					pattern = download_link_patterns[fmt]

					if all_anchor_tags.count():
						for d in all_anchor_tags.all():
							title = d.get_attribute("title")
							# Check if title attribute matches 'Download X'
							if pattern.match(title):
								download_link_locator = d
								print(f"Found download link: {title}")
								break

					if download_link_locator:
						break


				# Check if there is at least one of the files to be downloaded and its metadata
				if metadata_locator.count() and download_link_locator:
					metadata = extract_table_data(page, metadata_locator)
					file_location = download_file(page, download_link_locator)

				if file_location and metadata:
					with file_lock:
						append_to_json(
							{"url": url, "file_location": file_location, "metadata": metadata},
							case_file_path
						)

			except:
				error_message = f"Failed to get data from {url}:\n{traceback.format_exc()}"
				print(error_message) # Log this to AWS Cloudwatch if FILE_STORAGE is set to 'aws'

			page.close()


		browser.close()

	return (metadata, file_location)


def get_case_law_files(output_dir='./output/case_laws', num_threads=10):
	case_file_path = f"{output_dir}/case_laws.json"
	links_file_path = f"{output_dir}/case_law_links.csv"
	scraped_urls = set()
	urls = []

	# Retrieve the links to be scraped
	if not os.path.exists(links_file_path):
		raise FileNotFoundError("Case law links file is missing.")
	
	with open(links_file_path, "r") as links_file:
		urls = [u[0] for u in csv.reader(links_file)]
	

	# Check the files we have already downloaded
	if os.path.exists(case_file_path):
		with open(case_file_path, "r") as fo:
			scraped_urls = set(x["url"] for x in json.load(fo))

	# Use list comprehension to get a list of links that have not been downloaded yet -> O(1) set()
	urls = [y for y in urls if y not in scraped_urls]
	print(f"Scraping {len(urls)} links.\n")


	# Chunk the list into NUM_THREADS lists
	chunk_size, chunked_list = chunk_list(urls, num_threads)
	threads = []

	# Divide the work among threads
	print(f"Splitting work into {num_threads} threads of {chunk_size} urls")
	for i in chunked_list:
		threads.append(
			threading.Thread(
				target=download_files_from_links,
				args=(i, output_dir, case_file_path)
			)
		)

	for thread in threads:
		thread.start()

	for thread in threads:
		thread.join()


if __name__ == "__main__":
	get_case_law_files()
