import type { Formatter, OutputFormat } from '../types/index.ts'
import { txtFormatter } from './txt.ts'
import { srtFormatter } from './srt.ts'
import { jsonFormatter } from './json.ts'

const formatters: Record<OutputFormat, Formatter> = {
  txt: txtFormatter,
  srt: srtFormatter,
  json: jsonFormatter,
}

export function getFormatter(format: OutputFormat): Formatter {
  return formatters[format]
}

export function isValidFormat(format: string): format is OutputFormat {
  return format in formatters
}
