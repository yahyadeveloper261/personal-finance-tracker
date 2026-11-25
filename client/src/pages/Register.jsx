import { useState } from "react";

import {
  Wallet,
  User,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { register } from "../services/authApi";

export default function Register() {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const data = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess(data.message || "Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-200 flex items-center justify-center p-4">
      {/* Background */}

      <div className="absolute w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full -top-20 -left-20"></div>

      <div className="absolute w-96 h-96 bg-yellow-200/40 blur-[100px] rounded-full bottom-0 right-0"></div>

      {/* Main Container */}

      <div className="relative w-full max-w-6xl rounded-3xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-2xl p-6 md:p-10">
        {/* Logo */}

        <div className="flex items-center gap-3 text-white">
          <div className="border-2 border-white p-2 rounded-xl">
            <Wallet size={26} />
          </div>

          <h1 className="text-2xl font-extrabold">FinTrack</h1>
        </div>

        {/* Register Area */}

        <div className="flex justify-center items-center py-8">
          <div className="relative w-full max-w-3xl flex flex-col md:flex-row items-center">
            {/* Welcome Section */}

            <div className="relative w-full md:w-[55%] min-h-[420px] rounded-t-[30px] md:rounded-[35px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white p-8 shadow-xl overflow-hidden">
              <div className="absolute w-64 h-64 bg-white/20 rounded-full blur-3xl -top-20 -left-10"></div>

              <div className="absolute w-64 h-64 bg-purple-400/30 rounded-full blur-3xl bottom-0 right-0"></div>

              <div className="relative z-10 text-center">
                <div className="inline-flex bg-white/20 p-4 rounded-2xl mb-6 backdrop-blur-md">
                  <Wallet size={38} />
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold">
                  Join FinTrack!
                </h2>

                <p className="text-white/90 text-sm mt-5 leading-6 max-w-xs mx-auto">
                  Start your financial journey today. Manage your income, track
                  expenses and build a better future.
                </p>

                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-white"></div>
                  <div className="w-3 h-1.5 rounded-full bg-white/50"></div>
                  <div className="w-3 h-1.5 rounded-full bg-white/50"></div>
                </div>
              </div>
            </div>

            {/* Register Form */}

            <div className="relative w-full md:w-[60%] md:-ml-12 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-b-[30px] md:rounded-[35px] p-7 sm:p-10 shadow-2xl z-10">
              <div className="text-center mb-7">
                <h2 className="text-3xl font-extrabold text-slate-800">
                  Create Account
                </h2>

                <p className="text-slate-600 text-sm mt-2">
                  Sign up to get started
                </p>
              </div>

              <form onSubmit={handleRegister} noValidate className="space-y-4">
                {/* Success Message */}

                {success && (
                  <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 rounded-xl p-3 text-sm">
                    <p>{success}</p>
                  </div>
                )}

                {/* Error Message */}

                {error && (
                  <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-600 rounded-xl p-3 text-sm">
                    <AlertCircle size={18} />
                    <p>{error}</p>
                  </div>
                )}

                {/* Name */}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={3}
                    maxLength={40}
                    autoComplete="name"
                    required
                    className="w-full pl-5 pr-12 py-3.5 bg-white/65 border border-white/80 rounded-full outline-none text-slate-800 placeholder:text-slate-600 focus:bg-white/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-300/30 transition"
                  />

                  <User
                    size={19}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700"
                  />
                </div>

                {/* Email */}

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
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
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={20}
                    autoComplete="new-password"
                    className="w-full pl-5 pr-12 py-3.5 bg-white/65 border border-white/80 rounded-full outline-none text-slate-800 placeholder:text-slate-600 focus:bg-white/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-300/30 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-blue-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                {/* Password Strength */}

                {password && (
                  <p
                    className={`text-xs px-3 ${
                      password.length >= 8 &&
                      password.length <= 20 &&
                      /[A-Z]/.test(password) &&
                      /[0-9]/.test(password)
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {password.length >= 8 &&
                    password.length <= 20 &&
                    /[A-Z]/.test(password) &&
                    /[0-9]/.test(password)
                      ? "Strong password"
                      : "Use 8-20 characters, one uppercase letter and one number"}
                  </p>
                )}

                {/* Confirm Password */}

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={20}
                    autoComplete="new-password"
                    className="w-full pl-5 pr-12 py-3.5 bg-white/65 border border-white/80 rounded-full outline-none text-slate-800 placeholder:text-slate-600 focus:bg-white/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-300/30 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-blue-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {/* Confirm Password Message */}

                {confirmPassword && (
                  <p
                    className={`text-xs px-3 ${
                      password === confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}

                {/* Register Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-3/4 mx-auto flex items-center justify-center gap-2 py-3.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-blue-400/30 transition duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}

              <p className="text-center text-sm text-slate-700 mt-7">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="font-bold text-slate-900 hover:text-blue-700"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/80 text-xs">
          © 2026 FinTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
}
