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

function splitByWords(text: string, chunkSize: number): string[] {
  const words = text.split(' ')
  const chunks: string[] = []
  let current = ''

  for (const word of words) {
    if ((current + ' ' + word).length > chunkSize && current.length > 0) {
      chunks.push(current.trim())
      current = word
    } else {
      current += (current ? ' ' : '') + word
    }
  }

  if (current.trim().length > 0) chunks.push(current.trim())
  return chunks
}

export function chunkText(
  text: string,
  documentId: string,
  documentType: Chunk['metadata']['documentType'],
  chunkSize: number = 500
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