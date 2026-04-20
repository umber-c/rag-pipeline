export interface Chunk {
  content: string
  chunkIndex: number
  metadata: {
    documentId: string
    documentType: 'pdf' | 'lecture' | 'homework' | 'past_exam'
    startChar: number
    endChar: number
  }
}

function splitIntoSegments(text: string): string[] {
  const byParagraph = text.split(/\n\n+/).filter(s => s.trim().length > 0)
  if (byParagraph.length > 1) return byParagraph

  const byLine = text.split(/\n/).filter(s => s.trim().length > 0)
  if (byLine.length > 1) return byLine

  return [text]
}

function splitByWords(text: string, chunkSize: number, overlap: number = 20): string[] {
  const words = text.split(' ')
  const chunks: string[] = []
  let currentWords: string[] = []

  for (const word of words) {
    currentWords.push(word)
    const current = currentWords.join(' ')

    if (current.length > chunkSize) {
      chunks.push(current.trim())
      // Keep last 20 words for overlap into next chunk
      currentWords = currentWords.slice(-overlap)
    }
  }

  if (currentWords.length > 0) {
    chunks.push(currentWords.join(' ').trim())
  }

  return chunks
}

export function chunkText(
  text: string,
  documentId: string,
  documentType: Chunk['metadata']['documentType'],
  chunkSize: number = 1000
): Chunk[] {
  const chunks: Chunk[] = []
  const segments = splitIntoSegments(text)

  let charIndex = 0
  let chunkIndex = 0

  for (const segment of segments) {
    const pieces = segment.length > chunkSize
      ? splitByWords(segment, chunkSize)
      : [segment]

    for (const piece of pieces) {
      chunks.push({
        content: piece.trim(),
        chunkIndex: chunkIndex++,
        metadata: {
          documentId,
          documentType,
          startChar: charIndex,
          endChar: charIndex + piece.length
        }
      })
      charIndex += piece.length + 1
    }
  }

  return chunks
}