import * as dotenv from 'dotenv'
import { VoyageAIClient } from 'voyageai'

dotenv.config()

const client = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY
})

export async function embedChunk(text: string): Promise<number[]> {
  const response = await client.embed({
    input: text,
    model: 'voyage-3-lite'
  })

  const embedding = response.data?.[0]?.embedding

  if (!embedding) {
    throw new Error('No embedding returned from Voyage AI')
  }

  return embedding
}

export async function embedChunks(texts: string[]): Promise<number[][]> {
  const response = await client.embed({
    input: texts,
    model: 'voyage-3-lite'
  })

  if (!response.data) {
    throw new Error('No embeddings returned from Voyage AI')
  }

  return response.data.map(d => d.embedding!)
}