import React, { useState, useCallback } from "react";

const MediaUploader = ({ images, setImages, videos, setVideos }) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);

    const imgs = files.filter((f) => f.type.startsWith("image/"));
    const vids = files.filter((f) => f.type.startsWith("video/"));

    setImages((prev) => [...prev, ...imgs]);
    setVideos((prev) => [...prev, ...vids]);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);

    const imgs = files.filter((f) => f.type.startsWith("image/"));
    const vids = files.filter((f) => f.type.startsWith("video/"));

    setImages((prev) => [...prev, ...imgs]);
    setVideos((prev) => [...prev, ...vids]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-6 text-center rounded-xl ${
          dragging ? "bg-gray-200" : "bg-gray-50"
        }`}
      >
        <p className="text-gray-600">
          Drag & Drop Images / Videos here or click to upload
        </p>

        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="mt-3"
        />
      </div>

      {/* IMAGE PREVIEW */}
      {images.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Images (first = cover)</h3>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black text-white text-xs px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW */}
      {videos.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Videos</h3>
          <div className="grid grid-cols-2 gap-2">
            {videos.map((vid, i) => (
              <div key={i} className="relative">
                <video
                  src={URL.createObjectURL(vid)}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  onClick={() => removeVideo(i)}
                  className="absolute top-1 right-1 bg-black text-white text-xs px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
