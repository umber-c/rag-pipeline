import Anthropic from '@anthropic-ai/sdk'
import * as dotenv from 'dotenv'
import { Chunk } from '../ingestion/chunker'

dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function askClaude(
  question: string,
  retrievedChunks: Chunk[],
  strictMode: boolean = true
): Promise<string> {

  // Build context from retrieved chunks
  const context = retrievedChunks
    .map((chunk, index) => `[Source ${index + 1}]\n${chunk.content}`)
    .join('\n\n---\n\n')

  // System prompt controls everything
  const systemPrompt = strictMode
    ? `You are Archi, an AI study assistant.
    
STRICT MODE: Only use the provided course materials to answer.
If the answer is not in the materials, say exactly:
"I couldn't find that in your uploaded materials."

Never use outside knowledge. Always cite which source you drew from.

Course materials:
${context}`
    : `You are Archi, an AI study assistant.

Use the provided course materials as your primary source.
You may supplement with general knowledge when helpful.
Always indicate when you go beyond the provided materials.

Course materials:
${context}`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      { role: 'user', content: question }
    ]
  })

  const content = response.content[0]
    if (!content) {
    throw new Error('No response from Claude')
    }
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return content.text
}