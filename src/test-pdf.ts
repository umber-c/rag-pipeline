import { pdfToText } from './ingestion/pdf-processor'
import { chunkText } from './ingestion/chunker'

async function main() {
  try {
    console.log('Starting PDF processing...')
    
    const text = await pdfToText('C:/Users/umber/Downloads/lp_prep.md.pdf')
    
    console.log('PDF processed successfully')
    console.log('Text length:', text.length)
    console.log('First 200 chars:', text.substring(0, 200))
    
    const chunks = chunkText(text, 'doc-001', 'pdf')
    console.log('Total chunks:', chunks.length)

  } catch (error) {
    console.error('Error:', error)
  }
}

main().catch(console.error)