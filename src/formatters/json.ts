import type { Formatter, TranscriptResult } from '../types/index.ts'

export const jsonFormatter: Formatter = {
  format(result: TranscriptResult): string {
    return JSON.stringify(result, null, 2)
  },
}
