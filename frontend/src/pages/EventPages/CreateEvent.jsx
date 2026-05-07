import React, { useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { Country, State, City } from "country-state-city";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import MediaUploader from "@/utils/MediaUpoader";
import { useNavigate } from "react-router-dom";
import { UPLOAD_CONFIG } from "@/config/uploadConfig";

const CreateEvent = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const countries = useMemo(() => Country.getAllCountries(), []);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= VIDEO CHUNK UPLOAD =================
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB (recommended)

  const uploadVideoInChunks = async (file, eventId) => {
    let start = 0;
    let index = 0;

    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    while (start < file.size) {
      const chunk = file.slice(start, start + CHUNK_SIZE);

      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("index", index);
      formData.append("fileName", safeFileName);
      formData.append("totalChunks", Math.ceil(file.size / CHUNK_SIZE)); // IMPORTANT

      await axios.post(
        `${API_URL}/event/${eventId}/upload-video-chunk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      start += CHUNK_SIZE;
      index++;
    }
  };
  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= COUNTRY =================
  const handleCountryChange = (code) => {
    setSelectedCountry(code);
    setStates(State.getStatesOfCountry(code));
    setCities([]);

    const countryName = countries.find((c) => c.isoCode === code)?.name;

    setForm((prev) => ({
      ...prev,
      country: countryName,
      state: "",
      city: "",
    }));
  };

  // ================= STATE =================
  const handleStateChange = (stateCode, stateName) => {
    setCities(City.getCitiesOfState(selectedCountry, stateCode));

    setForm((prev) => ({
      ...prev,
      state: stateName,
      city: "",
    }));
  };

  // ================= CITY =================
  const handleCityChange = (city) => {
    setForm((prev) => ({ ...prev, city }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) return toast.error("Title is required");

    try {
      setLoading(true);

      // 1️⃣ CREATE EVENT
      const res = await axios.post(`${API_URL}/event/create`, form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const eventId = res.data.data._id;

      // 2️⃣ IMAGES
      const validImages = galleryImages.filter((f) =>
        f.type.startsWith("image/"),
      );

      if (validImages.length > 0) {
        const imgForm = new FormData();
        validImages.forEach((img) => imgForm.append("files", img));

        await axios.post(`${API_URL}/event/${eventId}/images`, imgForm, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // 3️⃣ VIDEOS (CHUNKS + MERGE)
      const validVideos = videos.filter(
        (f) =>
          f.type.startsWith("video/") && f.size <= UPLOAD_CONFIG.VIDEO.MAX_SIZE,
      );

      if (
        validVideos.length > 0 &&
        validVideos.length <= UPLOAD_CONFIG.VIDEO.MAX_COUNT
      ) {
        for (const video of validVideos) {
          const safeFileName = video.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

          // 🎯 CONDITION
          if (video.size <= UPLOAD_CONFIG.VIDEO.MAX_SIZE) {
            // ✅ SMALL VIDEO → DIRECT UPLOAD
            const formData = new FormData();
            formData.append("videos", video);

            await axios.post(`${API_URL}/event/${eventId}/videos`, formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            });
          } else {
            // 🚀 LARGE VIDEO → CHUNKS
            // await uploadVideoInChunks(video, eventId, safeFileName);
            // // 🔗 MERGE AFTER CHUNKS
            // await axios.post(
            //   `${API_URL}/event/${eventId}/merge-video`,
            //   { fileName: safeFileName },
            //   {
            //     headers: {
            //       Authorization: `Bearer ${accessToken}`,
            //     },
            //   },
            // );
            toast.error("large video file not allowed and filterd out");
          }
        }
      }

      toast.success("Event created successfully 🎉");

      // RESET STATE (UNCHANGED UI)
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      });

      setGalleryImages([]);
      setVideos([]);
      setStates([]);
      setCities([]);
      setSelectedCountry("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
      navigate("/event");
    }
  };

  // ================= UI (UNCHANGED) =================
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Event</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              required
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

            <select
              className="w-full border p-2 rounded"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 rounded"
              onChange={(e) =>
                handleStateChange(
                  e.target.value,
                  e.target.selectedOptions[0].text,
                )
              }
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 rounded"
              value={form.city}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((c, i) => (
                <option key={i}>{c.name}</option>
              ))}
            </select>

            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <Input
              name="pinCode"
              placeholder="Pin Code"
              value={form.pinCode}
              onChange={handleChange}
            />

            <MediaUploader
              images={galleryImages}
              setImages={setGalleryImages}
              videos={videos}
              setVideos={setVideos}
            />

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
