import { ChartNoAxesCombined } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function IncomeExpenseChart({
  displayedChart,
  range,
  setRange,
}) {
  return (
    <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ChartNoAxesCombined className="text-emerald-600" size={20} />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              Income vs Expense
            </h2>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Track your monthly financial performance
          </p>
        </div>

        <div className="flex bg-slate-50 p-1 rounded-xl">
          {["6M", "1Y", "All"].map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-4 py-2 text-xs rounded-lg font-semibold transition ${
                range === item
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-500 hover:text-emerald-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-full bg-emerald-600" />
          Income
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-3 rounded-full bg-rose-400" />
          Expense
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayedChart}
            barGap={7}
            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
            />

            <Tooltip
              cursor={{ fill: "#F0FDF4" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
              }}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#059669"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />

            <Bar
              dataKey="expense"
              name="Expense"
              fill="#FB7185"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
