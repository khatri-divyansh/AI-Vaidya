/**
 * Advanced Vector-based retriever using Google Gemini Embeddings.
 * This performs semantic search by comparing the mathematical "fingerprint" 
 * of the question with the database chunks.
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

/**
 * Calculates the cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieves the most relevant chunks using vector similarity.
 */
export async function getRelevantChunks(query, chunkObjects, genAI, topK = 6) {
  let scoredChunks = [];

  try {
    // 1. Attempt Vector Search (Semantic)
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(query);
    const queryVector = result.embedding.values;

    scoredChunks = chunkObjects.map(item => {
      const vectorScore = (item.embedding && item.embedding.length > 0) 
        ? cosineSimilarity(queryVector, item.embedding) 
        : 0;
      
      // 2. Keyword Match (Robustness)
      const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      let keywordScore = 0;
      const textLower = item.text.toLowerCase();
      queryWords.forEach(word => {
        if (textLower.includes(word)) keywordScore += 0.5;
      });

      return { text: item.text, score: vectorScore + keywordScore };
    });

    // DEBUG: Log top scored chunk
    scoredChunks.sort((a, b) => b.score - a.score);
    console.log(`🔍 Top Retrieval Match: "${scoredChunks[0].text.substring(0, 100)}..." (Score: ${scoredChunks[0].score})`);

  } catch (error) {
    console.error("Vector Search Failed (using keyword fallback):", error);
    // 3. Complete Keyword Fallback if Gemini fails
    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    scoredChunks = chunkObjects.map(item => {
      let score = 0;
      const textLower = item.text.toLowerCase();
      queryWords.forEach(word => {
        if (textLower.includes(word)) score += 1;
      });
      return { text: item.text, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    console.log(`🔍 Keyword Fallback Match: "${scoredChunks[0]?.text.substring(0, 100)}..." (Score: ${scoredChunks[0]?.score})`);
  }

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.text)
    .join("\n\n");
}
