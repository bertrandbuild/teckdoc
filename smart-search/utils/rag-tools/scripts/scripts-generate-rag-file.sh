#!/bin/sh

# Define the correct base directory relative to the script's location
base_dir="../../../contents/docs"

# Define the output directory and file
output_dir="../rag-docs"
output_file="$output_dir/all_docs_content.txt"

# Initialize paths
echo "==============================================="
echo "Initializing paths..."
echo "Source directory: $base_dir"
echo "Output directory: $output_dir"
echo "Output file: $output_file"
echo "==============================================="

# Check if the base directory exists
if [ ! -d "$base_dir" ]; then
    echo "Error: The directory $base_dir does not exist."
    exit 1
fi

# Create the output directory if it doesn't exist
if [ ! -d "$output_dir" ]; then
    echo "Output directory $output_dir does not exist. Creating it."
    mkdir "$output_dir"
else
    echo "Output directory $output_dir already exists."
fi

# Check if the output file exists
if [ -f "$output_file" ]; then
    echo "Output file $output_file already exists. Clearing its content."
    : > "$output_file"  # Clear the file's content
else
    echo "Output file $output_file does not exist. Creating it."
    touch "$output_file"  # Create the file
fi

# Verify the output file is writable
if [ ! -w "$output_file" ]; then
    echo "Error: The file $output_file is not writable."
    exit 1
fi

# Count the total number of lines in all .mdx files before collecting content
echo "Counting total lines in all .mdx files..."
total_lines=$(find "$base_dir" -type f -name "*.mdx" -exec wc -l {} + | awk '{total += $1} END {print total}')
echo "Total lines in all .mdx files: $total_lines"
echo "==============================================="

# Recursively find all .mdx files, and append their content to the output file
echo "Collecting content from .mdx files..."
find "$base_dir" -type f -name "*.mdx" -print0 | while IFS= read -r -d '' file; do
    echo "Processing: $file"
    echo "------------------------" >> "$output_file"
    echo "File: $file" >> "$output_file"
    echo "------------------------" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n\n" >> "$output_file"
done
echo "==============================================="
echo "All content has been collected into $output_file."
echo "==============================================="

# Count the lines in the output file
output_file_lines=$(wc -l < "$output_file")
echo "Total lines in $output_file: $output_file_lines"

# Compare the total line count with the number of lines in the output file
if [ "$total_lines" -eq "$output_file_lines" ]; then
    echo "Success: Line counts match. The operation was successful."
else
    echo "Warning: Line counts do not match. Something may have gone wrong."
fi

# Count the number of elements (files) in the entire contents directory
echo "==============================================="
count=$(find ../../contents -type f | wc -l)
echo "Number of elements (files) in ../contents directory: $count"
echo "==============================================="
