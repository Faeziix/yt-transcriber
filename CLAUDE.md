# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
cargo build --release          # Build optimized binary
cargo run -- <url>             # Run directly with arguments
./install.sh local             # Build and install via makepkg
```

## Architecture

Single-file Rust CLI (`src/main.rs`) that extracts YouTube transcripts using yt-dlp as an external dependency.

**Flow:**
1. Parse CLI args (clap) → extract video ID from various YouTube URL formats
2. Shell out to `yt-dlp` to download VTT subtitles to a temp directory
3. Parse VTT content, deduplicate overlapping segments (auto-generated captions have duplicates)
4. Format output as TXT/SRT/JSON

**Key functions:**
- `extract_video_id()` - Handles youtube.com, youtu.be, shorts, embeds, music.youtube.com
- `parse_vtt()` / `deduplicate_segments()` - VTT parsing with duplicate line removal
- `format_txt()` / `format_srt()` / `format_json()` - Output formatters

## Versioning

Automatic semantic versioning via GitHub Actions based on commit message prefixes:
- `fix:` → patch bump
- `feat:` → minor bump
- `BREAKING CHANGE:` → major bump

Pushes to main trigger builds for x86_64 and aarch64, create GitHub releases with binaries.

## Packaging

PKGBUILD files for Arch Linux:
- `PKGBUILD` - Build from source (depends on rust, cargo)
- `PKGBUILD.bin` - Download precompiled binary from releases
- Both declare `yt-dlp` as a runtime dependency

## Exit Codes

0=success, 1=invalid args/no yt-dlp, 2=video/transcript unavailable, 3=network error, 4=file write error
