import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Settings from "./pages/Settings";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Layout */}
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

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
