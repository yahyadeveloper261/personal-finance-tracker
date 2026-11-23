import { Wallet } from "lucide-react";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function ExpenseCategoryChart({ categoryData, totalExpense }) {
  return (
    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-50 rounded-lg">
          <Wallet size={20} className="text-violet-600" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Expense Categories
          </h2>

          <p className="text-xs text-slate-400">Spending breakdown</p>
        </div>
      </div>

      <div className="relative h-56 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={68}
              outerRadius={98}
              paddingAngle={4}
              stroke="none"
            >
              {categoryData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => `Rs. ${Number(value).toLocaleString()}`}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h3 className="text-xl font-bold text-slate-900">
            {totalExpense.toLocaleString()}
          </h3>

          <p className="text-xs text-slate-500">Total Expense</p>
        </div>
      </div>

      <div className="space-y-3 mt-2">
        {categoryData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-slate-600">{item.name}</span>
            </div>

            <span className="font-semibold text-slate-700">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
