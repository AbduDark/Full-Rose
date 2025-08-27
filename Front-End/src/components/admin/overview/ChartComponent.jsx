import React from "react";

const ChartComponent = ({ data, title, type = "bar" }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  if (type === "bar") {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-20 text-sm text-gray-300">{item.label}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || "#3B82F6",
                  }}
                ></div>
              </div>
              <div className="w-12 text-sm text-gray-300 text-right">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "pie") {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="150" height="150" className="transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = (percentage / 100) * circumference;
                const strokeDashoffset = circumference - strokeDasharray;

                return (
                  <circle
                    key={index}
                    cx="75"
                    cy="75"
                    r={radius}
                    fill="none"
                    stroke={item.color || "#3B82F6"}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total}</div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || "#3B82F6" }}
                ></div>
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <span className="text-sm text-gray-300">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ChartComponent;
