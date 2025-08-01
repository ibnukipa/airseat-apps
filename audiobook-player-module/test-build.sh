#!/bin/bash

echo "Testing AudiobookPlayerModule build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the audiobook-player-module directory."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Clean previous builds
echo "Cleaning previous builds..."
npm run clean

# Build the module
echo "Building the module..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "The module is ready to use."
else
    echo "❌ Build failed!"
    echo "Please check the error messages above."
    exit 1
fi