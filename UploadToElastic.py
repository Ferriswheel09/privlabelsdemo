from elasticsearch import Elasticsearch
import json
from collections import defaultdict
import argparse
import urllib3
import json
import os
from dotenv import load_dotenv

load_dotenv()
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class AppleElasticSearchHandler:
  def __init__(self, server_url, index_name, username, password):
    self.es = Elasticsearch([server_url], http_auth=(username, password), verify_certs=False)
    self.index_name = index_name

  def get_document_count(self):
    res = self.es.count(index=self.index_name)
    return res['count']

  def create_index(self):
    apple_mapping = {
                  "mappings": {
                    "properties": {
                      "app_id": {"type": "keyword"},
                      "type": {"type": "keyword"},
                      "href": {"type": "keyword"},
                      "app_version": {"type": "keyword"},
                      "app_name": {"type": "keyword"},
                      "app_url": {"type": "keyword"},
                      "country_code": {"type": "keyword"},
                      "metadata": {
                        "properties": {
                            "user_rating_value": {"type": "float"},
                            "user_rating_count": {"type": "integer"},
                            "user_rating_label": {"type": "keyword"},
                            "artist_name": {"type": "keyword"},
                            "web_url": {"type": "keyword"},
                            "app_store_position": {"type": "integer"},
                            "app_store_genre_name": {"type": "keyword"},
                            "app_store_genre_code": {"type": "integer"},
                            "app_store_chart": {"type": "keyword"},
                            "content_rating": {"type": "keyword"},
                            "distribution_kind": {"type": "keyword"},
                            "version_release_date": {"type": "date"},
                            "release_date": {"type": "date"},
                            "privacy_policy_url": {"type": "keyword"},
                            "has_in_app_purchases": {"type": "integer"},
                            "seller": {"type": "keyword"},
                            "price_formatted": {"type": "keyword"},
                            "price": {"type": "float"},
                            "currency_code": {"type": "keyword"},
                            "app_flavor": {"type": "keyword"},
                            "app_size": {"type": "long"}  # Changed to integer for app size
                        }
                      },
                      "privacylabels": {
                        "properties": {
                            "privacyDetails": {
                                "type": "nested",
                                "properties": {
                                    "privacyTypes": {"type": "keyword"},
                                    "identifier": {"type": "keyword"},
                                    "dataCategories": {
                                        "properties": {
                                            "dataCategory": {"type": "keyword"},
                                            "dataTypes": {
                                                "type": "nested",
                                                "properties": {
                                                    "data_category": {"type": "integer"},
                                                    "data_type": {"type": "keyword"}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
    }
    try:
      if not self.es.indices.exists(index=self.index_name):
        self.es.indices.create(index=self.index_name, body=apple_mapping)
        # self.es.indices.create(index=self.index_name)
    except Exception as e:
      print(e)

  # def index_apple_data(self, apple_json):
  #   for key, app_data in apple_json.items():
  #     self.es.index(index=self.index_name, body=app_data[0])

  # def index_apple_data(self, apple_json_file_path):
  #   with open(apple_json_file_path, 'rb') as f:
  #     # Assuming the top-level structure is an object
  #     objects = ijson.items(f, 'item')
  #     for obj in objects:
  #       for key, app_data_list in obj.items():
  #         for app_data in app_data_list:
  #           self.es.index(index=self.index_name, body=app_data)

  def stream_and_update(self, filename):
    """Streams data from a JSON file and sends updates to Elasticsearch line by line."""
    with open(filename, 'r') as file:
      for line in file:
        try:
          item = json.loads(line)
          key = item['app_id']  # Assuming 'app_id' is the unique identifier for each app
          self.es.update(index=self.index_name, id=key, body={"doc": item, "doc_as_upsert": True})
          # print(f"Successfully updated document with id {key}")
        except Exception as e:
          print(f"Failed to update document. Error: {e}")

            
  
def main():
  # parser = argparse.ArgumentParser()
  # parser.add_argument("apple_crawl")
  # args = parser.parse_args()
  # es = Elasticsearch(hosts=['https://localhost:9200'], basic_auth=('elastic', 'Z*xjGkzvhNlndz5YrO0y'), verify_certs=False)
  # delete_index(es, 'apple')
  # es_handler.create_index()
  server_url = "https://localhost:9200"  
  
  #Input the username and password here
  username = "elastic"
  password = os.getenv('ELASTIC_PASSWORD')

  print(password)

  # Initialize the AppleElasticSearchHandler
  print("Start")
  for i in range(1,70):
    apple_elastic_handler = AppleElasticSearchHandler(server_url, f'run{i}', username, password)


  # Create index with the specified mapping
    apple_elastic_handler.create_index()

  # Index Apple data (replace 'apple_data.json' with your actual file)

    apple_elastic_handler.stream_and_update(f'./final/run{i}.json')
    print("Finished run " + str(i))


if __name__ == "__main__":
  main()

