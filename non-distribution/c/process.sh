#!/bin/bash

# Convert input to a stream of non-stopword terms
# Usage: ./process.sh < input > output

# Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
# Commands that will be useful: tr, iconv, grep
# cat | tr -c 'a-zA-Z\n' '[\n*]' | tr 'A-Z' 'a-z' | iconv -f utf-8 -t ascii//TRANSLIT | grep -w -v -f /usr/src/app/non-distribution/d/stopwords.txt
cat | tr -c '[:alpha:]\n' '[\n*]' | tr '[:upper:]' '[:lower:]' | iconv -f utf-8 -t ascii//TRANSLIT | grep -w -v -f "$(dirname "$0")/../d/stopwords.txt"
