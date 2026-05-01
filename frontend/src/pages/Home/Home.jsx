import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TopOverlayMenu from "./TopOverlayMenu";
import PortraitGallery from "./PortraitGallery";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    title: "Freshly Baked Delights",
    subtitle: "Experience taste like never before",
  },
  {
    img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
    title: "Sweet & Elegant Cakes",
    subtitle: "Perfect for every celebration",
  },
  {
    img: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b",
    title: "Donuts You’ll Love",
    subtitle: "Soft, fluffy, irresistible",
  },
  {
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
    title: "Premium Pastries",
    subtitle: "Crafted with perfection",
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* 🔻 BACKGROUND SLIDES */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out
        ${index === current ? "opacity-100 z-0" : "opacity-0 z-0"}`}
        >
          {/* Image */}
          <img
            src={slide.img}
            alt="hero"
            className="w-full h-full object-cover scale-105 animate-[zoom_6s_linear_infinite] brightness-50"
          />

          {/* Strong fade overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      ))}

      {/* 🔺 FOREGROUND CONTENT (your gallery) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="w-full max-w-7xl">
          <PortraitGallery />
        </div>
      </div>

      {/* 🔘 Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition
          ${index === current ? "bg-white scale-110" : "bg-white/50"}`}
          />
        ))}
      </div>

      {/* ⬅️➡️ Arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
}
export default Hero;
