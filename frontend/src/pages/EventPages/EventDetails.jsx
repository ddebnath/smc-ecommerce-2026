import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api";
import { Loader2, Volume2, VolumeX } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const EventDetails = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem("accessToken");

  const [event, setEvent] = useState(null);
  const [media, setMedia] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isInView, setIsInView] = useState(true);

  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // ================= FETCH =================
  const fetchEvent = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/event/details/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        const ev = res.data.data.event;
        const images = res.data.data.images || [];
        const videos = ev.videos || [];

        const combined = [
          ...images.map((img) => ({
            type: "image",
            url: img.imageUrl,
            id: img._id,
          })),

          ...videos.map((vid) => ({
            type: "video",
            url: vid.url,

            // ✅ FIX: robust thumbnail fallback
            thumbnail:
              vid.thumbnail ||
              `https://res.cloudinary.com/demo/video/upload/so_1/${vid.public_id}.jpg`,

            id: vid._id,
          })),
        ];

        setEvent(ev);
        setMedia(combined);
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

  // ================= TAB VISIBILITY =================
  useEffect(() => {
    const handleVisibility = () => {
      const active = document.visibilityState === "visible";
      setIsTabActive(active);
      if (!active) setIsPaused(true);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // ================= SCROLL VISIBILITY =================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        setIsPaused(!visible);
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // ================= SLIDER =================
  useEffect(() => {
    if (!media.length || isPaused || !isTabActive || !isInView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % media.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [media, isPaused, isTabActive, isInView]);

  // ================= VIDEO CONTROL =================
  const handleVideoHover = (index, play) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (play) {
      setIsPaused(true);
      video.muted = isMuted;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPaused(false);
    }
  };

  const toggleAudio = () => {
    const video = videoRefs.current[activeIndex];
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // ================= LOADING =================
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
        {/* LEFT: THUMBNAILS */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 gap-3">
            {media.map((item, i) => (
              <div
                key={item.id}
                onClick={() => setActiveIndex(i)}
                className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                  activeIndex === i ? "border-blue-600" : "border-transparent"
                }`}
              >
                <img
                  src={item.type === "image" ? item.url : item.thumbnail}
                  className="h-24 w-full object-cover"
                  //   onError={(e) => {
                  //     e.target.src = "https://via.placeholder.com/150?text=Video";
                  //   }
                  // }
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: MAIN DISPLAY */}
        <div ref={containerRef} className="md:col-span-9">
          <Card className="overflow-hidden rounded-2xl shadow-md">
            <CardContent className="p-0 relative">
              <div className="h-[450px] w-full bg-black">
                {media[activeIndex]?.type === "image" ? (
                  <img
                    src={media[activeIndex]?.url || event.coverImage}
                    className="w-full h-full object-contain transition-all duration-700"
                  />
                ) : (
                  <>
                    <video
                      ref={(el) => (videoRefs.current[activeIndex] = el)}
                      src={media[activeIndex]?.url}
                      className="w-full h-full object-contain"
                      muted={isMuted}
                      loop
                      onMouseEnter={() => handleVideoHover(activeIndex, true)}
                      onMouseLeave={() => handleVideoHover(activeIndex, false)}
                      onEnded={() => setIsPaused(false)}
                    />

                    {/* AUDIO BUTTON */}
                    <button
                      onClick={toggleAudio}
                      className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full text-white"
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-center py-2 text-xs text-gray-500 bg-gray-50">
                {activeIndex + 1} / {media.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EVENT INFO */}
      <h2 className="text-lg font-semibold mb-2">Event Details</h2>

      <div className="grid md:grid-cols-2 gap-2 text-gray-700">
        {/* LOCATION */}
        <Card>
          <h3 className="text-lg font-semibold ml-5 mt-3">Location</h3>
          <CardContent>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {event?.date && !isNaN(new Date(event.date).getTime())
                ? new Date(event.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
            <p>
              <span className="font-medium">Address:</span> {event.location}
            </p>
            <p>
              <span className="font-medium">City:</span> {event.city}
            </p>
            <p>
              <span className="font-medium">State:</span> {event.state}
            </p>
            <p>
              <span className="font-medium">Country:</span> {event.country}
            </p>
            <p>
              <span className="font-medium">Pin:</span> {event.pinCode}
            </p>
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
        <Card>
          <CardContent>
            <p className="font-bold">Description</p>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
