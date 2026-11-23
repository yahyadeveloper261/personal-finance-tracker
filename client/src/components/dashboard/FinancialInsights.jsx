import { CircleDollarSign, Target, Sparkles } from "lucide-react";

export default function FinancialInsights({
  totalSavings,
  budgetPercent,
  remaining,
}) {
  const isNegative = totalSavings < 0;
  const isExceeded = budgetPercent >= 100;
  const isRemainingNegative = remaining < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Net Cash Flow */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <div
          className={`p-3 rounded-xl ${
            isNegative ? "bg-rose-50" : "bg-emerald-50"
          }`}
        >
          <CircleDollarSign
            className={isNegative ? "text-rose-400" : "text-emerald-600"}
            size={23}
          />
        </div>

        <div>
          <p className="text-xs text-slate-500">Net Cash Flow</p>
          <h3
            className={`text-lg font-bold ${
              isNegative ? "text-rose-400" : "text-slate-800"
            }`}
          >
            {isNegative
              ? `- ${Math.abs(totalSavings).toLocaleString()}`
              : totalSavings.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Budget Used */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <div
          className={`p-3 rounded-xl ${
            isExceeded ? "bg-rose-50" : "bg-violet-50"
          }`}
        >
          <Target
            className={isExceeded ? "text-rose-400" : "text-violet-600"}
            size={23}
          />
        </div>

        <div>
          <p className="text-xs text-slate-500">Budget Used</p>
          <h3
            className={`text-lg font-bold ${
              isExceeded ? "text-rose-400" : "text-slate-800"
            }`}
          >
            {budgetPercent}%
          </h3>
        </div>
      </div>

      {/* Remaining Budget */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <div
          className={`p-3 rounded-xl ${
            isRemainingNegative ? "bg-rose-50" : "bg-amber-50"
          }`}
        >
          <Sparkles
            className={isRemainingNegative ? "text-rose-400" : "text-amber-500"}
            size={23}
          />
        </div>

        <div>
          <p className="text-xs text-slate-500">Remaining Budget</p>
          <h3
            className={`text-lg font-bold ${
              isRemainingNegative ? "text-rose-400" : "text-slate-800"
            }`}
          >
            {isRemainingNegative
              ? `- ${Math.abs(remaining).toLocaleString()}`
              : remaining.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
