import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import profilePic from "../../assets/Dipankar_Debnath.jpg";
import { API_URL } from "@/config/api.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/slices/userSlice";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId; // Fallback for testing

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipcode: user?.zipcode,
    profilePic: user?.profilePic,
    role: user?.role,
  });

  const [file, setFile] = useState(null);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile), // Update the profilePic field with the selected image's URL for preview
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      //use form data to send file and other data together
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipcode", updateUser.zipcode);

      if (file) {
        formData.append("file", file); // Append the file to the form data
      }

      const response = await axios.put(
        `${API_URL}/user/auth/update-user/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.user) {
        toast.success("Profile updated successfully!");
        dispatch(setUser(response.data.user)); // Update the user in the Redux store with the new data
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-7 text-2xl text-gray-800">
                Update Profile
              </h1>
              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <img
                    src={updateUser.profilePic || profilePic}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                  />
                  <Label className="mt-4 cursor-pointer bg-blue-700 text-white px-2 py-2 rounded-lg hover:bg-blue-500">
                    change picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                {/* Profile Form */}
                <form
                  className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="first name"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="last name"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Id</Label>
                    <input
                      type="email"
                      name="email"
                      value={updateUser.email}
                      onChange={handleChange}
                      disabled
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-200 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNo">Mobile Number</Label>
                    <input
                      type="number"
                      name="phoneNo"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      placeholder="enter phone number"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <input
                      type="text"
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      placeholder="enter address"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <input
                      type="text"
                      name="city"
                      value={updateUser.city}
                      onChange={handleChange}
                      placeholder="enter city"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip code">Zip Code</Label>
                    <input
                      type="text"
                      name="zipcode"
                      value={updateUser.zipcode}
                      onChange={handleChange}
                      placeholder="enter zipcode"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <Button
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-400"
                    type="submit"
                  >
                    update profile
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                View your order history and manage your past purchases.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 5 orders in progress and 2 pending shipments.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
