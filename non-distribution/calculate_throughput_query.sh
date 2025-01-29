#!/bin/bash

# Check if the input string is provided
if [ -z "$1" ]; then
  echo "Please provide a search string."
  exit 1
fi

# Record the start time
START_TIME=$(date +%s)

# Run the query.js script with the input string as argument
node ./query.js "$1"

# Record the end time
END_TIME=$(date +%s)

# Calculate the time taken in milliseconds
TIME_TAKEN=$(( (END_TIME - START_TIME) * 1000 ))

# Print the time taken in milliseconds
echo "Time taken for the query: ${TIME_TAKEN} ms"
