import React, { useRef } from "react";

const EventCard = ({ event }) => {
  const videoRef = useRef(null);

  console.log(event.date);
  const status = getEventStatus(event.date); // ✅ HERE
  console.log("date status", status);

  const handleHover = (play) => {
    if (!videoRef.current) return;

    if (play) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative h-105 rounded-2xl overflow-hidden shadow-lg group"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* MEDIA */}
      {event.videos?.length > 0 ? (
        <video
          ref={videoRef}
          src={event.videos[0].url}
          muted
          loop
          poster={event.videos[0].thumbnail}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      ) : (
        <img
          src={event?.coverImage?.url || "/placeholder.jpg"}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      )}

      {/* TITLE */}
      <div className="absolute bottom-0 w-full p-4 bg-linear-to-t from-black/70 to-transparent text-white">
        <h2 className="text-lg font-semibold">{event.title}</h2>
      </div>
    </div>
  );
};

export default EventCard;
