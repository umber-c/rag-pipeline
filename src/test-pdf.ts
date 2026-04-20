import { pdfToText } from './ingestion/pdf-processor'
import { chunkText } from './ingestion/chunker'
import { embedChunk } from './ingestion/embedder'

async function main() {
  try {
    console.log('Starting PDF processing...')
    
    const text = await pdfToText('C:/Users/umber/Downloads/lp_prep.md.pdf')
    
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

  } catch (error) {
    console.error('Error:', error)
  }
}

main().catch(console.error)