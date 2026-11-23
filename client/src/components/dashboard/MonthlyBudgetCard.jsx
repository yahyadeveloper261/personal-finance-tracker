import { Target, Lightbulb, TrendingUp } from "lucide-react";

export default function MonthlyBudgetCard({
  budget,
  spent,
  remaining,
  budgetPercent,
}) {
  const isExceeded = budgetPercent >= 100;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 rounded-2xl p-5 text-white shadow-md">
      <div className="absolute -right-12 -top-12 w-36 h-36 bg-white/5 rounded-full" />

      <div className="relative">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">Monthly Budget</h2>
            <p className="text-emerald-200 text-xs mt-1">
              Your monthly spending limit
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/10">
            <Target size={22} className="text-emerald-300" />
          </div>
        </div>

        <div className="mt-9">
          <p className="text-xs text-emerald-200">Total spent</p>

          <h2 className="text-3xl font-bold mt-1">{spent.toLocaleString()}</h2>

          <p className="text-xs text-emerald-200 mt-1">
            Out of {budget.toLocaleString()}
          </p>
        </div>

        <div className="w-full h-3 bg-white/15 rounded-full mt-6 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isExceeded ? "bg-rose-400" : "bg-emerald-300"
            }`}
            style={{
              width: `${Math.min(Math.max(budgetPercent, 0), 100)}%`,
            }}
          />
        </div>

        <div className="flex justify-between mt-3 text-xs">
          <span className="text-emerald-200">Budget used</span>

          <span
            className={`font-bold ${
              isExceeded ? "text-rose-300" : "text-white"
            }`}
          >
            {budgetPercent}%
          </span>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mt-7">
          <div className="flex items-start gap-3">
            <Lightbulb size={22} className="text-yellow-300 shrink-0" />

            <div>
              <p className="text-sm font-semibold">
                {isExceeded ? "Budget Exceeded!" : "Keep it up!"}
              </p>

              <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
                {isExceeded
                  ? `You have exceeded your budget by ${Math.abs(remaining).toLocaleString()}.`
                  : `You have ${remaining > 0 ? remaining.toLocaleString() : 0} remaining in your monthly budget.`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-7 text-xs text-emerald-200">
          <span>Smart spending, better savings</span>
          <TrendingUp size={20} />
        </div>
      </div>
    </div>
  );
}
