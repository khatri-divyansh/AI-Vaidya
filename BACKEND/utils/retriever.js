/**
 * A simple keyword-based retriever to find relevant chunks of text.
 * This is much faster than sending the entire database to the AI.
 */

export function splitIntoChunks(text, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

export function getRelevantChunks(query, chunks, topK = 6) {
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  if (queryWords.length === 0) return chunks.slice(0, topK).join("\n\n");

  const scoredChunks = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    let score = 0;
    queryWords.forEach(word => {
      if (chunkLower.includes(word)) {
        score += 1;
        // Bonus for exact word boundary matches
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = chunkLower.match(regex);
        if (matches) score += matches.length * 2;
      }
    });
    return { chunk, score };
  });

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk)
    .join("\n\n");
}
