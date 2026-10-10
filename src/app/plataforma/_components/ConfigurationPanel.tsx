"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import type { CustomCaseField } from "@/lib/platform-types";
import { CustomColumnsPanel } from "./CustomColumnsPanel";

type Tab = "Estados" | "Tipos" | "Contrapartes" | "Documentos" | "Columnas" | "Equipo";
type CaseClassification = { status: string; type: string; counterparty: string; customValues?: Record<string, string> };
type DocumentClassification = { category: string };

type Props = {
  cases: CaseClassification[];
  documents: DocumentClassification[];
  statuses: string[];
  statusColors: Record<string, string>;
  processTypes: string[];
  counterparties: string[];
  documentCategories: string[];
  caseFields: CustomCaseField[];
  activeUser: string;
  setActiveUser: (user: string) => void;
  onStatusColorChange: (status: string, color: string) => void;
  onAddStatus: (name: string, color: string) => void;
  onAddType: (name: string) => void;
  onAddCounterparty: (name: string) => void;
  onAddDocumentCategory: (name: string) => void;
  onAddCaseField: (name: string, type: CustomCaseField["type"], options: string[]) => void;
  onAddCaseFieldOption: (id: string, option: string) => void;
  onDeleteCaseField: (id: string) => void;
  onDownloadBackup: () => void;
  isCloud?: boolean;
};

