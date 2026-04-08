import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/config/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  const verifyToken = async () => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    console.log("Verifying token:", token);

    try {
      const res = await axios.post(
        `${API_URL}/user/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message, { position: "top-center" });
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
        // <Navigate to="/auth/login" replace />; // Redirect to login page after successful verification
      }
    } catch (error) {
      const errorMessage =
        error?.res?.data?.message ||
        "Unable to verify your email. Please try again.";
      toast.error(errorMessage, { position: "top-center" });
      setStatus("error");
      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [token]);

  const title =
    status === "loading"
      ? "Verifying..."
      : status === "success"
        ? "Email Verified"
        : "Verification Failed";
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl shadow-slate-200/40">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm leading-7 text-slate-600">{message}</p>
          <div className="rounded-2xl bg-slate-50 px-6 py-5 text-left text-sm text-slate-700 shadow-sm">
            {status === "success" ? (
              <>
                <p className="font-medium text-slate-900">Next step</p>
                <p className="mt-2">
                  Your account is verified. Login to continue to your dashboard.
                </p>
              </>
            ) : status === "error" ? (
              <>
                <p className="font-medium text-slate-900">Need help?</p>
                <p className="mt-2">
                  If the verification link has expired, request a new email from
                  the registration page.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-slate-900">Please wait</p>
                <p className="mt-2">
                  We are verifying your account with the token from the email
                  link.
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to login
            </Link>
            <Link
              to="/auth/signup"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Sign up again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
