import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import store from "@/redux/store";

const Events = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const { user } = useSelector((store) => store.user);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH EVENTS
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/event/get`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // DELETE EVENT
  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm("Delete this event?");
      if (!confirm) return;

      await axios.delete(`${API_URL}/event/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success("Event deleted");

      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error("You dont have permission to delete an event");
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case "admin":
        return "/dashboard";
      case "productOwner":
        return "/product-owner-dashboard";
      default:
        return "/"; // fallback
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🎉 Events Dashboard
          </h1>

          <Link to={`${getDashboardPath(user.role)}/events/create`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              + Create Event
            </Button>
          </Link>
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
              className="overflow-hidden items-center justify-center rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group bg-white"
            >
              {/* start */}
              <div className="relative w-full h-[420px] md:h-[540px] rounded-3xl overflow-hidden shadow-xl">
                {/* BACKGROUND IMAGE */}
                <img
                  src={event.coverImage?.url}
                  alt={event.title}
                  className="w-full h-full object-cover scale-105"
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* CONTENT */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                  <div className="max-w-4xl">
                    {/* TITLE */}
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                      {event.title}
                    </h1>

                    {/* META INFO */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs md:text-sm">
                      <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                        📸 Event Gallery
                      </span>

                      <span className="text-gray-300">
                        Created by:{" "}
                        <span className="text-white font-medium">
                          {event.createdBy?.name || "Admin"}
                        </span>
                      </span>
                      <CardContent className="p-4 space-y-3">
                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-2">
                          {/* VIEW */}
                          <Link to={`/events/${event._id}`} className="flex-1">
                            <Button size="lg" className="w-full">
                              <Eye size={35} />
                            </Button>
                          </Link>

                          {/* EDIT */}
                          <Link to={``}>
                            <Button
                              size="lg"
                              variant="outline"
                              className="bg-amber-700"
                            >
                              <Pencil
                                size={35}
                                fill={100}
                                className="text-white"
                              />
                            </Button>
                          </Link>

                          {/* DELETE */}
                          <Button
                            size="lg"
                            variant="destructive"
                            onClick={() => handleDelete(event._id)}
                          >
                            <Trash2
                              size={35}
                              fill={100}
                              className="text-white"
                            />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </div>
              </div>

              {/* end */}
              {/* CONTENT */}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
