import { cosineSimilarity } from "./similarity";
import { Chunk } from "../ingestion/chunker";


interface StoredChunk {
    chunk: Chunk
    embedding: number[]
}

const store: StoredChunk[] = [];

//populating the array
export function addToStore(chunk: Chunk, embedding: number[]): void {
  store.push({ chunk, embedding })
}


export function search(queryVector: number[], topK: number = 4): Chunk[] {
  const results: { chunk: Chunk, similarity: number }[] = []

  for (const item of store) {
    const similarity = cosineSimilarity(queryVector, item.embedding)
    results.push({ chunk: item.chunk, similarity })
  }

  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(result => result.chunk)
}
