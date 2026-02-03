#!/usr/bin/env bash
set -e

REPO="https://github.com/XMA-Faez/yt-transcriber.git"
INSTALL_DIR="${YT_TRANSCRIBER_DIR:-$HOME/.yt-transcriber}"
BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"

echo "Installing yt-transcriber..."

if ! command -v bun &> /dev/null; then
  echo "Bun not found. Installing bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$BUN_INSTALL"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

if ! command -v git &> /dev/null; then
  echo "Error: git is required but not installed."
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
echo ""
echo "If this is a fresh bun install, restart your terminal or run:"
echo "  source ~/.bashrc  # or ~/.zshrc"
echo ""
echo "Then run 'yt-transcriber --help' to get started."
