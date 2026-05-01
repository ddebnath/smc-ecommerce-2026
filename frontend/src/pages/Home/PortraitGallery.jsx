import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import menu1 from "@/assets/menu1.png";
import menu3 from "@/assets/menu3.jpeg";
import menu2 from "@/assets/menu2.jpeg";
import menu4 from "@/assets/menu4.jpeg";

const images = [
  {
    id: 1,
    url: menu1,
    title: "Food Processing Menu",
  },
  {
    id: 2,
    url: menu3,
    title: "Orange Squash - VTC-Food Processing",
  },
  {
    id: 3,
    url: menu2,
    title: "Baking and Confectionary",
  },

  {
    id: 4,
    url: menu4,
    title: "Beauty Care Menu",
  },

  //   {
  //     id: 5,
  //     url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  //     title: "Portrait 5",
  //   },
];

// 👉 group images into pairs
const createSlides = (arr, size = 2) => {
  const slides = [];
  for (let i = 0; i < arr.length; i += size) {
    slides.push(arr.slice(i, i + size));
  }
  return slides;
};

const PortraitGallery = () => {
  const slides = createSlides(images, 2);
  const [current, setCurrent] = useState(0);

  // 🔁 Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((pair, i) => {
          const isActive = i === current;

          return (
            <div
              key={i}
              className={`min-w-full flex justify-center gap-8 px-4 transition-all duration-700
                ${isActive ? "opacity-100 scale-100" : "opacity-40 scale-90 blur-sm"}
              `}
            >
              {pair.map((img, idx) => (
                <div
                  key={img.id}
                  className={`w-[45%] transition-all duration-500
                    ${isActive ? "scale-105" : "scale-95"}
                  `}
                >
                  <Card className="overflow-hidden rounded-2xl shadow-xl">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3] min-h-[420px]">
                        {/* Image */}
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div
                          className={`absolute inset-0 transition
                            ${isActive ? "bg-black/30" : "bg-black/60"}
                          `}
                        />

                        {/* Title */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <span className="text-lg font-semibold">
                            {img.title}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition
              ${i === current ? "bg-white scale-110" : "bg-white/50"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default PortraitGallery;
