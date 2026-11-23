import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <Navbar setOpen={setOpen} />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
