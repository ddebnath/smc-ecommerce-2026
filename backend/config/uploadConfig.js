export const UPLOAD_CONFIG = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_COUNT: 10,
  },
  VIDEO: {
    MAX_SIZE: 200 * 1024 * 1024, // 200MB (direct uploads)
    MAX_COUNT: 2,
    CHUNK_THRESHOLD: 50 * 1024 * 1024, // switch to chunking above this
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB per chunk
  },
};
