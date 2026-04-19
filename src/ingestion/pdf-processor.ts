import * as fs from 'fs'

export async function pdfToText(filePath: string): Promise<string> {
  const { extractText } = await import('unpdf')
  
  console.log('Step 1: Reading file...')
  const buffer = fs.readFileSync(filePath)
  const uint8Array = new Uint8Array(buffer)
  
  console.log('Step 2: Extracting text...')
  const { text } = await extractText(uint8Array, { mergePages: true })
  
  console.log('Step 3: Done, length:', text.length)
  console.log('Raw text sample:', JSON.stringify(text.substring(0, 300)))
  return text
}