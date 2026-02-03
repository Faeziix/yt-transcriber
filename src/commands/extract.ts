import { extractVideoId } from '../utils/url-parser.ts'
import { extractTranscript, TranscriptError } from '../extractors/youtube.ts'
import { getFormatter, isValidFormat } from '../formatters/index.ts'
import { EXIT_CODES, type OutputFormat, type FormatOptions } from '../types/index.ts'

interface ExtractOptions {
  url: string
  format: string
  output?: string
  language?: string
  timestamps: boolean
}

export async function runExtract(options: ExtractOptions): Promise<number> {
  const videoId = extractVideoId(options.url)

  if (!videoId) {
    console.error('Error: Invalid YouTube URL or video ID')
    return EXIT_CODES.INVALID_ARGS
  }

  if (!isValidFormat(options.format)) {
    console.error(`Error: Invalid format '${options.format}'. Use: txt, srt, json`)
    return EXIT_CODES.INVALID_ARGS
  }

  const format = options.format as OutputFormat

  try {
    const result = await extractTranscript(videoId, options.language)
    const formatter = getFormatter(format)
    const formatOptions: FormatOptions = {
      includeTimestamps: options.timestamps,
    }
    const output = formatter.format(result, formatOptions)

    if (options.output) {
      await Bun.write(options.output, output)
      console.error(`Transcript saved to ${options.output}`)
    } else {
      console.log(output)
    }

    return EXIT_CODES.SUCCESS
  } catch (error) {
    if (error instanceof TranscriptError) {
      console.error(`Error: ${error.message}`)

      switch (error.code) {
        case 'NETWORK_ERROR':
          return EXIT_CODES.NETWORK_ERROR
        default:
          return EXIT_CODES.VIDEO_UNAVAILABLE
      }
    }

    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return EXIT_CODES.VIDEO_UNAVAILABLE
  }
}
