
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";

import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Settings from "./pages/Settings";

import InstallApp from "./InstallApp";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

export default function App() {
  return (
    <BrowserRouter>
      <InstallApp />

      <Routes>
        {/* Public Home Page */}
        <Route path="/" element={<Home />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget/:id" element={<Budget />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expense />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Guest Pages */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