export function ConfigurationPanel(props: Props) {
  const [tab, setTab] = useState<Tab>("Estados");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [draftColor, setDraftColor] = useState("#dbeafe");
  const lists: Record<Exclude<Tab, "Equipo" | "Columnas">, string[]> = {
    Estados: props.statuses,
    Tipos: props.processTypes,
    Contrapartes: props.counterparties,
    Documentos: props.documentCategories,
  };
  const tabs: { name: Tab; count: number }[] = [
    { name: "Estados", count: props.statuses.length },
    { name: "Tipos", count: props.processTypes.length },
    { name: "Contrapartes", count: props.counterparties.length },
    { name: "Documentos", count: props.documentCategories.length },
    { name: "Columnas", count: props.caseFields.length },
    { name: "Equipo", count: 2 },
  ];
  const values = tab === "Equipo" || tab === "Columnas" ? [] : lists[tab].filter((value) => value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  const usage = (value: string) => tab === "Documentos" ? props.documents.filter((item) => item.category === value).length : props.cases.filter((item) => tab === "Estados" ? item.status === value : tab === "Tipos" ? item.type === value : item.counterparty === value).length;
  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value || tab === "Equipo" || tab === "Columnas" || lists[tab].some((item) => item.toLocaleLowerCase() === value.toLocaleLowerCase())) return;
    if (tab === "Estados") props.onAddStatus(value, draftColor);
    if (tab === "Tipos") props.onAddType(value);
    if (tab === "Contrapartes") props.onAddCounterparty(value);
    if (tab === "Documentos") props.onAddDocumentCategory(value);
    setDraft("");
  };

  return <div className="grid border-t border-slate-200 lg:grid-cols-[170px_minmax(0,1fr)]">
    <nav aria-label="Secciones de configuración" className="flex overflow-x-auto border-b border-slate-200 lg:block lg:border-b-0 lg:border-r">
      {tabs.map(({ name, count }) => <button key={name} type="button" onClick={() => { setTab(name); setSearch(""); setDraft(""); }} aria-current={tab === name ? "page" : undefined} className={cn("flex min-w-fit items-center justify-between gap-3 border-b-2 px-3 py-2 text-left text-xs lg:w-full lg:border-b-0 lg:border-l-2", tab === name ? "border-[#315875] bg-[#edf2f5] font-semibold text-[#10263C]" : "border-transparent text-slate-600 hover:bg-slate-50")}>{name}<span className="font-normal tabular-nums text-slate-400">{count}</span></button>)}
    </nav>
    <section className="min-w-0 px-0 py-3 lg:px-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2"><div><h2 className="text-sm font-semibold text-slate-900">{tab === "Documentos" ? "Categorías de documentos" : tab === "Columnas" ? "Columnas de casos" : tab}</h2><p className="text-[10px] text-slate-500">{tab === "Equipo" ? "Consulta el usuario activo." : tab === "Columnas" ? "Agrega datos propios a la tabla de casos y define sus opciones." : tab === "Documentos" ? "Clasifica los enlaces de documentos de los expedientes." : "Los cambios de este catálogo se reflejan en los expedientes."}</p></div>{tab !== "Equipo" && tab !== "Columnas" && <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label={`Buscar en ${tab}`} placeholder="Buscar en catálogo" className="h-8 w-44 border border-slate-300 px-2 text-xs" />}</div>
      {tab === "Columnas" ? <div className="pt-3"><CustomColumnsPanel fields={props.caseFields} usage={(id) => props.cases.filter((item) => Boolean(item.customValues?.[id])).length} onAddField={props.onAddCaseField} onAddOption={props.onAddCaseFieldOption} onDeleteField={props.onDeleteCaseField} /></div> : tab === "Equipo" ? <div className="divide-y divide-slate-100">{["Juan Valencia", "Luis Hernando Barrios"].map((user) => <label key={user} className="flex items-center justify-between py-3 text-xs text-slate-800"><span>{user}</span><span className="flex items-center gap-2 text-[11px] text-slate-500">{props.activeUser === user ? "Activo" : props.isCloud ? "Sin esta sesión" : "Seleccionar"}{!props.isCloud && <input type="radio" name="active-user" checked={props.activeUser === user} onChange={() => props.setActiveUser(user)} />}</span></label>)}<div className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs"><span className="text-slate-600">{props.isCloud ? "Datos compartidos en Supabase." : "Los datos actuales se guardan en este navegador."}</span><button type="button" onClick={props.onDownloadBackup} className="border border-slate-300 px-2.5 py-1.5 font-medium text-[#10263C]">Descargar copia JSON</button></div></div> : <>
        <div className="divide-y divide-slate-100">{values.map((value) => <div key={value} className="grid grid-cols-[minmax(0,1fr)_80px] items-center gap-2 py-2 text-xs sm:grid-cols-[minmax(0,1fr)_100px_90px]"><span className="flex min-w-0 items-center gap-2 text-slate-800">{tab === "Estados" && <input type="color" aria-label={`Color de ${value}`} value={props.statusColors[value] ?? "#e2e8f0"} onChange={(event) => props.onStatusColorChange(value, event.target.value)} className="h-6 w-7 shrink-0 cursor-pointer border-0 bg-transparent p-0" />}<span className="truncate" title={value}>{value}</span></span><span className="hidden text-right tabular-nums text-slate-500 sm:block">{usage(value)} {tab === "Documentos" ? "documentos" : "casos"}</span><span className="text-right text-[10px] text-slate-400">{tab === "Estados" ? "Color editable" : "Catálogo"}</span></div>)}{!values.length && <p className="py-4 text-xs text-slate-500">No hay resultados para esta búsqueda.</p>}</div>
        <form onSubmit={add} className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label={`Agregar a ${tab}`} placeholder={tab === "Estados" ? "Nuevo estado" : tab === "Tipos" ? "Nuevo tipo de proceso" : tab === "Contrapartes" ? "Nueva contraparte" : "Nueva categoría"} className="h-8 min-w-[160px] flex-1 border border-slate-300 px-2 text-xs" />{tab === "Estados" && <input type="color" value={draftColor} onChange={(event) => setDraftColor(event.target.value)} aria-label="Color del nuevo estado" className="h-8 w-9 border border-slate-300 p-1" />}<button type="submit" disabled={!draft.trim()} className="h-8 bg-[#10263C] px-3 text-xs text-white disabled:opacity-40">Agregar</button></form>
      </>}
    </section>
  </div>;
}
