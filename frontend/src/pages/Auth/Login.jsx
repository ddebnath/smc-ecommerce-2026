import React, { useState, useContext } from "react";
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      dispatch(setUser(res.data.user)); // Update Redux store with user data

      // create a local storage for access token and user data
      localStorage.setItem("accessToken", res.data.accessToken);

      toast.success(res.data.message || "Logged in successfully", {
        position: "top-center",
      });

      navigate("/");
    } catch (error) {
      toast.error(
        error?.res?.data?.message || "Login failed. Please try again.",
        { position: "top-center" },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100 px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 sm:max-w-2xl">
        <CardHeader className="border-b border-slate-200 px-6 py-6 text-center sm:px-8">
          <CardTitle className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Sign in to your account
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 inline-flex items-center rounded px-2 text-slate-500 transition hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <CardFooter className="px-0 py-0">
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>

        <div className="border-t border-slate-200 px-6 py-6 sm:px-8">
          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
