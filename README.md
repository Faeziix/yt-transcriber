# yt-transcriber

A CLI tool for extracting YouTube video transcripts with timestamps in multiple formats.

## Installation

### Arch Linux (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/Faeziix/yt-transcriber/main/install.sh | bash
```

This uses `makepkg` and `pacman` to properly handle the `yt-dlp` dependency.

**Options:**
- `./install.sh local` - Build from source (default when in repo)
- `./install.sh bin` - Install precompiled binary
- `./install.sh -v v1.0.0` - Install specific version

### From source (any Linux)

Requires Rust and yt-dlp.

```bash
git clone https://github.com/Faeziix/yt-transcriber.git
cd yt-transcriber
cargo build --release
sudo cp target/release/yt-transcriber /usr/local/bin/
```

### Dependencies

- **yt-dlp** - Install via your package manager:
  ```bash
  # Arch Linux
  sudo pacman -S yt-dlp

  # Debian/Ubuntu
  sudo apt install yt-dlp

  # macOS
  brew install yt-dlp
  ```

## Usage

```bash
yt-transcriber <url> [options]
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--format` | `-f` | Output format: txt, srt, json | txt |
| `--output` | `-o` | Output file path | stdout |
| `--language` | `-l` | Language code for transcript | en |
| `--no-timestamps` | | Exclude timestamps from TXT output | false |

### Examples

```bash
# Basic usage
yt-transcriber dQw4w9WgXcQ

# Full URL
yt-transcriber 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

# SRT subtitles to file
yt-transcriber dQw4w9WgXcQ -f srt -o subtitles.srt

# JSON output
yt-transcriber dQw4w9WgXcQ -f json -o transcript.json

# Spanish transcript
yt-transcriber dQw4w9WgXcQ -l es

# Text without timestamps
yt-transcriber dQw4w9WgXcQ --no-timestamps
```

## Output Formats

**TXT** (default)
```
[00:01] Hello and welcome to this video
[00:05] Today we're going to talk about...
```

**SRT**
```
1
00:00:01,000 --> 00:00:04,500
Hello and welcome to this video
```

**JSON**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "language": "en",
  "segments": [...]
}
```

## License

MIT
