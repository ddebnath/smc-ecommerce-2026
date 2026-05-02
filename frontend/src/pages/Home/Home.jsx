import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    title: "Discover Beautiful Moments",
    subtitle: "Explore our curated collection of products & events",
  },
  {
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Capture Every Memory",
    subtitle: "Your memories deserve the best presentation",
  },
  {
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    title: "Create Your Story",
    subtitle: "From products to events, everything in one place",
  },
  {
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1920&q=80",
    title: "Experience Every Celebration",
    subtitle: "From events to memories—see it all unfold beautifully.",
  },
  {
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80",
    title: "Create. Explore. Enjoy",
    subtitle: "Everything you need to bring your ideas and moments to life.",
  },
  {
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1920&q=80",
    title: "Designed for Exceptional Moments",
    subtitle: "Where quality products meet unforgettable experiences.",
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  // 🔁 Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* 🔻 Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={slide.img}
            alt="hero"
            className="w-full h-full object-cover animate-[kenburns_12s_ease-in-out_infinite]"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 " />
        </div>
      ))}

      {/* 🔺 Hero Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fadeInUp">
          {slides[current].title}
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl animate-fadeInUp delay-200">
          {slides[current].subtitle}
        </p>

        <div className="flex gap-4 animate-fadeInUp delay-300">
          <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 text-lg rounded-lg">
            <Link to="/product">Shop Now</Link>
          </Button>
        </div>
      </div>

      {/* 🔘 Indicators */}
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

      {/* ⬅️➡️ Arrows */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/50 transition"
      >
        ◀
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/50 transition"
      >
        ▶
      </button>
    </div>
  );
};

export default Home;
