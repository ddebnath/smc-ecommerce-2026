import React from "react";
import { Link } from "react-router-dom";

const Verify = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl shadow-slate-200/40">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Verify Your Email
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            We sent a verification link to your inbox. Open your email and click
            the link to activate your account.
          </p>
          <p className="text-sm leading-7 text-slate-600">
            If you don&apos;t see it, check your spam or promotions folder.
          </p>
          <div className="rounded-2xl bg-slate-50 px-6 py-5 text-left text-sm text-slate-700 shadow-sm">
            <p className="font-medium text-slate-900">Next step</p>
            <p className="mt-2">
              Open your email app and click the verification link to continue.
            </p>
          </div>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
