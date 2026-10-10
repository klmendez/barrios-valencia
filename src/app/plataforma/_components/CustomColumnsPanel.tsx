"use client";

import { useState, type FormEvent } from "react";
import type { CustomCaseField } from "@/lib/platform-types";

type Props = {
  fields: CustomCaseField[];
  usage: (id: string) => number;
  onAddField: (name: string, type: CustomCaseField["type"], options: string[]) => void;
  onAddOption: (id: string, option: string) => void;
  onDeleteField: (id: string) => void;
};

const typeLabels: Record<CustomCaseField["type"], string> = {
  text: "Texto", number: "Número", date: "Fecha", select: "Lista de opciones",
};

export function CustomColumnsPanel({ fields, usage, onAddField, onAddOption, onDeleteField }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CustomCaseField["type"]>("text");
  const [optionsText, setOptionsText] = useState("");
  const [optionDrafts, setOptionDrafts] = useState<Record<string, string>>({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const duplicate = fields.some((field) => field.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase());

  const addField = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || duplicate) return;
    const options = type === "select" ? [...new Set(optionsText.split(/[,\n]/).map((value) => value.trim()).filter(Boolean))] : [];
    onAddField(name.trim(), type, options);
    setName("");
    setOptionsText("");
  };

  return <div>
    <p className="mb-3 text-[11px] text-slate-500">Estas columnas aparecen en la lista y en cada expediente. Las opciones de una lista se comparten con todo el equipo.</p>
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {fields.map((field) => <section key={field.id} className="py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs"><div className="min-w-0"><h3 className="break-words font-semibold text-slate-800">{field.name}</h3><p className="mt-0.5 text-[10px] text-slate-500">{typeLabels[field.type]} · {usage(field.id)} expedientes con valor</p></div><button type="button" onClick={() => setPendingDeleteId(field.id)} className="px-2 py-1 text-[11px] text-red-700 hover:bg-red-50">Eliminar columna</button></div>
        {pendingDeleteId === field.id && <div className="mt-2 flex flex-wrap items-center gap-2 border-l-2 border-red-500 bg-red-50 px-3 py-2 text-[11px] text-red-900"><span className="flex-1">Se quitará la columna y sus valores de los casos activos. Los cambios quedarán en Actividad.</span><button type="button" onClick={() => setPendingDeleteId(null)} className="border border-red-200 px-2 py-1">Cancelar</button><button type="button" onClick={() => { onDeleteField(field.id); setPendingDeleteId(null); }} className="bg-red-700 px-2 py-1 text-white">Eliminar</button></div>}
        {field.type === "select" && <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {field.options.map((option) => <span key={option} className="border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700">{option}</span>)}
          <form onSubmit={(event) => { event.preventDefault(); const value = (optionDrafts[field.id] ?? "").trim(); if (!value || field.options.some((option) => option.toLocaleLowerCase() === value.toLocaleLowerCase())) return; onAddOption(field.id, value); setOptionDrafts((current) => ({ ...current, [field.id]: "" })); }} className="flex max-w-full flex-wrap items-center gap-1.5">
            <input value={optionDrafts[field.id] ?? ""} onChange={(event) => setOptionDrafts((current) => ({ ...current, [field.id]: event.target.value }))} aria-label={`Nueva opción para ${field.name}`} placeholder="Nueva opción" className="h-7 min-w-0 flex-1 border border-slate-300 px-2 text-[11px] sm:w-36 sm:flex-none" />
            <button type="submit" disabled={!(optionDrafts[field.id] ?? "").trim()} className="h-7 border border-slate-300 px-2 text-[11px] text-[#10263C] disabled:opacity-40">Agregar opción</button>
          </form>
        </div>}
      </section>)}
      {!fields.length && <p className="py-4 text-xs text-slate-500">Todavía no hay columnas personalizadas.</p>}
    </div>
    <form onSubmit={addField} className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px_auto]">
      <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Nombre de la nueva columna" placeholder="Nombre de la columna" maxLength={60} className="h-8 min-w-0 border border-slate-300 px-2 text-xs" />
      <select value={type} onChange={(event) => setType(event.target.value as CustomCaseField["type"])} aria-label="Tipo de columna" className="h-8 border border-slate-300 bg-white px-2 text-xs">{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <button type="submit" disabled={!name.trim() || duplicate} className="h-8 bg-[#10263C] px-3 text-xs text-white disabled:opacity-40">Agregar columna</button>
      {type === "select" && <label className="text-[11px] text-slate-500 sm:col-span-3">Opciones iniciales, separadas por coma<input value={optionsText} onChange={(event) => setOptionsText(event.target.value)} placeholder="Ej. Sí, No, Pendiente" className="mt-1 h-8 w-full border border-slate-300 px-2 text-xs" /></label>}
      {duplicate && <p className="text-[11px] text-amber-700 sm:col-span-3">Ya existe una columna con ese nombre.</p>}
    </form>
  </div>;
}
