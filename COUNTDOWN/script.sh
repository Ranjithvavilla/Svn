#!/bin/bash

# SVN to Git Migration Script
# Args: $1 -> SVN URL, $2 -> Git Target Directory

svn_url="$1"
git_dir="$2"

# Check if SVN URL is provided
if [ -z "$svn_url" ]; then
    echo '{"message":"SVN URL not provided."}'
    exit 1
fi

# Check if Git directory is provided
if [ -z "$git_dir" ]; then
    echo '{"message":"Git directory not provided."}'
    exit 1
fi

# Initialize the Git repository in the target directory
git init "$git_dir" || {
    echo '{"message":"Failed to initialize Git repository."}'
    exit 1
}

# Clone the SVN repository
cd "$git_dir"
git svn clone "$svn_url" --stdlayout || {
    echo '{"message":"Error cloning SVN repository."}'
    exit 1
}

# Fetch commit history and save it to JSON format
git log --pretty=format:'{"commit": "%H", "author": "%an", "date": "%ad", "message": "%s"},' > commits.json

# Add brackets to make it valid JSON
sed -i '1i[' commits.json
echo "]" >> commits.json

echo '{"message":"SVN to Git migration completed successfully!"}'
exit 0
