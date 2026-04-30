import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // unique categories
  const categories = ["All", ...new Set(images.map((img) => img.category))];

  // filter images
  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-10 px-4">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
        <p className="text-gray-500 mt-2">
          Explore our collection of products & creations
        </p>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredImages.map((img, i) => (
          <div
            key={i}
            className="relative group cursor-pointer overflow-hidden rounded-xl"
            onClick={() => setSelectedImage(img.url)}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-60 object-cover transition duration-300 group-hover:scale-110"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-sm">View</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-7xl max-h-7xl p-0 flex items-center justify-center">
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
