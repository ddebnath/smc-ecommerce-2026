import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import EditEventDialog from "./EditEventDialog";

const ManageEvents = () => {
  const accessToken = localStorage.getItem("accessToken");

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // ================= FETCH EVENTS =================
  const getAllEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/event/get`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  // ================= FILTER =================
  let filteredEvents = events.filter((e) =>
    [e.title, e.city, e.state, e.country]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // ================= SORT =================
  if (sortOrder === "latest") {
    filteredEvents = [...filteredEvents].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  } else if (sortOrder === "oldest") {
    filteredEvents = [...filteredEvents].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }

  // ================= DELETE =================
  const handleDelete = async (event) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );
    if (!confirmDelete) return;

    try {
      setLoadingId(event._id);

      const res = await axios.delete(`${API_URL}/event/delete/${event._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        toast.success("Event deleted");

        // 🔥 update local state
        setEvents((prev) => prev.filter((e) => e._id !== event._id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= UI =================
  return (
    <div className="pl-[350px] py-20 pr-20 min-h-screen bg-gray-100 flex flex-col gap-5">
      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center">
        {/* Search */}
        <div className="relative bg-white rounded-lg">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] h-[40px]"
          />
          <Search className="absolute right-3 top-2 text-gray-400" />
        </div>

        {/* Sort */}
        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Sort by Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 📦 Event List */}
      <div className="mt-5 flex flex-col gap-3">
        {filteredEvents.map((event) => (
          <Card key={event._id} className="p-4">
            <div className="flex justify-between items-center">
              {/* LEFT */}
              <div className="flex gap-3 items-center">
                <img
                  src={event.coverImage?.url || "/placeholder.jpg"}
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h1 className="text-gray-700 font-semibold">{event.title}</h1>
                  <p className="text-sm text-gray-500">
                    {event.city}, {event.state}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6">
                <h1 className="font-bold text-gray-700">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-IN")
                    : "N/A"}
                </h1>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpen(true);
                    }}
                  >
                    <Edit2 className="text-green-500" />
                  </Button>

                  <Button
                    variant="outline"
                    disabled={loadingId === event._id}
                    onClick={() => handleDelete(event)}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ✏️ Edit Dialog */}
      {open && selectedEvent && (
        <EditEventDialog
          open={open}
          setOpen={setOpen}
          event={selectedEvent}
          refreshEvents={getAllEvents} // 🔥 IMPORTANT
        />
      )}
    </div>
  );
};

export default ManageEvents;
