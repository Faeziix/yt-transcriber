# yt-transcriber

A CLI tool for extracting YouTube video transcripts with timestamps in multiple formats.

## Installation

```bash
bun install
```

## Usage

```bash
bun run src/index.ts <url> [options]
```

### Arguments

- `url` - YouTube URL or video ID (required)

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--format` | `-f` | Output format: txt, srt, json | txt |
| `--output` | `-o` | Output file path | stdout |
| `--language` | `-l` | Language code for transcript | auto |
| `--no-timestamps` | | Exclude timestamps from TXT output | false |

### Examples

```bash
# Basic text output to stdout
bun run src/index.ts dQw4w9WgXcQ

# Full URL
bun run src/index.ts "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# SRT subtitle format to file
bun run src/index.ts dQw4w9WgXcQ -f srt -o subtitles.srt

# JSON output
bun run src/index.ts dQw4w9WgXcQ --format json --output transcript.json

# Spanish transcript
bun run src/index.ts dQw4w9WgXcQ -l es

# Text without timestamps
bun run src/index.ts dQw4w9WgXcQ --no-timestamps
```

## Output Formats

### TXT (default)

```
[00:01] Hello and welcome to this video
[00:05] Today we're going to talk about...
```

### SRT

```
1
00:00:01,000 --> 00:00:04,500
Hello and welcome to this video

2
00:00:04,500 --> 00:00:11,200
Today we're going to talk about...
```

### JSON

```json
{
  "videoId": "VIDEO_ID",
  "language": "auto",
  "segments": [
    {
      "index": 0,
      "text": "Hello and welcome",
      "startSeconds": 1.0,
      "endSeconds": 4.5,
      "durationSeconds": 3.5
    }
  ],
  "metadata": {
    "totalSegments": 1,
    "extractedAt": "2026-02-03T12:00:00Z"
  }
}
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Invalid arguments |
| 2 | Video/transcript unavailable |
| 3 | Network error |
| 4 | File write error |

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **CLI Framework**: citty
- **Transcript Extraction**: youtube-transcript-plus

## Project Structure

```
src/
├── index.ts              # CLI entry point
├── commands/
│   └── extract.ts        # Main extract command
├── extractors/
│   └── youtube.ts        # YouTube transcript fetching
├── formatters/
│   ├── index.ts          # Formatter factory
│   ├── txt.ts            # Plain text formatter
│   ├── srt.ts            # SRT subtitle formatter
│   └── json.ts           # JSON formatter
├── utils/
│   ├── url-parser.ts     # YouTube URL/ID parsing
│   └── time.ts           # Timestamp formatting
└── types/
    └── index.ts          # TypeScript interfaces
```
