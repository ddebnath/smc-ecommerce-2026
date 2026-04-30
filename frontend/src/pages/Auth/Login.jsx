import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../../config/api.js";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import AlertMessage from "@/components/AlertMessage.jsx";

const Login = () => {
  const [showMessage, setShowMessage] = useState(false);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus } = location.state || {};

  useEffect(() => {
    if (loginStatus === "login_first") {
      setShowMessage(true);
    }

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/user/auth/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.user.role === "blocked") {
        toast.error("User has been blocked.. request admin to unblock", {
          position: "top-center",
        });
        return;
      }
      dispatch(setUser(res.data.user)); // Update Redux store with user data

      // create a local storage for access token and user data
      localStorage.setItem("accessToken", res.data.accessToken);
      toast.success(res.data.message || "Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.res?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* LEFT SIDE (Brand / Image) */}
      <div className="hidden lg:flex flex-col justify-center items-center px-12 bg-blue-600 text-white relative overflow-hidden">
        <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-lg text-blue-100 text-center max-w-md">
          Sign in to access your account and discover the best products tailored
          for you.
        </p>

        {/* subtle background circle */}
        <div className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10 blur-2xl"></div>
        <div className="absolute w-72 h-72 bg-white/10 rounded-full bottom-10 right-10 blur-2xl"></div>
      </div>

      {/* RIGHT SIDE (Form) */}

      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center">
          {showMessage && <AlertMessage message="You Need To Login First" />}
        </div>

        <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
          <CardHeader className="text-center space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Sign in
            </CardTitle>
            <p className="text-sm text-gray-500">
              Enter your credentials to continue
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pr-10 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col gap-3 text-center text-sm text-gray-600">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
