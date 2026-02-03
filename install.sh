#!/usr/bin/env bash
set -e

REPO="https://github.com/XMA-Faez/yt-transcriber.git"
INSTALL_DIR="${YT_TRANSCRIBER_DIR:-$HOME/.yt-transcriber}"

echo "Installing yt-transcriber..."

if ! command -v bun &> /dev/null; then
  echo "Bun is required but not installed."
  echo "Install it with: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

if [ -d "$INSTALL_DIR" ]; then
  echo "Updating existing installation..."
  cd "$INSTALL_DIR"
  git pull --ff-only
else
  echo "Cloning repository..."
  git clone "$REPO" "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

echo "Installing dependencies..."
bun install

echo "Linking globally..."
bun link

echo ""
echo "yt-transcriber installed successfully!"
echo "Run 'yt-transcriber --help' to get started."
