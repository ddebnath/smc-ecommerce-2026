import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { Country, State, City } from "country-state-city";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const CreateEvent = () => {
  const { user } = useSelector((store) => store.user);
  const accessToken = localStorage.getItem("accessToken");

  const role = user?.role;
  const isAdmin = role === "admin" || role === "productOwner";

  const countries = useMemo(() => Country.getAllCountries(), []);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: null,
    location: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    coverImage: null,
    galleryImages: [],
  });

  const [loading, setLoading] = useState(false);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= COUNTRY =================
  const handleCountryChange = (code) => {
    setSelectedCountry(code);

    setStates(State.getStatesOfCountry(code));
    setCities([]);

    setForm((prev) => ({
      ...prev,
      country: countries.find((c) => c.isoCode === code)?.name,
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
  const handleCityChange = (value) => {
    setForm((prev) => ({
      ...prev,
      city: value,
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

  // // ================= FILES =================
  // const handleCoverChange = (e) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     coverImage: e.target.files?.[0],
  //   }));
  // };

  // const handleGalleryChange = (e) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     galleryImages: Array.from(e.target.files),
  //   }));
  // };

  // GALLERY IMAGES
  const handleGalleryChange = (e) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: Array.from(e.target.files),
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key !== "coverImage" && key !== "galleryImages") {
          formData.append(key, form[key]);
        }
      });

      if (form.coverImage) {
        formData.append("file", form.coverImage);
      }

      const res = await axios.post(`${API_URL}/event/create`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const eventId = res.data.data._id;

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

      setSelectedCountry("");
      setStates([]);
      setCities([]);
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

            {/* LOCATION */}
            <Input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            {/* COUNTRY */}
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {form.country || "Select Country"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList className="max-h-60 overflow-y-auto">
                    <CommandGroup>
                      {countries.map((c) => (
                        <CommandItem
                          key={c.isoCode}
                          onSelect={() => {
                            handleCountryChange(c.isoCode);
                            setCountryOpen(false);
                          }}
                        >
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* STATE */}
            <Popover open={stateOpen} onOpenChange={setStateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {form.state || "Select State"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandList className="max-h-60 overflow-y-auto">
                    <CommandGroup>
                      {states.map((s) => (
                        <CommandItem
                          key={s.isoCode}
                          onSelect={() => {
                            handleStateChange(s.isoCode, s.name);
                            setStateOpen(false);
                          }}
                        >
                          {s.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* CITY */}
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {form.city || "Select City"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList className="max-h-60 overflow-y-auto">
                    <CommandGroup>
                      {cities.map((c, i) => (
                        <CommandItem
                          key={i}
                          onSelect={() => {
                            handleCityChange(c.name);
                            setCityOpen(false);
                          }}
                        >
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            {/* PINCODE */}
            <Input
              name="pinCode"
              placeholder="Pin Code"
              value={form.pinCode}
              onChange={handleChange}
            />

            {/* COVER IMAGE */}
            <Input type="file" accept="image/*" onChange={handleCoverChange} />

            {/* GALLERY */}
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
            />

            {/* ROLE INFO */}
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
