import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Target,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const features = [
    {
      icon: TrendingUp,
      title: "Track Transactions",
      description: "Manage your income and expenses in one place.",
    },
    {
      icon: PieChart,
      title: "Financial Reports",
      description: "Understand your spending with visual reports.",
    },
    {
      icon: Target,
      title: "Manage Budgets",
      description: "Set monthly budgets and monitor your spending.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Account",
      description: "Keep your financial information protected.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <Wallet size={25} />
          </div>
          <span className="text-2xl font-bold">FinTrack</span>
        </div>

        <div className="flex gap-3">
          {token ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl font-semibold"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 font-semibold hover:text-emerald-400"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl font-semibold"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Smart Personal Finance Management
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Take Control of Your
            <span className="text-emerald-400"> Money</span>
          </h1>

          <p className="text-slate-400 text-lg mt-6 leading-8">
            Track your income, manage expenses, create budgets, and understand
            your financial journey with FinTrack.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <button
              onClick={() => navigate(token ? "/dashboard" : "/register")}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-7 py-4 rounded-xl font-bold transition"
            >
              {token ? "Open Dashboard" : "Get Started"}
              <ArrowRight size={19} />
            </button>

            {!token && (
              <button
                onClick={() => navigate("/login")}
                className="border border-slate-700 hover:border-emerald-400 px-7 py-4 rounded-xl font-semibold transition"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Finance Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-9 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-slate-400 text-sm">Financial Overview</p>
              <h2 className="text-2xl font-bold mt-1">Your Money</h2>
            </div>
            <div className="bg-emerald-500/15 p-3 rounded-xl">
              <Wallet className="text-emerald-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-2xl">
            <p className="text-emerald-100">Total Balance</p>
            <h2 className="text-3xl font-bold mt-2">$12,450.00</h2>
            <p className="text-emerald-100 text-sm mt-3">
              Sample dashboard preview
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="bg-slate-800 p-5 rounded-2xl">
              <TrendingUp className="text-emerald-400 mb-3" />
              <p className="text-slate-400 text-sm">Income</p>
              <h3 className="text-xl font-bold mt-1">$8,500</h3>
            </div>

            <div className="bg-slate-800 p-5 rounded-2xl">
              <TrendingUp className="text-rose-400 mb-3 rotate-180" />
              <p className="text-slate-400 text-sm">Expenses</p>
              <h3 className="text-xl font-bold mt-1">$3,200</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900/70 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 font-semibold">FEATURES</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Everything You Need to Manage Money
            </h2>
            <p className="text-slate-400 mt-4">
              Simple tools to make smarter financial decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="bg-slate-950 border border-slate-800 p-7 rounded-2xl hover:border-emerald-500 transition"
                >
                  <div className="bg-emerald-500/10 text-emerald-400 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-lg font-bold mt-5">{feature.title}</h3>

                  <p className="text-slate-400 text-sm leading-6 mt-3">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm">
        © 2026 FinTrack. All rights reserved.
      </footer>
    </div>
  );
}
