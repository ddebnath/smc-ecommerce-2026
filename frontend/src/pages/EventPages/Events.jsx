import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { getEventStatus } from "@/utils/eventStatus";

const Events = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const { user } = useSelector((store) => store.user);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/event/get`);

      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= DELETE EVENT =================
  const handleDelete = async (id) => {
    try {
      const ok = window.confirm("Delete this event?");
      if (!ok) return;

      await axios.delete(`${API_URL}/event/delete/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success("Event deleted");
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("You don't have permission to delete");
    }
  };

  const getDashboardPath = (role) => {
    if (role === "admin") return "/dashboard/events/create";
    if (role === "productOwner")
      return "/product-owner-dashboard/events/create";
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            🎉 Events Dashboard
          </h1>

          {user && user?.role !== "user" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate(getDashboardPath(user?.role))}
            >
              + Create Event
            </Button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && events.length === 0 && (
          <p className="text-center text-gray-500">No events available</p>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <Card
              key={event._id}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer"
            >
              {/* IMAGE */}
              <div className="relative h-105 overflow-hidden">
                <img
                  src={event?.coverImage?.url || "/placeholder.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* OVERLAY (NO CLICK BLOCKING) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                {/* STATUS BADGE */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white ${
                      getEventStatus(event.date) === "Upcoming"
                        ? "bg-blue-500/80"
                        : getEventStatus(event.date) === "Past"
                          ? "bg-red-500/80"
                          : "bg-green-500/80"
                    }`}
                  >
                    {getEventStatus(event.date)}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                  <h2 className="text-lg font-semibold line-clamp-2">
                    {event.title}
                  </h2>

                  <p className="text-xs text-gray-200 mt-1">
                    Click to explore gallery
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${event._id}`);
                      }}
                    >
                      <Eye size={16} className="mr-1" /> View
                    </Button>

                    {user && user?.role !== "user" && (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="bg-amber-500 hover:bg-amber-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/events/edit/${event._id}`);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event._id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
