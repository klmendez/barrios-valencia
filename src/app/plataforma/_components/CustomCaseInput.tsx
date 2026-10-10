"use client";

import type { CustomCaseField } from "@/lib/platform-types";

type Props = { field: CustomCaseField; value: string; onSave: (value: string) => void; ariaLabel: string; compact?: boolean };

export function CustomCaseInput({ field, value, onSave, ariaLabel, compact = false }: Props) {
  const className = compact
    ? "h-7 w-36 border border-slate-200 bg-white px-1.5 text-[11px] text-slate-700 outline-none focus:border-[#315875]"
    : "mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs text-slate-800 outline-none focus:border-[#315875]";

  if (field.type === "select") return <select aria-label={ariaLabel} value={value} onChange={(event) => onSave(event.target.value)} className={className}>
    <option value="">Sin definir</option>
    {value && !field.options.includes(value) && <option value={value}>{value}</option>}
    {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
  </select>;

  return <input key={`${field.id}-${value}`} aria-label={ariaLabel} type={field.type} step={field.type === "number" ? "any" : undefined} defaultValue={value} onBlur={(event) => { const next = event.currentTarget.value.trim(); if (next !== value) onSave(next); }} className={className} placeholder={field.type === "text" ? "Sin definir" : undefined} />;
}
