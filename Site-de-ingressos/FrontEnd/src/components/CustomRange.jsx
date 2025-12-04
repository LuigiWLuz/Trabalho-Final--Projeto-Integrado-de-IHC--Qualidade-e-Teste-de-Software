import React from "react";

export default function CustomRange({ min, max, value, onChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="range text-blue-300 [--range-bg:red-600] [--range-thumb:white] [--range-fill:0] w-full"
    />
  );
}
