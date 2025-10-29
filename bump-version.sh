#!/bin/bash

# Script to bump version in package.json and manifest.json
# Usage: ./bump-version.sh <major|minor|patch>

set -e

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "Error: No version bump type specified"
    echo "Usage: $0 <major|minor|patch>"
    exit 1
fi

BUMP_TYPE=$1

# Validate argument
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo "Error: Invalid version bump type '$BUMP_TYPE'"
    echo "Usage: $0 <major|minor|patch>"
    exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(grep -o '"version": *"[^"]*"' package.json | sed 's/"version": *"\(.*\)"/\1/')

if [ -z "$CURRENT_VERSION" ]; then
    echo "Error: Could not find version in package.json"
    exit 1
fi

echo "Current version: $CURRENT_VERSION"

# Split version into components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Bump the appropriate version component
case $BUMP_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update package.json
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
else
    # Linux
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
fi

# Update manifest.json
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" manifest.json
else
    # Linux
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" manifest.json
fi

echo "Version bumped successfully in package.json and manifest.json"

# Git tag the new version
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo ""
    read -p "Enter commit message (default: 'chore: bump version to $NEW_VERSION'): " COMMIT_MSG
    
    # Use default message if user input is empty
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="chore: bump version to $NEW_VERSION"
    fi
    
    echo "Creating git tag v$NEW_VERSION..."
    git add package.json manifest.json
    git commit -m "$COMMIT_MSG"
    git tag "v$NEW_VERSION"
    echo "Git tag v$NEW_VERSION created successfully"
else
    echo "Warning: Not a git repository, skipping git tag"
fi

