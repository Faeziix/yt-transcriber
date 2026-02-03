#!/usr/bin/env bun
import { defineCommand, runMain } from 'citty'
import { runExtract } from './commands/extract.ts'

const main = defineCommand({
  meta: {
    name: 'yt-transcriber',
    version: '1.0.0',
    description: 'Extract YouTube video transcripts with timestamps',
  },
  args: {
    url: {
      type: 'positional',
      description: 'YouTube URL or video ID',
      required: true,
    },
    format: {
      type: 'string',
      alias: 'f',
      description: 'Output format: txt, srt, json',
      default: 'txt',
    },
    output: {
      type: 'string',
      alias: 'o',
      description: 'Output file path (default: stdout)',
    },
    language: {
      type: 'string',
      alias: 'l',
      description: 'Language code for transcript',
    },
    timestamps: {
      type: 'boolean',
      description: 'Include timestamps in TXT output',
      default: true,
    },
  },
  run({ args }) {
    return runExtract({
      url: args.url,
      format: args.format,
      output: args.output,
      language: args.language,
      timestamps: args.timestamps,
    })
  },
})

runMain(main)
