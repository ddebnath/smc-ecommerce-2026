export const UPLOAD_CONFIG = {
  VIDEO: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB → direct upload
    CHUNK_THRESHOLD: 50 * 1024 * 1024,
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB chunks
    MAX_COUNT: 5,
  },
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024,
    MAX_COUNT: 20,
  },
};
