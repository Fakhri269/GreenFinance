import React, { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ChevronDown } from "lucide-react";

export default function TrendChart({ transactions }) {
  const [range, setRange] = useState("6m");

  // Dynamically calculate chart data points from actual transaction timestamps
  const getChartData = () => {
    const monthCount = range === "1y" ? 12 : 6;
    const now = new Date();
    const monthsData = [];

    // Sort transactions chronologically to calculate running balance correctly
    const sortedTxs = [...transactions].sort((a, b) => a.timestamp - b.timestamp);

    for (let i = monthCount - 1; i >= 0; i--) {
      // Find the end of target month
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      // Indonesian locale for month name (short, cth. "Jan", "Feb")
      const monthLabel = targetDate.toLocaleDateString("id-ID", { month: "short" });
      
      // Calculate running cumulative balance up to the end of this month
      let balanceAtMonthEnd = 0;
      sortedTxs.forEach(tx => {
        if (tx.timestamp <= targetDate.getTime()) {
          if (tx.type === "income") {
            balanceAtMonthEnd += tx.amount;
          } else {
            balanceAtMonthEnd -= tx.amount;
          }
        }
      });

      monthsData.push({
        name: monthLabel,
        value: balanceAtMonthEnd
      });
    }

    return monthsData;
  };

  // Beautiful forest-green custom tooltip with clean IDR format
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const formattedVal = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val).replace("Rp", "Rp ");
      
      return (
        <div style={{
          backgroundColor: "#14532D",
          color: "#ffffff",
          padding: "10px 14px",
          borderRadius: "14px",
          fontFamily: "var(--font-heading)",
          fontSize: "12px",
          fontWeight: "600",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {payload[0].name}
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#ffffff" }}>
            {formattedVal}
          </p>
        </div>
      );
    }
    return null;
  };

  // Dynamic formatting for Y Axis (Indonesian financial style, cth: "1.2jt", "400rb")
  const formatYAxis = (val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1).replace(".0", "")}jt`;
    }
    if (val >= 1000) {
      return `${(val / 100).toFixed(0) / 10}rb`.replace(".0", "");
    }
    return val;
  };

  return (
    <div className="section-wrapper animate-fade-in-up">
      <div className="section-title-bar">
        <h3 className="section-title">Tren Saldo Bulanan</h3>
        <div className="dropdown-wrapper">
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="dropdown-select"
            aria-label="Filter rentang waktu statistik"
          >
            <option value="6m">6 Bulan</option>
            <option value="1y">1 Tahun</option>
          </select>
          <ChevronDown size={14} className="dropdown-chevron" />
        </div>
      </div>
      
      <div style={{ width: "100%", height: 210, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={getChartData()}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "var(--font-body)" }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "var(--font-body)" }}
              tickFormatter={formatYAxis}
              domain={[0, "auto"]}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#22C55E" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)"
              dot={{ stroke: "#22C55E", strokeWidth: 2, r: 4, fill: "#ffffff" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#22C55E" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
