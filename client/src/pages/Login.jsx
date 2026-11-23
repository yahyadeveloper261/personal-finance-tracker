import React, { useState } from "react";
import { Wallet, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;
    setError("");
    setSuccess("");
    try {
      setLoading(true);

      const formData = {
        email: email.trim().toLowerCase(),
        password,
      };

      const data = await login(formData);
      localStorage.setItem("token", data.token);
      setSuccess(data.message || "Login successfully!");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-200 flex items-center justify-center p-4">
      {/* Background Effects */}

      <div className="absolute w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full -top-20 -left-20"></div>

      <div className="absolute w-96 h-96 bg-yellow-200/40 blur-[100px] rounded-full bottom-0 right-0"></div>

      {/* Outer Glass Container */}

      <div className="relative w-full max-w-6xl min-h-[650px] rounded-3xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-2xl p-6 md:p-10 flex flex-col">
        {/* Logo */}

        <div className="flex items-center gap-3 text-white">
          <div className="border-2 border-white p-2 rounded-xl">
            <Wallet size={26} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-wide">FinTrack</h1>
        </div>

        {/* Main Login Area */}

        <div className="flex-1 flex items-center justify-center py-8">
          <div className="relative w-full max-w-3xl flex flex-col md:flex-row items-center">
            {/* Welcome Panel */}

            <div className="relative w-full md:w-[55%] min-h-[390px] md:h-[440px] rounded-t-[30px] md:rounded-[35px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white p-8 shadow-xl overflow-hidden">
              <div className="absolute w-64 h-64 bg-white/20 rounded-full blur-3xl -top-20 -left-10"></div>

              <div className="absolute w-64 h-64 bg-purple-400/30 rounded-full blur-3xl bottom-0 right-0"></div>

              <div className="relative z-10 text-center">
                <div className="inline-flex bg-white/20 p-4 rounded-2xl mb-6 backdrop-blur-md">
                  <Wallet size={38} />
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold">
                  Welcome Back!
                </h2>

                <p className="text-white/90 text-sm mt-5 leading-6 max-w-xs mx-auto">
                  To keep connected with us please login with your personal
                  information.
                </p>

                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-white"></div>
                  <div className="w-3 h-1.5 rounded-full bg-white/50"></div>
                  <div className="w-3 h-1.5 rounded-full bg-white/50"></div>
                </div>
              </div>
            </div>

            {/* Login Form */}

            <div className="relative w-full md:w-[60%] md:-ml-12 md:translate-x-0 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-b-[30px] md:rounded-[35px] p-7 sm:p-10 shadow-2xl z-10">
              <div className="text-center mb-7">
                <h2 className="text-3xl font-extrabold text-slate-800">
                  Login
                </h2>

                <p className="text-slate-600 text-sm mt-2">
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleLogin} noValidate className="space-y-5">
                {/* Error Message */}

                {error && (
                  <p className="text-red-600 bg-red-100 border border-red-200 p-3 rounded-xl text-sm text-center">
                    {error}
                  </p>
                )}

                {/* Success Message */}

                {success && (
                  <p className="text-green-700 bg-green-100 border border-green-200 p-3 rounded-xl text-sm text-center">
                    {success}
                  </p>
                )}

                {/* Email */}

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Username / Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-5 pr-12 py-3.5 bg-white/65 border border-white/80 rounded-full outline-none text-slate-800 placeholder:text-slate-600 focus:bg-white/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-300/30 transition"
                  />

                  <Mail
                    size={19}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700"
                  />
                </div>

                {/* Password */}

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-5 pr-12 py-3.5 bg-white/65 border border-white/80 rounded-full outline-none text-slate-800 placeholder:text-slate-600 focus:bg-white/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-300/30 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {/* Sign In */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group mx-auto w-3/4 flex items-center justify-center gap-2 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-blue-400/30 transition duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "SIGNING IN..." : "SIGN IN"}

                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </button>
              </form>

              {/* Register */}

              <p className="text-center text-sm text-slate-700 mt-7">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-bold text-slate-900 hover:text-blue-700"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}

        <p className="text-center text-white/80 text-xs">
          © 2026 FinTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
}
