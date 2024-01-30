import json
def transform_old_to_new(old_data):
    # 1. Transform main fields
    transformed_data = {
        "app_id": old_data["app_id"],
        "run_id": old_data["run_id"],
        "type": "apps",  # Assuming "apps" is a constant value
        "href": old_data["app_url"],
        "app_version": old_data["app_version"],
        "app_name": old_data["app_name"],
        "app_url": "",  # You want it to be an empty string
        "country_code": old_data["country_code"],
    }
    # 2. Transform metadata
    metadata = {
        "user_rating_value": float(old_data["user_rating_value"]),  # Convert to a float
        "user_rating_count": int(old_data["user_rating_count"]),  # Convert to an integer
        "user_rating_label": old_data["user_rating_label"],
        "artist_name": old_data["artist_name"],
        "web_url": "",  # You want it to be an empty string
        "app_store_position": old_data["app_store_position"],
        "app_store_genre_name": old_data["app_store_genre_name"],
        "app_store_genre_code": old_data["app_store_genre_code"],
        "app_store_chart": old_data["app_store_chart"],
        "content_rating": old_data["content_rating"],
        "distribution_kind": old_data["distribution_kind"],
        "version_release_date": old_data["version_release_date"],
        "release_date": old_data["release_date"],
        "privacy_policy_url": old_data["privacy_policy_url"],
        "has_in_app_purchases": (old_data["has_in_app_purchases"]),  # Convert to boolean
        "seller": old_data["seller"],
        "price_formatted": old_data["price_formatted"],
        "price": old_data["price"],
        "currency_code": old_data["currency_code"],
        "app_flavor": old_data["app_flavor"],
        "app_size": old_data["app_size"],
    }
    transformed_data["metadata"] = metadata
    # 3. Transform privacy labels
    privacylabels = {
        "privacyDetails": []
    }
    for privacy in old_data["privacy_types"]:
        privacy_type_mapping = {
            "DATA_LINKED_TO_YOU": "Data Linked to You",
            "DATA_NOT_LINKED_TO_YOU": "Data Not Linked to You",
            "DATA_NOT_COLLECTED": "Data Not Collected",
            "DATA_USED_TO_TRACK_YOU": "Data Used to Track You"
        }
        new_privacy = {
            "privacyTypes": privacy_type_mapping[privacy["privacy_type"]],
            "identifier": privacy["privacy_type"],
            "dataCategories": [],
        }
        for purpose in privacy["purposes"]:
            for data_category in purpose["datacategories"]:
                data_mapping = {
                    "CONTACT_INFO": "Contact Info",
                    "IDENTIFIERS": "Identifiers",
                    "USAGE_DATA": "Usage Data",
                    "DIAGNOSTICS": "Diagnostics",
                    "LOCATION": "Location",
                    "USER_CONTENT": "User Content",
                    "PURCHASES": "Purchases",
                    "FINANCIAL_INFO": "Financial Info",
                    "OTHER": "Other",
                    "SEARCH_HISTORY": "Search History",
                    "CONTACTS": "Contacts",
                    "HEALTH_AND_FITNESS": "Health and Fitness",
                    "BROWSING_HISTORY": "Browsing History",
                    "SENSITIVE_INFO": "Sensitive"
                }
                data_category_info = {
                    "dataCategory": data_mapping[data_category["data_category"]],
                    "dataTypes": [
                        {
                            "data_category": int(data_type["data_category"]),
                            "data_type": data_type["data_type"]
                        }
                        for data_type in data_category["datatypes"]
                    ]
                }
                new_privacy["dataCategories"].append(data_category_info)
        privacylabels["privacyDetails"].append(new_privacy)
    transformed_data["privacylabels"] = privacylabels
    return transformed_data
null = None
def buildDataJson():
    with open('transferFinal.json', 'r') as inputFile:
        for i in range(1, 70):
            new_data = []  # Initialize an empty list to store the transformed data
            count = 0
            # Iterate through each line in the input file
            for line in inputFile:
                old_data_example = json.loads(line)  # Parse each line as a JSON object
                if(old_data_example["run_id"] != i):
                    break
            # Perform your transformation on old_data_example
                transformed_data = transform_old_to_new(old_data_example)
                new_data.append(transformed_data)  # Append the transformed data to the list
                print("Line " + str(count) + " complete")
                count = count + 1
  
    # Open the output file for writing
            with open(f'./same_apps/sameApps{i}.json', 'w') as outputFile:
                for item in new_data:
                # Convert the transformed data back to JSON format and write it to the output file
                    json.dump(item, outputFile)
                    outputFile.write('\n')  # Add a newline to separate each JSON object
    print("Data has been transformed and written")

if __name__ == "__main__":
    buildDataJson()