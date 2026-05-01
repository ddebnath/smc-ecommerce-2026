import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateEvent = () => {
  const { user } = useSelector((store) => store.user);
  const accessToken = localStorage.getItem("accessToken");

  const role = user?.role;
  const isAdmin = role === "admin" || role === "productOwner";

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    coverImage: null,
    galleryImages: [],
  });

  const [loading, setLoading] = useState(false);

  // TEXT INPUT
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // COVER IMAGE
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      coverImage: file,
      coverPreview: URL.createObjectURL(file),
    }));
  };

  // GALLERY IMAGES
  const handleGalleryChange = (e) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: Array.from(e.target.files),
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("country", form.country);
      formData.append("pinCode", form.pinCode);

      // COVER IMAGE
      if (form.coverImage) {
        formData.append("file", form.coverImage); // MUST MATCH multer.single("file")
      }

      const res = await axios.post(`${API_URL}/event/create`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const eventId = res.data.data._id;

      // GALLERY UPLOAD (already correct)
      if (form.galleryImages.length > 0) {
        const galleryForm = new FormData();

        form.galleryImages.forEach((img) => {
          galleryForm.append("files", img);
        });

        await axios.post(
          `${API_URL}/event/${eventId}/upload-images`,
          galleryForm,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      toast.success("Event created successfully");

      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        coverImage: null,
        galleryImages: [],
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle>Create Event ({role})</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* TITLE */}
            <Input
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
            />

            {/* DESCRIPTION */}
            <Textarea
              name="description"
              placeholder="Event Description"
              value={form.description}
              onChange={handleChange}
            />

            {/* COVER IMAGE */}
            <div>
              <label className="text-sm font-medium">Cover Image</label>

              <Input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
              />

              {form.coverPreview && (
                <img
                  src={form.coverPreview}
                  className="w-40 h-40 mt-2 rounded-lg object-cover"
                />
              )}
            </div>

            {/* GALLERY IMAGES */}
            <div>
              <label className="text-sm font-medium">Gallery Images</label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
              />

              {/* preview */}
              <div className="flex gap-2 flex-wrap mt-2">
                {form.galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    className="w-20 h-20 rounded object-cover border"
                  />
                ))}
              </div>
            </div>

            {/* ADMIN NOTE */}
            {isAdmin && (
              <p className="text-sm text-blue-600">
                Admin/Product Owner Event Creation Enabled
              </p>
            )}

            {/* SUBMIT */}
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
