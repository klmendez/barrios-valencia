type PieEntry = { label: string; value: number; color?: string };

const palette = ["#315875", "#A1805E", "#6B8F89", "#8B76A5", "#C47668", "#788DA8", "#B89C55", "#6497A6", "#9A7A79"];

export function DistributionPie({ title, entries, totalLabel, formatValue = (value) => String(value) }: { title: string; entries: PieEntry[]; totalLabel: string; formatValue?: (value: number) => string }) {
  const positive = entries.filter((entry) => Number.isFinite(entry.value) && entry.value > 0);
  const total = positive.reduce((sum, entry) => sum + entry.value, 0);
  let position = 0;
  const slices = positive.map((entry, index) => {
    const start = position;
    position += entry.value / total * 100;
    return `${entry.color ?? palette[index % palette.length]} ${start}% ${position}%`;
  });

  return <section className="border-b border-slate-200 py-3">
    <div className="flex items-baseline justify-between gap-2"><h2 className="text-sm font-semibold text-slate-900">{title}</h2><span className="text-[10px] text-slate-500">{totalLabel}</span></div>
    <div className="mt-2 flex flex-wrap items-center gap-4">
      <div className="h-28 w-28 shrink-0 rounded-full" role="img" aria-label={`${title}: ${positive.map((entry) => `${entry.label} ${formatValue(entry.value)}`).join(", ") || "sin datos"}`} style={{ background: total ? `conic-gradient(${slices.join(", ")})` : "#e2e8f0" }} />
      <div className="min-w-[180px] flex-1 divide-y divide-slate-100">
        {positive.map((entry, index) => <div key={entry.label} className="flex items-center justify-between gap-2 py-1 text-[11px]"><span className="flex min-w-0 items-center gap-2 text-slate-600"><i className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: entry.color ?? palette[index % palette.length] }} /><span className="truncate" title={entry.label}>{entry.label}</span></span><span className="shrink-0 font-medium tabular-nums text-slate-800">{formatValue(entry.value)} <span className="font-normal text-slate-400">({Math.round(entry.value / total * 100)}%)</span></span></div>)}
        {!total && <p className="py-2 text-xs text-slate-500">Aún no hay datos para estos filtros.</p>}
      </div>
    </div>
  </section>;
}
