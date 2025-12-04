import React from "react";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder,
}) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="select-red-600 bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
