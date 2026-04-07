import React, { useEffect, useState } from "react";
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
import { API_URL } from "@/config/api";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erros, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { confirmPassword, ...formDetails } = formData;
      if (validateForm()) {
        const res = await axios.post(
          `${API_URL}/user/auth/register`,
          formDetails,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (res.data.success) {
          toast.success(res.data.message, { position: "top-center" });
          setTimeout(() => {
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
          }, 1000);
          setTimeout(() => {
            navigate("/auth/verify");
          }, 1000);
        } else {
          toast.error(res.data.message, { position: "top-center" });
        }
      }
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name can't be blank";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name can't be blank";
    }
    if (!email.trim()) {
      newErrors.email = "Email can't be blank";
    }

    if (!password) {
      newErrors.password = "Password can't be blank";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must include an uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must include a lowercase letter";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must include a number";
    }

    if (password && confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100 px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 sm:max-w-2xl">
        <CardHeader className="border-b border-slate-200 px-6 py-6 text-center sm:px-8">
          <CardTitle className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Register
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-6 sm:px-8">
          <form>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <p className="text-red-500">{erros.firstName}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <p className="text-red-500">{erros.lastName}</p>
              </div>
              <div className="md:col-span-2 grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <p className="text-red-500">{erros.email}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    className="pr-10"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 inline-flex items-center rounded px-2 text-slate-500 transition hover:text-slate-900"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-red-500">{erros.password}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pr-10"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 inline-flex items-center rounded px-2 text-slate-500 transition hover:text-slate-900"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <p className="text-red-500">{erros.confirmPassword}</p>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-6 py-6 sm:px-8">
          <Button
            type="submit"
            className="bg-blue-600 cursor-pointer hover:bg-blue-500 w-full py-3 text-base font-medium sm:py-4"
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
