import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out
            ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Background Image */}
          <img
            src={slide.img}
            alt="hero"
            className="w-full h-full object-cover scale-105 animate-[zoom_6s_linear_infinite]"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fadeInUp">
              {slide.title}
            </h1>

            <p className="text-lg md:text-xl mb-6 text-gray-200 animate-fadeInUp delay-200">
              {slide.subtitle}
            </p>

            <div className="flex gap-4 animate-fadeInUp delay-300">
              <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 text-lg rounded-lg">
                <Link to="/product">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition
              ${index === current ? "bg-white scale-110" : "bg-white/50"}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/50 transition z-20"
      >
        ◀
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/50 transition z-20"
      >
        ▶
      </button>
    </div>
  );
}
