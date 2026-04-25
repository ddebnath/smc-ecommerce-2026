import { API_URL } from "@/config/api";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import logo from "@/assets/image_icon.png";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
const AdminUsers = () => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/auth/get-all-users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setUsers(res.data.user);
      }
    } catch (error) {
      console.log("get all user error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setCurrentUser(res.data.user);
      }
    } catch (error) {
      console.log("get current user error:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.put(
        `${API_URL}/user/auth/update-user/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (res.data.success) {
        // update UI instantly
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user,
          ),
        );

        toast.success("user role changed successfully");
      }
    } catch (error) {
      console.log("role update error:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
    getCurrentUser();
  }, []);

  // 🔍 Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="pl-[350px] py-20 mx-auto px-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      {/* 🔍 Search Box */}
      <div className="flex items-center relative mb-6">
        <SearchIcon className="absolute left-2 text-gray-600" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="pl-10 w-full md:w-1/3 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center">No users found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Profile Picture</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Show Orders</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <div>
                      <img
                        src={user?.profilePic || logo}
                        alt=""
                        className="w-20 h-20 rounded-full aspect-square border-blue-600 border-2 object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    {user ? user.firstName.concat(" ", user.lastName) : "NA"}
                  </td>
                  <td className="p-3">{user.email}</td>

                  {/* changed current role rather than the current user logged in */}
                  <td className="p-3">
                    <select
                      value={user.role}
                      disabled={user._id === currentUser?._id}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className={`p-2 border rounded-lg ${
                        user._id === currentUser?._id
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* Show Orders */}
                  <td className="p-3">
                    <Button variant="outline">Show Orders</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
