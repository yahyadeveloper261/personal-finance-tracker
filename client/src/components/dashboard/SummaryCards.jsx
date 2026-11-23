import { ArrowUpRight } from "lucide-react";

import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {summary.map((item) => {
        const Icon = item.icon;

        const miniData = item.trend.map((value, index) => ({
          value,
          index,
        }));

        return (
          <div
            key={item.title}
            className={`${item.bg} relative overflow-hidden rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-white/50`}
          >
            {/* Decorative Circle */}

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/20" />

            <div className="absolute right-12 -bottom-16 w-36 h-36 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <div className={`p-3 rounded-xl ${item.iconBg} shadow-sm`}>
                  <Icon size={22} className={item.iconColor} />
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${item.badgeBg}`}
                >
                  {item.badge}
                </span>
              </div>

              <p className={`text-sm font-medium mt-5 ${item.subColor}`}>
                {item.title}
              </p>

              <h2
                className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${
                  item.title === "Total Balance" && item.amount < 0
                    ? "text-rose-400"
                    : item.textColor
                }`}
              >
                {item.amount < 0
                  ? `- Rs. ${Math.abs(item.amount).toLocaleString()}`
                  : `Rs. ${item.amount.toLocaleString()}`}
              </h2>

              <div className="flex justify-between items-end mt-4">
                <div className="flex items-center gap-1 text-xs font-medium">
                  <ArrowUpRight
                    size={15}
                    className={
                      item.title === "Total Expense"
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }
                  />

                  <span
                    className={
                      item.title === "Total Balance"
                        ? "text-emerald-100"
                        : "text-slate-600"
                    }
                  >
                    Financial summary
                  </span>
                </div>

                <div className="w-24 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={item.trendColor}
                        strokeWidth={2.5}
                        dot={false}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
