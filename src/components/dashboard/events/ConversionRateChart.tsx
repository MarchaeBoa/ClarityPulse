"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface ConversionRateChartProps {
  period: "7D" | "30D" | "90D";
}

function generateRateData(days: number) {
  const data = [];
  const baseRates = [
    2.1, 2.3, 2.2, 2.5, 2.8, 2.4, 2.0,
    2.3, 2.6, 2.4, 2.7, 3.0, 2.5, 2.2,
    2.4, 2.7, 2.5, 2.9, 3.1, 2.6, 2.3,
    2.5, 2.8, 2.6, 3.0, 3.2, 2.7, 2.4,
    2.6, 2.9,
  ];
  for (let i = 0; i < days; i++) {
    const idx = i % baseRates.length;
    const rate = baseRates[idx] + (i / days) * 0.4;
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: Number(rate.toFixed(2)),
    });
  }
  return data;
}

const datasets: Record<string, ReturnType<typeof generateRateData>> = {
  "7D": generateRateData(7),
  "30D": generateRateData(30),
  "90D": generateRateData(90),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-ink-2 border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3 py-2.5 shadow-lg">
      <p className="text-ghost text-xs mb-1">{label}</p>
      <p className="text-sm font-semibold text-ink dark:text-white">
        {payload[0].value}%
      </p>
    </div>
  );
}

export function ConversionRateChart({ period }: ConversionRateChartProps) {
  const data = datasets[period];
  const currentRate = data[data.length - 1].rate;
  const prevRate = data[Math.max(0, data.length - 8)].rate;
  const avgRate = Number((data.reduce((sum, d) => sum + d.rate, 0) / data.length).toFixed(2));

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Conversion Rate</h3>
        <p className="text-xs text-ghost mt-0.5">Rate trend over time</p>
      </div>

      {/* Current vs Previous */}
      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-2xl font-display font-bold text-ink dark:text-white tracking-tight">
            {currentRate}%
          </p>
          <p className="text-[11px] text-ghost">Current</p>
        </div>
        <div className="mb-0.5">
          <p className="text-sm font-semibold text-ghost">{prevRate}%</p>
          <p className="text-[11px] text-ghost">Previous</p>
        </div>
        <div className="mb-0.5 ml-auto">
          <p className="text-sm font-semibold text-jade">
            +{(currentRate - prevRate).toFixed(2)}pp
          </p>
          <p className="text-[11px] text-ghost">Change</p>
        </div>
      </div>

      <div className="h-[186px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1AE5A0" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1AE5A0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-black/[0.04] dark:text-white/[0.04]"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9BA0AE" }}
              interval={period === "7D" ? 1 : period === "30D" ? 6 : 18}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9BA0AE" }}
              tickFormatter={(v) => `${v}%`}
              width={40}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgRate}
              stroke="#9BA0AE"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#1AE5A0"
              strokeWidth={2}
              fill="url(#gradRate)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#1AE5A0" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        <div className="w-5 h-px bg-ghost/30" style={{ strokeDasharray: "4 4" }} />
        <span className="text-[10px] text-ghost">Avg: {avgRate}%</span>
      </div>
    </div>
  );
}
