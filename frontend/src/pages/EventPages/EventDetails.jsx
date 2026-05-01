import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const EventDetails = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem("accessToken");

  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  // FETCH EVENT
  const fetchEvent = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/event/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setEvent(res.data.data.event);
        setImages(res.data.data.images || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // AUTO SLIDER
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  // SCROLL SYNC
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !images.length) return;

      const rect = containerRef.current.getBoundingClientRect();

      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);

      const index = Math.floor(progress * images.length);

      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [images]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-bold">{event.title}</h1>

        <p className="text-sm text-gray-600">
          Created by:{" "}
          <span className="font-medium text-gray-900">
            {event.createdBy?.firstName} {event.createdBy?.lastName}
          </span>
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* LEFT: THUMBNAILS (2-column grid) */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <img
                key={img._id}
                src={img.imageUrl}
                onClick={() => setActiveIndex(i)}
                className={`h-24 w-full object-cover rounded-lg cursor-pointer border-2 transition ${
                  activeIndex === i ? "border-blue-600" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: MAIN SLIDER */}
        <div ref={containerRef} className="md:col-span-9">
          <Card className="overflow-hidden rounded-2xl shadow-md">
            <CardContent className="p-0">
              <div className="h-[450px] w-full bg-black">
                <img
                  src={images[activeIndex]?.imageUrl || event.coverImage?.url}
                  className="w-full h-full object-contain transition-all duration-700"
                />
              </div>

              <div className="flex justify-center py-2 text-xs text-gray-500 bg-gray-50">
                {activeIndex + 1} / {images.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DESCRIPTION */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">About this event</h2>

          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
