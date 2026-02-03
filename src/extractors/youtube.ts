import { fetchTranscript } from 'youtube-transcript-plus'
import type { TranscriptResult, TranscriptSegment } from '../types/index.ts'

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g, (match) => HTML_ENTITIES[match] ?? match)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

export class TranscriptError extends Error {
  constructor(
    message: string,
    public code: 'VIDEO_UNAVAILABLE' | 'CAPTIONS_DISABLED' | 'NO_CAPTIONS' | 'LANGUAGE_MISSING' | 'NETWORK_ERROR'
  ) {
    super(message)
    this.name = 'TranscriptError'
  }
}

export async function extractTranscript(videoId: string, language?: string): Promise<TranscriptResult> {
  try {
    const transcript = await fetchTranscript(videoId, { lang: language })

    if (!transcript || transcript.length === 0) {
      throw new TranscriptError('No transcript available for this video', 'NO_CAPTIONS')
    }

    const segments: TranscriptSegment[] = transcript.map((item, index) => {
      const startSeconds = item.offset
      const durationSeconds = item.duration
      return {
        index,
        text: decodeHtmlEntities(item.text),
        startSeconds,
        durationSeconds,
        endSeconds: startSeconds + durationSeconds,
      }
    })

    return {
      videoId,
      language: language ?? 'auto',
      segments,
      metadata: {
        totalSegments: segments.length,
        extractedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    if (error instanceof TranscriptError) {
      throw error
    }

    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('disabled') || message.includes('Disabled')) {
      throw new TranscriptError('Transcripts disabled by creator', 'CAPTIONS_DISABLED')
    }

    if (message.includes('unavailable') || message.includes('private') || message.includes('deleted')) {
      throw new TranscriptError('Video is unavailable (private/deleted/restricted)', 'VIDEO_UNAVAILABLE')
    }

    if (message.includes('language') || message.includes('not found')) {
      throw new TranscriptError(`Transcript not available in '${language ?? 'requested language'}'`, 'LANGUAGE_MISSING')
    }

    if (message.includes('network') || message.includes('fetch') || message.includes('ENOTFOUND')) {
      throw new TranscriptError('Network error while fetching transcript', 'NETWORK_ERROR')
    }

    throw new TranscriptError(message, 'VIDEO_UNAVAILABLE')
  }
}
