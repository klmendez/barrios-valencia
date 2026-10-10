"use client";

import { useState, type ReactNode } from "react";
import type { CaseRecord, CustomCaseField } from "@/lib/platform-types";
import { CustomCaseInput } from "./CustomCaseInput";

type Props = {
  cases: CaseRecord[];
  fields: CustomCaseField[];
  columnOrder: string[];
  counterparties: string[];
  processTypes: string[];
  statuses: string[];
  statusColors: Record<string, string>;
  onOpen: (id: string) => void;
  onOpenTab: (id: string, tab: "Propiedades" | "Pagos" | "Datos del cliente", focusDeadline?: boolean) => void;
  onCaseFieldChange: (id: string, field: "counterparty" | "type" | "owners", value: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onCustomValueChange: (id: string, field: CustomCaseField, value: string) => void;
  onMoveColumn: (sourceId: string, targetId: string) => void;
};

type Column = { id: string; label: string; render: (item: CaseRecord) => ReactNode; cellClass?: string };
const textCell = "px-2 py-1.5 text-xs text-slate-600";

export function CaseListTable({ cases, fields, columnOrder, counterparties, processTypes, statuses, statusColors, onOpen, onOpenTab, onCaseFieldChange, onStatusChange, onCustomValueChange, onMoveColumn }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const contact = (item: CaseRecord, value: string) => <button type="button" onClick={() => onOpenTab(item.id, "Datos del cliente")} className="max-w-48 truncate text-left hover:underline" title="Abrir datos del cliente">{value || "—"}</button>;
  const editSelect = (item: CaseRecord, field: "counterparty" | "type", choices: string[]) => <select value={item[field]} onChange={(event) => onCaseFieldChange(item.id, field, event.target.value)} aria-label={`${field === "type" ? "Tipo" : "Contraparte"} de ${item.client}`} className="max-w-48 cursor-pointer border-0 bg-transparent py-1 pr-1 text-[11px] text-slate-700 outline-none hover:bg-white focus:bg-white">{[...new Set([item[field], ...choices])].map((choice) => <option key={choice} value={choice}>{choice}</option>)}</select>;
  const base: Column[] = [
    { id: "client", label: "Cliente", render: (item) => <button onClick={() => onOpen(item.id)} className="max-w-48 truncate text-left text-xs font-medium text-slate-900 hover:underline">{item.client}</button> },
    { id: "nationalId", label: "Cédula", render: (item) => contact(item, item.nationalId ?? "") },
    { id: "phone", label: "Celular", render: (item) => contact(item, item.phone ?? "") },
    { id: "email", label: "Correo", render: (item) => contact(item, item.email ?? "") },
    { id: "relativeName", label: "Familiar", render: (item) => contact(item, item.relativeName ?? "") },
    { id: "relativePhone", label: "Celular familiar", render: (item) => contact(item, item.relativePhone ?? "") },
    { id: "relativeRelationship", label: "Parentesco", render: (item) => contact(item, item.relativeRelationship ?? "") },
    { id: "counterparty", label: "Contraparte", render: (item) => editSelect(item, "counterparty", counterparties) },
    { id: "type", label: "Tipo", render: (item) => editSelect(item, "type", processTypes) },
    { id: "owners", label: "Responsable", render: (item) => <select value={item.owners.length > 1 ? "Ambos" : item.owners[0] ?? ""} onChange={(event) => onCaseFieldChange(item.id, "owners", event.target.value)} aria-label={`Responsable de ${item.client}`} className="max-w-48 cursor-pointer border-0 bg-transparent py-1 pr-1 text-[11px] text-slate-700 outline-none hover:bg-white focus:bg-white"><option value="">Sin responsable</option><option>Juan Valencia</option><option>Luis Hernando Barrios</option><option>Ambos</option></select> },
    { id: "status", label: "Estado", render: (item) => <select value={item.status} onChange={(event) => onStatusChange(item.id, event.target.value)} style={{ backgroundColor: statusColors[item.status] ?? "#e2e8f0" }} className="max-w-48 border-0 px-1.5 py-1 text-[11px] text-slate-700 outline-none"><option value={item.status}>{item.status}</option>{statuses.filter((status) => status !== item.status).map((status) => <option key={status}>{status}</option>)}</select> },
    { id: "alert", label: "Alerta", render: (item) => <button type="button" onClick={() => onOpenTab(item.id, "Propiedades", true)} className="text-left hover:underline" title="Actualizar alerta"><span>{item.alert}</span><span className="block text-[10px] text-slate-400">{item.alertDate || ""}</span></button> },
    { id: "dueDate", label: "Vencimiento", render: (item) => <button type="button" onClick={() => onOpenTab(item.id, "Propiedades", true)} className="text-left hover:underline" title="Actualizar vencimiento">{item.dueDate || "—"}</button> },
    { id: "fees", label: "Honorarios", render: (item) => <button type="button" onClick={() => onOpenTab(item.id, "Pagos")} className="text-left hover:underline" title="Actualizar honorarios">{item.fees || "—"}</button> },
    { id: "paid", label: "Pagado", render: (item) => <button type="button" onClick={() => onOpenTab(item.id, "Pagos")} className="text-left hover:underline" title="Registrar un pago">{item.paid || "—"}</button> },
  ];
  const custom: Column[] = fields.map((field) => ({
    id: field.id,
    label: field.name,
    render: (item) => <CustomCaseInput field={field} value={item.customValues?.[field.id] ?? ""} onSave={(value) => onCustomValueChange(item.id, field, value)} ariaLabel={`${field.name} de ${item.client}`} compact />,
  }));
  const byId = new Map([...base, ...custom].map((column) => [column.id, column]));
  const columns = columnOrder.map((id) => byId.get(id)).filter((column): column is Column => Boolean(column));

  return <div className="bv-case-table-scroll overflow-x-auto">
    <table className="bv-case-table w-full text-left" style={{ minWidth: 1450 + fields.length * 160 }}>
      <thead className="border-b border-slate-200 bg-[#10263C] text-[10px] uppercase text-white"><tr>
        {columns.map((column, index) => <th key={column.id} draggable tabIndex={0} data-column={column.id} title="Arrastra para cambiar el orden; también puedes usar las flechas izquierda y derecha" aria-label={`${column.label}. Columna ${index + 1} de ${columns.length}. Arrastra o usa las flechas para moverla.`} onDragStart={(event) => { setDraggedId(column.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", column.id); }} onDragOver={(event) => { event.preventDefault(); setOverId(column.id); }} onDragLeave={() => setOverId(null)} onDrop={(event) => { event.preventDefault(); const sourceId = draggedId || event.dataTransfer.getData("text/plain"); onMoveColumn(sourceId, column.id); setDraggedId(null); setOverId(null); }} onDragEnd={() => { setDraggedId(null); setOverId(null); }} onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; const target = columns[index + (event.key === "ArrowLeft" ? -1 : 1)]; if (!target) return; event.preventDefault(); onMoveColumn(column.id, target.id); }} className={`cursor-grab select-none px-2 py-2 font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${overId === column.id && draggedId !== column.id ? "bg-[#315875]" : ""} ${draggedId === column.id ? "opacity-60" : ""}`}><span className="inline-flex items-center gap-1 whitespace-nowrap"><span aria-hidden="true" className="text-slate-300">⠿</span>{column.label}</span></th>)}
      </tr></thead>
      <tbody className="divide-y divide-slate-100">
        {cases.map((item) => <tr key={item.id} className="hover:bg-slate-50">
          {columns.map((column) => <td key={column.id} data-column={column.id} className={column.cellClass ?? textCell}>{column.render(item)}</td>)}
        </tr>)}
        {cases.length === 0 && <tr><td colSpan={columns.length} className="px-3 py-8 text-center text-xs text-slate-500">No hay casos en esta vista.</td></tr>}
      </tbody>
    </table>
  </div>;
}
