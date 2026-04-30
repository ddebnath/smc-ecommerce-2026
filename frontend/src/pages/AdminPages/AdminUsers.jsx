import { API_URL } from "@/config/api";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import logo from "@/assets/image_icon.png";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUsers = () => {
  const accessToken = localStorage.getItem("accessToken");

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/auth/get-all-users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setUsers(res.data.user);
      }
    } catch (err) {
      console.log("fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== CURRENT USER =====
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setCurrentUser(res.data.user);
      }
    } catch (err) {
      console.log("current user error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  // ===== ROLE CHANGE =====
  const handleRoleChange = async (userId, role) => {
    try {
      const res = await axios.put(
        `${API_URL}/user/auth/update-user/${userId}`,
        { role },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role } : u)),
        );
        toast.success("Role updated");
      }
    } catch (err) {
      console.log("role update error:", err);
    }
  };

  // ===== ACTIVE / BLOCK TOGGLE =====
  const handleActiveToggle = async (userId, checked) => {
    try {
      const res = await axios.post(
        `${API_URL}/user/auth/block-user/${userId}`,
        { isActive: checked },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: checked } : u)),
        );

        toast.success(checked ? "User unblocked" : "User blocked");
      }
    } catch (err) {
      console.log("toggle error:", err);
    }
  };

  // ===== FILTER =====
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ===== STATS =====
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    owners: users.filter((u) => u.role === "productOwner").length,
    usersCount: users.filter((u) => u.role === "user").length,
    blocked: users.filter((u) => !u.isActive).length,
  };

  return (
    <div className="pl-[350px] py-20 px-6">
      <h1 className="text-2xl font-bold text-center mb-8">All Users</h1>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Admins" value={stats.admins} color="blue" />
        <StatCard label="Owners" value={stats.owners} color="green" />
        <StatCard label="Users" value={stats.usersCount} color="yellow" />
        <StatCard label="Blocked" value={stats.blocked} color="red" />
      </div>

      {/* ===== SEARCH ===== */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-2 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 p-3 border rounded-lg w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== TABLE ===== */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent animate-spin rounded-full" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <div className="bg-white rounded-xl shadow border">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-500 hover:bg-blue-500">
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">Profile</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user, i) => (
                  <TableRow
                    key={user._id}
                    className={`transition ${
                      !user.isActive
                        ? "bg-red-50 opacity-70"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <TableCell>{i + 1}</TableCell>

                    {/* Profile */}
                    <TableCell>
                      <img
                        src={user.profilePic || logo}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    </TableCell>

                    {/* Name */}
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-gray-600">
                      {user.email}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <select
                        value={user.role}
                        disabled={user._id === currentUser?._id}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="p-2 border rounded-md text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="productOwner">Product Owner</option>
                      </select>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={user.isActive}
                          disabled={user._id === currentUser?._id}
                          onCheckedChange={(checked) =>
                            handleActiveToggle(user._id, checked)
                          }
                        />

                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Blocked"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== STAT CARD =====
const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`p-4 rounded-xl text-center border ${colors[color] || ""}`}>
      <p className="text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default AdminUsers;
