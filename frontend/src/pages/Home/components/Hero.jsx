import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import menu_foodprocessing from "@/assets/Menu_Food Processing.png";

const products = [
  "https://images.unsplash.com/photo-1509440159596-0249088772ff", // bread
  "https://images.unsplash.com/photo-1608198093002-ad4e005484ec", // cake
  "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b", // donuts
  "https://images.unsplash.com/photo-1551024601-bec78aea704b", // pastries
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-purple-100 grid md:grid-cols-2 items-center px-6 md:px-16 py-10 gap-8">
      {/* LEFT SIDE */}
      <div className="space-y-5">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-800">
          Where Taste, Style, and Music Come Together
        </h1>
        <p className="text-base text-gray-600 max-w-md">
          Discover a world of delightful flavors, elegant styles, and soulful
          music—all in one place
        </p>

        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            Shop Now
          </Button>
          <Button variant="outline" size="lg">
            Explore
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-full h-[300px] md:h-[384px] overflow-hidden rounded-xl shadow-md">
        {products.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="bakery"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {products.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                index === current ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev - 1 + products.length) % products.length)
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded-full"
        >
          ◀
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % products.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded-full"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
