import React, { useEffect, useState } from "react";

const ProductImg = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 🔁 AUTO SLIDESHOW
  useEffect(() => {
    if (isHovered) return; // pause on hover

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1500); // 1 sec

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  // ▶ NEXT / PREV
  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col md:flex-row gap-5">
      {/* 🔹 THUMBNAILS */}
      <div className="flex md:flex-col gap-3">
        {images.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt=""
            onClick={() => setIndex(i)}
            className={`w-25 h-25 object-cover cursor-pointer border rounded-md transition 
              ${index === i ? "border-blue-500 scale-105" : "opacity-70 hover:opacity-100"}
            `}
          />
        ))}
      </div>

      {/* 🔹 MAIN IMAGE */}
      <div
        className="relative group w-137.5 h-137.5 overflow-hidden rounded-lg border shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* IMAGE */}
        <img
          src={images[index].url}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-125"
        />

        {/* ◀ PREV */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded hover:bg-white"
        >
          ◀
        </button>

        {/* ▶ NEXT */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded hover:bg-white"
        >
          ▶
        </button>

        {/* 🔵 DOT INDICATORS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                index === i ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImg;
