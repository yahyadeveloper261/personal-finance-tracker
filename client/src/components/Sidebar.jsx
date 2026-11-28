import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authApi";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  PiggyBank,
  Wallet,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Income",
    path: "/income",
    icon: TrendingUp,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: TrendingDown,
  },

  {
    name: "Budget",
    path: "/budget",
    icon: Wallet,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout Error:", error.message);
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r border-white/5
          bg-[#111827] text-white
          shadow-2xl shadow-slate-950/20
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Wallet size={23} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-wide text-white">
                FinTrack
              </h1>

              <p className="text-[10px] font-medium tracking-[2px] text-slate-400">
                SMART FINANCE
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-red-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-5 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                    group relative flex items-center gap-3
                    overflow-hidden rounded-xl px-4 py-3.5
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/40"
                        : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 transition-transform duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:scale-110 group-hover:text-indigo-400"
                        }`}
                      />

                      <span>{item.name}</span>

                      {isActive && (
                        <ChevronRight
                          size={17}
                          className="ml-auto text-white/80"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Finance Tools */}
          <div className="my-7 border-t border-white/10" />

          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
            Finance Tools
          </p>

          <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <PiggyBank size={20} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Smart Savings
                </p>

                <p className="text-[10px] text-slate-500">
                  Build better habits
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-white/10 p-4">
          {/* Premium Card */}
          <div className="relative mb-4 overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-slate-800 p-4">
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={17} className="text-amber-400" />

                <span className="text-[10px] font-bold tracking-widest text-indigo-300">
                  FINANCIAL TIPS
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">Save more money!</h3>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                Track your spending and build smarter financial habits.
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut
              size={19}
              className="transition-transform group-hover:-translate-x-1"
            />
            Logout
            <ChevronRight
              size={16}
              className="ml-auto opacity-0 transition group-hover:opacity-100"
            />
          </button>
        </div>
      </aside>
    </>
  );
}
