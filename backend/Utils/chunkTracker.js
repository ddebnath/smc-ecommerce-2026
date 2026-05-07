const chunkStore = new Map();

/**
 * Structure:
 * key: `${eventId}_${fileName}`
 * value: {
 *   totalChunks,
 *   received: Set()
 * }
 */

export const initUpload = (eventId, fileName, totalChunks) => {
  const key = `${eventId}_${fileName}`;

  if (!chunkStore.has(key)) {
    chunkStore.set(key, {
      totalChunks: Number(totalChunks),
      received: new Set(),
    });
  }

  return chunkStore.get(key);
};

export const markChunkReceived = (eventId, fileName, index) => {
  const key = `${eventId}_${fileName}`;
  const data = chunkStore.get(key);

  if (!data) return null;

  data.received.add(Number(index));

  return data;
};

export const isUploadComplete = (eventId, fileName) => {
  const key = `${eventId}_${fileName}`;
  const data = chunkStore.get(key);

  if (!data) return false;

  return data.received.size === data.totalChunks;
};

export const clearUpload = (eventId, fileName) => {
  const key = `${eventId}_${fileName}`;
  chunkStore.delete(key);
};
