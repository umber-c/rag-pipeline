import Anthropic from '@anthropic-ai/sdk'
import * as dotenv from 'dotenv'
import { Chunk } from './chunker'

dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export interface EnrichedChunk {
  chunk: Chunk
  contextualizedContent: string
}

export async function contextualizeChunks(
  chunks: Chunk[],
  documentTitle: string = 'academic document'
): Promise<EnrichedChunk[]> {
  const enriched: EnrichedChunk[] = []

  for (const chunk of chunks) {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `In 1-2 sentences, describe where this chunk sits in the document and what concept it covers. Be specific and concise. Do not summarize the content itself.

Document: ${documentTitle}
Chunk: ${chunk.content.substring(0, 500)}

Response (1-2 sentences only):`
      }]
    })

    const summary = response.content[0]?.type === 'text'
      ? response.content[0].text
      : ''

    enriched.push({
      chunk,
      contextualizedContent: `Context: ${summary}\n\n${chunk.content}`
    })
  }

  return enriched
}