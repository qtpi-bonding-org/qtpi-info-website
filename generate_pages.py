import os
import yaml
import sys

# Define the default data file path
default_data_file_path = "_data/personality_data.yml"
output_dir = "_results"


def generate_jekyll_pages(data_file_path):
    """
    Reads personality data from a YAML file and generates a Jekyll page for each entry.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    try:
        with open(data_file_path, "r") as file:
            data = yaml.safe_load(file)
            pie_personalities = data.get("pie_personalities", {})
    except FileNotFoundError:
        print(f"Error: The file '{data_file_path}' was not found.")
        return

    print(f"Found {len(pie_personalities)} personality types.")

    for code, details in pie_personalities.items():
        # Define the content of the new page
        front_matter = f"""---
layout: pie_result
title: "{details['pieType']}"
code: "{code}"
permalink: /results/{code}/
---
"""
        # Define the output filename
        filename = f"{code}.md"
        output_path = os.path.join(output_dir, filename)

        # Write the content to the new file
        with open(output_path, "w") as new_file:
            new_file.write(front_matter)
        print(f"Generated page: {output_path}")

    print("All personality result pages have been generated successfully.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Use the path provided as a command-line argument
        custom_path = sys.argv[1]
        print(f"Using custom data file path: {custom_path}")
        generate_jekyll_pages(custom_path)
    else:
        # Use the default path if no argument is provided
        print(
            f"No custom path provided. Using default data file: {default_data_file_path}"
        )
        generate_jekyll_pages(default_data_file_path)
