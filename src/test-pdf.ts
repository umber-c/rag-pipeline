import { pdfToText } from './ingestion/pdf-processor'
import { chunkText } from './ingestion/chunker'
import { embedChunk } from './ingestion/embedder'
import { addToStore, search } from './retrieval/vector-search'
import { embedChunks } from './ingestion/embedder'
import { askClaude } from './generation/claude-client'
import { contextualizeChunks } from './ingestion/contextualizer'


async function main() {
  try {
    console.log('Starting PDF processing...')
    
    const text = await pdfToText('C:\\Users\\umber\\Downloads\\Linear Optimization PDF.pdf')
    
    console.log('PDF processed successfully')
    console.log('Text length:', text.length)
    console.log('First 200 chars:', text.substring(0, 200))
    
    const chunks = chunkText(text, 'doc-001', 'pdf')
    console.log('Total chunks:', chunks.length)

    console.log('\nTesting embedder...')
    const firstChunk = chunks[0]
    if (firstChunk) {
     const embedding = await embedChunk(firstChunk.content)
    console.log('Embedding dimensions:', embedding.length)
    console.log('First 5 values:', embedding.slice(0, 5))
}

console.log('\nContextualizing chunks...')
const enrichedChunks = await contextualizeChunks(chunks, 'Elementary Linear Programming')
console.log('Contextualization done')

console.log('\nEmbedding all chunks and storing...')
const allEmbeddings = await embedChunks(enrichedChunks.map(c => c.contextualizedContent))

for (let i = 0; i < enrichedChunks.length; i++) {
  addToStore(enrichedChunks[i]!.chunk, allEmbeddings[i]!)
}

console.log('Store populated with', chunks.length, 'chunks')

console.log('\nSearching...')
const query = 'How does the simplex method work and why does it work?'
const queryEmbedding = await embedChunk(query)
const results = search(queryEmbedding)

console.log('Top results:')
results.forEach((chunk, i) => {
  console.log(`\nResult ${i + 1}:`)
  console.log(chunk.content.substring(0, 200))
})

console.log('\nAsking Claude...')
const answer = await askClaude(query, results)
console.log('\nClaude says:')
console.log(answer)

  } catch (error) {
    console.error('Error:', error)
  }
}

main().catch(console.error)