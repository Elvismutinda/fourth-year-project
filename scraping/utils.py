import os
import json
import boto3
import traceback
import os


FILE_STORAGE = os.environ.get("FILE_STORAGE", "local")
AWS_BUCKET = os.environ.get("AWS_BUCKET")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")


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

def upload_to_aws(file_path, file_name):
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    try:
        print("Uploading file to AWS")
        s3.upload_file(file_path, AWS_BUCKET, file_name)
        return f"s3://{AWS_BUCKET}/{file_name}"
    except Exception as e:
        traceback.print_exc() # Log this to AWS Cloudwatch

    return
