#!/bin/bash
set -euo pipefail

sudo -v

show_help() {
    cat <<EOF_HELP
yt-transcriber Installer

Usage: $0 [OPTION] [VERSION]

Options:
  local     Build from source (default if in repo)
  bin       Install precompiled binary
  -v, --version VERSION  Install specific git tag/version
  --help    Show this help message

Examples:
  $0 local            # Build from local source
  $0 bin              # Install latest binary
  $0 -v v1.0.0        # Install version v1.0.0 from source
  $0 bin -v v1.0.0    # Install version v1.0.0 binary
EOF_HELP
    exit 0
}

MODE=""
VERSION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        local)
            MODE="local"
            shift
            ;;
        bin|remote)
            MODE="bin"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

START_DIR=$(pwd)

if [ -f "$START_DIR/PKGBUILD" ] && [ -f "$START_DIR/Cargo.toml" ] && [ -z "$VERSION" ]; then
    echo "Detected local repository..."
    [ -z "$MODE" ] && MODE="local"

    if [ "$MODE" = "bin" ]; then
        TMP_DIR=$(mktemp -d)
        trap 'rm -rf "$TMP_DIR"' EXIT
        cp "$START_DIR/PKGBUILD.bin" "$TMP_DIR/PKGBUILD"
        cp "$START_DIR/yt-transcriber.install" "$TMP_DIR/"
        cd "$TMP_DIR"
        makepkg -si
    else
        TMP_DIR=$(mktemp -d)
        trap 'rm -rf "$TMP_DIR"' EXIT
        echo "Copying source files to temporary directory..."
        cd "$START_DIR"

        {
            git ls-files --cached --exclude-standard | while IFS= read -r file; do
                [ -e "$file" ] && echo "$file"
            done
            git ls-files --others --exclude-standard
        } | tar -czf - -T - | (cd "$TMP_DIR" && tar xzf -)

        cd "$TMP_DIR"

        cd "$START_DIR"
        if ! git diff --quiet || ! git diff --cached --quiet 2>/dev/null; then
            echo "Detected unstaged changes, appending +wip to version..."
            sed -i 's/^version = "\([^"]*\)"/version = "\1+wip"/' "$TMP_DIR/Cargo.toml"
            rm -f "$TMP_DIR/Cargo.lock"
            sed -i 's/cargo build --release --locked/cargo build --release/' "$TMP_DIR/PKGBUILD"
            sed -i 's/^pkgver=.*/&+wip/' "$TMP_DIR/PKGBUILD"
        fi
        cd "$TMP_DIR"

        echo "Building package as normal user..."
        makepkg

        echo "Installing package as root..."
        sudo -v
        sudo pacman -U --noconfirm *.pkg.tar.zst
    fi
else
    echo "Remote install..."
    [ -z "$MODE" ] && MODE="bin"
    TMP_DIR=$(mktemp -d)
    trap 'rm -rf "$TMP_DIR"' EXIT
    cd "$TMP_DIR"
    if [ "$MODE" = "bin" ]; then
        if [ -n "$VERSION" ]; then
            if curl -fsSL "https://raw.githubusercontent.com/Faeziix/yt-transcriber/$VERSION/PKGBUILD.bin" >/dev/null 2>&1; then
                curl -fsSL -o PKGBUILD "https://raw.githubusercontent.com/Faeziix/yt-transcriber/$VERSION/PKGBUILD.bin"
                curl -fsSL -o yt-transcriber.install "https://raw.githubusercontent.com/Faeziix/yt-transcriber/$VERSION/yt-transcriber.install"
            else
                echo "Finding newest version matching $VERSION..."
                LATEST_TAG=$(git ls-remote --tags https://github.com/Faeziix/yt-transcriber.git \
                    | grep "refs/tags/.*$VERSION" \
                    | sed 's|.*/\(.*\)|\1|' \
                    | sort -V \
                    | tail -n1)
                if [ -n "$LATEST_TAG" ]; then
                    echo "Using version: $LATEST_TAG"
                    curl -fsSL -o PKGBUILD "https://raw.githubusercontent.com/Faeziix/yt-transcriber/$LATEST_TAG/PKGBUILD.bin"
                    curl -fsSL -o yt-transcriber.install "https://raw.githubusercontent.com/Faeziix/yt-transcriber/$LATEST_TAG/yt-transcriber.install"
                else
                    echo "Error: No version found matching $VERSION"
                    exit 1
                fi
            fi
        else
            curl -fsSL -o PKGBUILD "https://raw.githubusercontent.com/Faeziix/yt-transcriber/main/PKGBUILD.bin"
            curl -fsSL -o yt-transcriber.install "https://raw.githubusercontent.com/Faeziix/yt-transcriber/main/yt-transcriber.install"
        fi
    else
        if [ -n "$VERSION" ]; then
            if git ls-remote --tags https://github.com/Faeziix/yt-transcriber.git | grep -q "refs/tags/$VERSION$"; then
                git -c advice.detachedHead=false clone --branch "$VERSION" https://github.com/Faeziix/yt-transcriber.git repo
                cd repo
            else
                echo "Finding newest version matching $VERSION..."
                LATEST_TAG=$(git ls-remote --tags https://github.com/Faeziix/yt-transcriber.git \
                    | grep "refs/tags/.*$VERSION" \
                    | sed 's|.*/\(.*\)|\1|' \
                    | sort -V \
                    | tail -n1)
                if [ -n "$LATEST_TAG" ]; then
                    echo "Using version: $LATEST_TAG"
                    git -c advice.detachedHead=false clone --branch "$LATEST_TAG" https://github.com/Faeziix/yt-transcriber.git repo
                    cd repo
                else
                    echo "Error: No version found matching $VERSION"
                    exit 1
                fi
            fi
        else
            git clone https://github.com/Faeziix/yt-transcriber.git repo
            cd repo
        fi
        curl -fsSL -o PKGBUILD "https://raw.githubusercontent.com/Faeziix/yt-transcriber/main/PKGBUILD"
        curl -fsSL -o yt-transcriber.install "https://raw.githubusercontent.com/Faeziix/yt-transcriber/main/yt-transcriber.install"
    fi

    echo "Building package as normal user..."
    makepkg

    echo "Installing package as root..."
    sudo -v
    sudo pacman -U --noconfirm *.pkg.tar.zst
fi

echo ""
echo "Installation complete! yt-transcriber is now installed."
echo ""
echo "Usage examples:"
echo "  yt-transcriber <URL>                    # Extract transcript"
echo "  yt-transcriber <URL> -o output.txt     # Save to file"
echo "  yt-transcriber <URL> -f srt            # Output as SRT"
echo "  yt-transcriber --help                   # Show all options"
echo ""
