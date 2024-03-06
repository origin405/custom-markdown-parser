function extractContentFromChunks(chunkObject) {
    return chunkObject.chunks.map(chunk => chunk.content);
}
  

  
export { extractContentFromChunks };
  