import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const EditEventDialog = ({ open, setOpen, event, refreshEvents }) => {
  const accessToken = localStorage.getItem("accessToken");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= PREFILL =================
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        city: event.city || "",
        state: event.state || "",
        country: event.country || "",
        pinCode: event.pinCode || "",
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [event]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!form.title) {
      return toast.error("Title is required");
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/event/update/${event._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Event updated successfully");

        // 🔥 refresh parent list (IMPORTANT)
        if (refreshEvents) refreshEvents();

        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
          />

          <Textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
          />

          <Input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <Input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <Input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />

          <Input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
          />

          <Input
            name="pinCode"
            placeholder="Pin Code"
            value={form.pinCode}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <Button className="w-full" disabled={loading} onClick={handleUpdate}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
