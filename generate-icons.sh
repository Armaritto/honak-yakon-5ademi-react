#!/bin/bash

# Script to generate PWA icons from logo.png
# Requires ImageMagick (convert command)

LOGO_PATH="./src/assets/logo.png"
ICONS_DIR="./public/icons"

# Create icons directory
mkdir -p "$ICONS_DIR"

# Generate 192x192 regular icon
convert "$LOGO_PATH" -resize 192x192 -background white -gravity center -extent 192x192 "$ICONS_DIR/icon-192x192.png"

# Generate 512x512 regular icon
convert "$LOGO_PATH" -resize 512x512 -background white -gravity center -extent 512x512 "$ICONS_DIR/icon-512x512.png"

# Generate maskable versions (for adaptive icons on Android)
convert "$LOGO_PATH" -resize 192x192 -background white -gravity center -extent 192x192 "$ICONS_DIR/icon-192x192-maskable.png"

convert "$LOGO_PATH" -resize 512x512 -background white -gravity center -extent 512x512 "$ICONS_DIR/icon-512x512-maskable.png"

echo "✓ PWA icons generated successfully"
