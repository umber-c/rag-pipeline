export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {



  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must be of the same length");
  }

  if (vectorA.length === 0) {
    throw new Error("Vectors must not be empty");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for(let i = 0; i < vectorA.length; i++){

    const a = vectorA[i]!;
    const b = vectorB[i]!;

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;

  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    throw new Error("Vectors must not have zero magnitude");
  }

  return dotProduct / (magnitudeA * magnitudeB);



}