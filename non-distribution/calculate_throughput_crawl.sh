#!/bin/bash

# Record the start time
START_TIME=$(date +%s)

# Check if the input file is provided
if [ -z "$1" ]; then
  echo "Please provide a text file containing URLs."
  exit 1
fi

# Output file for saving crawl results
OUTPUT_FILE="d/content.txt"

# Read each URL from the input file
while IFS= read -r url
do
  echo "Processing URL: $url"
  
  # Record the start time for the current URL
  URL_START_TIME=$(date +%s)

  # Execute the original script for each URL and save its output to the file
  ./crawl.sh "$url" >> "$OUTPUT_FILE"

  # Record the end time for the current URL
  URL_END_TIME=$(date +%s)

  # Calculate the time taken for the current URL
  URL_TIME_TAKEN=$((URL_END_TIME - URL_START_TIME))
  echo "Time taken for $url: $URL_TIME_TAKEN seconds"
done < "$1"

# Record the end time
END_TIME=$(date +%s)

# Calculate the total time taken
TOTAL_TIME_TAKEN=$((END_TIME - START_TIME))
echo "Total time for $url: $TOTAL_TIME_TAKEN seconds"