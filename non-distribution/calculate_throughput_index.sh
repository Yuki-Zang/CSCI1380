#!/bin/bash

# Record the start time
START_TIME=$(date +%s)

# Check if the required input file exists
if [ ! -f "$1" ]; then
  echo "Input file $1 does not exist."
  exit 1
fi

# Output file for saving the index results
OUTPUT_FILE="index_output.txt"

# Record the start time for the indexing process
INDEX_START_TIME=$(date +%s)

# Run the index.sh script and save the results to the output file
./index.sh "$1" "$2" >> "$OUTPUT_FILE" 2>&1

# Record the end time for the indexing process
INDEX_END_TIME=$(date +%s)

# Calculate the time taken for the indexing process
INDEX_TIME_TAKEN=$((INDEX_END_TIME - INDEX_START_TIME))

# Record the end time of the entire process
END_TIME=$(date +%s)

# Calculate the total time taken
TOTAL_TIME_TAKEN=$((END_TIME - START_TIME))

# Write the total time to the output file
echo "Total time taken: $TOTAL_TIME_TAKEN seconds"
