"use client";

import Link from "next/link";
import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { amountValue, summarizeCaseFinance } from "@/lib/platform-analytics";
import { caseHasEventOnDate, caseMatchesOwner, caseMatchesQuery } from "@/lib/platform-filters";
import { type CalendarAlertRecord, type CaseAnnotation, type CaseHistoryEntry, type CaseRecord, type CustomCaseField, type DeletedCaseRecord, type DocumentRecord, type PaymentRecord, type PlatformSnapshot, type TaskRecord } from "@/lib/platform-types";
import { moveCaseColumn, resolveCaseColumnOrder } from "@/lib/platform-case-columns";
import { archiveDeletedCase, caseActivity } from "@/lib/platform-case-deletion";
import { initialCounterparties, initialDocumentCategories, initialPlatformSnapshot, initialProcessTypes, initialStatusColors, initialStatuses } from "@/lib/platform-defaults";
import { readPlatformSnapshot } from "@/lib/platform-storage";
import { ConfigurationPanel } from "./ConfigurationPanel";
import { CaseListTable } from "./CaseListTable";
import { CustomCaseInput } from "./CustomCaseInput";
import { DistributionPie } from "./DistributionPie";
import { type CaseDraft, type CaseUpdateField, explanationForCaseDraft, extractCaseDraft, fieldQuestions, isBulkCaseRequest, isClarificationRequest, isCreateCaseRequest, isFullPaymentMessage, isUpdateCaseRequest, nextMissingCaseField, normalizeAssistantText, parseCaseUpdate, questionForCaseDraft } from "@/lib/guided-assistant";

type SectionId =
  | "inicio"
  | "clientes"
  | "casos"
  | "tareas"
  | "calendario"
  | "documentos"
  | "pagos"
  | "estadisticas"
  | "actividad"
  | "configuracion";

type AssistantUpdateDraft = { caseId?: string; field?: CaseUpdateField; value?: string; paymentIntent?: boolean };
const assistantUpdateLabels: Record<CaseUpdateField, string> = { status: "Estado", owner: "Responsable", phone: "Celular", email: "Correo", counterparty: "Contraparte", type: "Tipo de proceso", note: "Nota" };

const commonTaskTitles = ["Presentar demanda", "Preparar demanda", "Revisar expediente", "Solicitar documentos", "Radicar recurso", "Verificar respuesta", "Preparar audiencia", "Contactar al cliente"];
const seededDemoCaseIds = new Set(["BV-001", "BV-002", "BV-003", "BV-004", "BV-005"]);
const formatCOP = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const localDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const iconPaths: Record<SectionId | "menu" | "close" | "chevron" | "chat", string> = {
  inicio: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z",
  clientes: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  casos: "M10 6h4l2 2h5v13H3V6h7ZM3 11h18",
  tareas: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  calendario: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v15H3V6a2 2 0 0 1 2-2Z",
  documentos: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h8M8 9h2",
  pagos: "M3 6h18v12H3V6ZM3 10h18M7 15h4",
  estadisticas: "M4 19V5M4 19h17M8 16v-5M13 16V8M18 16v-9",
  actividad: "M22 12h-4l-3 7-6-14-3 7H2",
  configuracion: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82V22a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8.6 20a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.6 4a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82V2a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15.4 4a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20 8.6a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1.82.33H22a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 20 15.4Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  chat: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z",
  close: "M18 6 6 18M6 6l12 12",
  chevron: "M9 18l6-6-6-6",
};

function Icon({ name, className }: { name: keyof typeof iconPaths; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

const menuItems: { id: SectionId; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "casos", label: "Casos" },
  { id: "tareas", label: "Tareas" },
  { id: "calendario", label: "Calendario" },
  { id: "documentos", label: "Documentos" },
  { id: "pagos", label: "Pagos" },
  { id: "estadisticas", label: "Estadisticas" },
  { id: "actividad", label: "Actividad" },
  { id: "configuracion", label: "Configuracion" },
];

const copy: Record<SectionId, { eyebrow: string; title: string; description: string; action: string }> = {
  inicio: { eyebrow: "Panel general", title: "Inicio", description: "Resumen operativo de vencimientos, alertas, casos activos y movimiento del equipo.", action: "Nueva alerta" },
  clientes: { eyebrow: "Directorio", title: "Clientes", description: "Personas registradas, contacto, documentos base y expedientes asociados.", action: "Nuevo cliente" },
  casos: { eyebrow: "Expedientes", title: "Casos", description: "Procesos juridicos con responsable, contraparte, estado, vencimiento y honorarios.", action: "Nuevo caso" },
  tareas: { eyebrow: "Trabajo pendiente", title: "Tareas", description: "Pendientes asignados por usuario, prioridad, caso relacionado y fecha limite.", action: "Nueva tarea" },
  calendario: { eyebrow: "Agenda juridica", title: "Calendario", description: "Audiencias, vencimientos, llamadas y revisiones programadas.", action: "Nuevo evento" },
  documentos: { eyebrow: "Drive y expediente", title: "Documentos", description: "Carpetas, archivos individuales, categorias y usuario que agrego cada documento.", action: "Agregar enlace" },
  pagos: { eyebrow: "Honorarios", title: "Pagos", description: "Honorarios pactados, abonos registrados, saldos y casos pendientes de pago.", action: "Registrar pago" },
  estadisticas: { eyebrow: "Indicadores", title: "Estadisticas", description: "Casos, honorarios y recaudo por tipo, contraparte, estado y responsable.", action: "Exportar informe" },
  actividad: { eyebrow: "Auditoria", title: "Actividad", description: "Historial ineditable de cambios con usuario, fecha, accion y valores modificados.", action: "Filtrar historial" },
  configuracion: { eyebrow: "Administracion", title: "Configuracion", description: "Catálogos de expedientes y documentos, colores de estado y usuario activo.", action: "Crear categoria" },
};

export function PlatformWorkspace({ cloudSnapshot, onCloudSave, signedInUser, onSignOut }: { cloudSnapshot?: PlatformSnapshot; onCloudSave?: (snapshot: PlatformSnapshot) => void; signedInUser?: string; onSignOut?: () => void }) {
  const [activeSection, setActiveSection] = useState<SectionId>("casos");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [caseStatusFilter, setCaseStatusFilter] = useState("");
  const [homeDrilldownScope, setHomeDrilldownScope] = useState<string | null>(null);
  const [caseRecords, setCaseRecords] = useState<CaseRecord[]>(cloudSnapshot?.cases ?? []);
  const [caseFields, setCaseFields] = useState<CustomCaseField[]>(cloudSnapshot?.caseFields ?? []);
  const [caseColumnOrder, setCaseColumnOrder] = useState<string[]>(cloudSnapshot?.caseColumnOrder ?? []);
  const [deletedCases, setDeletedCases] = useState<DeletedCaseRecord[]>(cloudSnapshot?.deletedCases ?? []);
  const [statuses, setStatuses] = useState(cloudSnapshot?.statuses ?? initialStatuses);
  const [processTypes, setProcessTypes] = useState(cloudSnapshot?.processTypes ?? initialProcessTypes);
  const [statusColors, setStatusColors] = useState(cloudSnapshot?.statusColors ?? initialStatusColors);
  const [tasks, setTasks] = useState<TaskRecord[]>(cloudSnapshot?.tasks ?? []);
  const [alerts, setAlerts] = useState<CalendarAlertRecord[]>(cloudSnapshot?.alerts ?? []);
  const [payments, setPayments] = useState<PaymentRecord[]>(cloudSnapshot?.payments ?? []);
  const [documents, setDocuments] = useState<DocumentRecord[]>(cloudSnapshot?.documents ?? []);
  const [documentForm, setDocumentForm] = useState({ name: "", category: "Historia laboral", url: "" });
  const [counterparties, setCounterparties] = useState(cloudSnapshot?.counterparties ?? initialCounterparties);
  const [documentCategories, setDocumentCategories] = useState(cloudSnapshot?.documentCategories ?? initialDocumentCategories);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ caseId: "", amount: "", date: localDateKey(new Date()), note: "" });
  const [calendarMonth, setCalendarMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(localDateKey(new Date()));
  const [storageReady, setStorageReady] = useState(Boolean(cloudSnapshot));
  const [storageError, setStorageError] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const deepLinkHandledRef = useRef(false);
  const [deleteCaseId, setDeleteCaseId] = useState<string | null>(null);
  const [caseTab, setCaseTab] = useState("Propiedades");
  const [caseView, setCaseView] = useState("Lista");
  const [showNewCase, setShowNewCase] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showCalendarAlert, setShowCalendarAlert] = useState(false);
  const [calendarAlertDraft, setCalendarAlertDraft] = useState({ caseId: "", title: "", owner: "" });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantCaseDraft, setAssistantCaseDraft] = useState<CaseDraft | null>(null);
  const [assistantUpdateDraft, setAssistantUpdateDraft] = useState<AssistantUpdateDraft | null>(null);
  const [assistantPaymentDraft, setAssistantPaymentDraft] = useState<{ caseId: string; date: string } | null>(null);
  const [assistantMessages, setAssistantMessages] = useState<{ role: "user" | "assistant"; text: string; caseIds?: string[]; action?: "task" | "deadlines" | "select-update" }[]>([]);
  const fixedCaseScrollRef = useRef<HTMLDivElement>(null);
  const assistantEndRef = useRef<HTMLFormElement>(null);
  const [caseTableWidth, setCaseTableWidth] = useState(1450);
  const [newNote, setNewNote] = useState("");
  const [newNoteDate, setNewNoteDate] = useState(localDateKey(new Date()));
  const [newNoteReminderDate, setNewNoteReminderDate] = useState("");
  const [newNoteReference, setNewNoteReference] = useState("");
  const [driveInput, setDriveInput] = useState("");
  const [addStatusOpen, setAddStatusOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState("");
  const [statusDraftColor, setStatusDraftColor] = useState("#dbeafe");
  const [activeUser, setActiveUser] = useState(signedInUser ?? "Luis Hernando Barrios");
  const [processTypeDraft, setProcessTypeDraft] = useState("");
  const [newCase, setNewCase] = useState({ client: "", nationalId: "", phone: "", email: "", relativeName: "", relativePhone: "", relativeRelationship: "", counterparty: "Colpensiones", type: "Indemnizacion sustitutiva", status: "Prospecto", owner: "Juan Valencia" });
  const [newCaseCustomValues, setNewCaseCustomValues] = useState<Record<string, string>>({});
  const [newTask, setNewTask] = useState({ title: "", caseId: "", owner: "Juan Valencia", priority: "Media" as TaskRecord["priority"], dueDate: "" });

  /* eslint-disable react-hooks/set-state-in-effect -- Restore browser-only storage after the first client render. */
  useEffect(() => {
    if (cloudSnapshot) return;
    try {
      const saved = window.localStorage.getItem("bv-platform-cases-v1");
      if (saved) {
        const parsed = readPlatformSnapshot(JSON.parse(saved), initialPlatformSnapshot);
        if (parsed.cases) setCaseRecords(parsed.cases.filter((item) => !seededDemoCaseIds.has(item.id)));
        setCaseFields(parsed.caseFields);
        setCaseColumnOrder(parsed.caseColumnOrder);
        setDeletedCases(parsed.deletedCases);
        if (parsed.statuses?.length) setStatuses(parsed.statuses);
        if (parsed.statusColors) setStatusColors({ ...initialStatusColors, ...parsed.statusColors });
        if (parsed.tasks) setTasks(parsed.tasks.filter((item) => !seededDemoCaseIds.has(item.caseId)));
        if (parsed.alerts) setAlerts(parsed.alerts.filter((item) => !seededDemoCaseIds.has(item.caseId)));
        if (parsed.processTypes?.length) setProcessTypes(parsed.processTypes);
        if (parsed.payments) setPayments(parsed.payments.filter((item) => !seededDemoCaseIds.has(item.caseId)));
        if (parsed.documents) setDocuments(parsed.documents.filter((item) => !seededDemoCaseIds.has(item.caseId)));
        if (parsed.counterparties?.length) setCounterparties(parsed.counterparties);
        if (parsed.documentCategories?.length) setDocumentCategories(parsed.documentCategories);
      }
    } catch {
      setStorageError("No se pudieron leer los datos guardados. No se sobrescribirá la copia de este navegador.");
      return;
    }
    setStorageReady(true);
  }, [cloudSnapshot]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect -- Report failures from the browser storage write. */
  useEffect(() => {
    if (!storageReady) return;
    const snapshot: PlatformSnapshot = { cases: caseRecords, caseFields, caseColumnOrder, deletedCases, statuses, statusColors, tasks, alerts, processTypes, payments, documents, counterparties, documentCategories };
    if (cloudSnapshot) {
      onCloudSave?.(snapshot);
      return;
    }
    try {
      window.localStorage.setItem("bv-platform-cases-v1", JSON.stringify(snapshot));
      setStorageError("");
    } catch {
      setStorageError("No se pudieron guardar los cambios en este navegador. Descarga una copia de seguridad antes de cerrar la página.");
    }
  }, [caseRecords, caseFields, caseColumnOrder, deletedCases, statuses, statusColors, tasks, alerts, processTypes, payments, documents, counterparties, documentCategories, storageReady, cloudSnapshot, onCloudSave]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect -- Open a linked case after the saved cases are available. */
  useEffect(() => {
    if (!storageReady || deepLinkHandledRef.current) return;
    deepLinkHandledRef.current = true;
    const caseId = new URLSearchParams(window.location.search).get("caso");
    if (caseId && caseRecords.some((item) => item.id === caseId)) {
      setSelectedCaseId(caseId);
      setCaseTab("Propiedades");
    }
  }, [storageReady, caseRecords]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const active = copy[activeSection];
  const selectedCase = caseRecords.find((item) => item.id === selectedCaseId) ?? null;
  const casePendingDeletion = caseRecords.find((item) => item.id === deleteCaseId) ?? null;
  const resolvedCaseColumnOrder = resolveCaseColumnOrder(caseColumnOrder, caseFields.map((field) => field.id));
  const assistantUpdateCase = caseRecords.find((item) => item.id === assistantUpdateDraft?.caseId) ?? null;
  const assistantPaymentCase = caseRecords.find((item) => item.id === assistantPaymentDraft?.caseId) ?? null;
  const assistantPaymentBalance = assistantPaymentCase ? Math.max(0, amountValue(assistantPaymentCase.fees) - amountValue(assistantPaymentCase.paid)) : 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = (date: string) => date ? Math.ceil((new Date(`${date}T00:00:00`).getTime() - today.getTime()) / 86400000) : null;
  const isDueSoon = (item: CaseRecord) => {
    const days = daysUntil(item.dueDate);
    return days !== null && days >= 0 && days <= 7;
  };
  const isAlertDueSoon = (item: CaseRecord) => {
    const alertDays = daysUntil(item.alertDate);
    const annotationDays = (item.annotations ?? []).map((annotation) => daysUntil(annotation.reminderDate ?? "")).filter((value): value is number => value !== null);
    return (alertDays !== null && alertDays >= 0 && alertDays <= 7) || annotationDays.some((days) => days >= 0 && days <= 7);
  };
  const todayKey = localDateKey(today);
  const hasReminderToday = (item: CaseRecord) => (item.annotations ?? []).some((annotation) => annotation.reminderDate === todayKey);
  const matchesOwner = (item: CaseRecord, value: string) => caseMatchesOwner(item, value);
  const matchesCaseQuery = (item: CaseRecord) => caseMatchesQuery(item, query);
  const hasCaseEventToday = (item: CaseRecord) => caseHasEventOnDate(item, payments, todayKey);
  const matchesOwnerFilter = (item: CaseRecord) => !["Juan", "Luis"].includes(filter) || matchesOwner(item, filter);
  const scopedCases = caseRecords.filter((item) => matchesCaseQuery(item) && matchesOwnerFilter(item) && (filter !== "Hoy" || hasCaseEventToday(item)));
  const homeMetrics = [
    { label: "Requieren atención", filter: "Inicio: atención", count: scopedCases.filter((item) => item.status !== "Cerrado" && (item.alert !== "Sin alerta" || !item.owners.length)).length },
    { label: "Plazos / alertas próximos", filter: "Inicio: vencimiento", count: scopedCases.filter((item) => item.status !== "Cerrado" && (isDueSoon(item) || isAlertDueSoon(item))).length },
    { label: "Esperando respuesta", filter: "Inicio: respuesta", count: scopedCases.filter((item) => item.status.toLocaleLowerCase().includes("esperando respuesta")).length },
    { label: "Recordatorios de hoy", filter: "Inicio: recordatorio", count: scopedCases.filter(hasReminderToday).length },
  ];
  const displayHomeCases = caseRecords.filter((item) => item.status !== "Cerrado" && (item.alert !== "Sin alerta" || isDueSoon(item) || isAlertDueSoon(item) || !item.owners.length || hasReminderToday(item))).filter((item) => matchesCaseQuery(item) && (filter === "Todos" || matchesOwner(item, filter) || (filter === "Hoy" && hasCaseEventToday(item)))).slice(0, 8);
  const visibleCases = caseRecords.filter((item) => {
    const matchesView = ["Lista", "Tablero", "Estadisticas"].includes(caseView) || (caseView === "Prospectos" && item.status === "Prospecto") || (caseView === "Cerrados" && item.status === "Cerrado") || (caseView === "Pagados" && amountValue(item.fees) > 0 && amountValue(item.paid) >= amountValue(item.fees));
    const matchesFilter = filter === "Todos" || item.owners.some((owner) => owner.startsWith(filter)) || item.status.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) || (filter === "Inicio: atención" && item.status !== "Cerrado" && (item.alert !== "Sin alerta" || !item.owners.length)) || (filter === "Inicio: vencimiento" && item.status !== "Cerrado" && isDueSoon(item)) || (filter === "Inicio: respuesta" && item.status.toLocaleLowerCase().includes("esperando respuesta")) || (filter === "Inicio: actividad" && item.status !== "Cerrado" && !item.history.length);
    const reminderMatch = filter === "Inicio: recordatorio" && hasReminderToday(item);
    const deadlineMatch = filter === "Inicio: vencimiento" && isAlertDueSoon(item);
    const matchesHomeScope = !homeDrilldownScope || (homeDrilldownScope === "Hoy" ? hasCaseEventToday(item) : matchesOwner(item, homeDrilldownScope));
    return matchesCaseQuery(item) && matchesView && matchesHomeScope && (matchesFilter || reminderMatch || deadlineMatch) && (!caseStatusFilter || item.status === caseStatusFilter);
  });
  const availableCaseStatuses = [...new Set([...statuses, ...caseRecords.map((item) => item.status)])].filter(Boolean);
  const visibleCaseTypes = [...new Set(visibleCases.map((item) => item.type.trim() || "Sin tipo"))].map((type) => ({ type, count: visibleCases.filter((item) => (item.type.trim() || "Sin tipo") === type).length })).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type, "es"));
  const clients = scopedCases.filter((item) => filter !== "Activo" || item.status !== "Cerrado").filter((item, index, all) => all.findIndex((candidate) => (candidate.nationalId || candidate.client).toLocaleLowerCase() === (item.nationalId || item.client).toLocaleLowerCase()) === index);
  const documentCases = caseRecords.filter((item) => (matchesCaseQuery(item) || documents.some((document) => document.caseId === item.id && `${document.name} ${document.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))) && matchesOwnerFilter(item) && (filter !== "Sin documentos" || !item.driveUrl && !documents.some((document) => document.caseId === item.id)));
  const paymentCases = scopedCases.filter((item) => filter === "Pendientes" ? amountValue(item.fees) > amountValue(item.paid) : filter === "Pagados" ? amountValue(item.fees) > 0 && amountValue(item.paid) >= amountValue(item.fees) : filter === "Sin honorarios" ? amountValue(item.fees) === 0 : true);
  const statisticsCases = scopedCases.filter((item) => filter !== "Hoy" || hasCaseEventToday(item));
  const statistics = (() => {
    const open = statisticsCases.filter((item) => item.status !== "Cerrado");
    const paid = statisticsCases.reduce((sum, item) => sum + amountValue(item.paid), 0);
    const fees = statisticsCases.reduce((sum, item) => sum + amountValue(item.fees), 0);
    const statusCounts = [...new Set([...statuses, ...statisticsCases.map((item) => item.status)])].map((status) => ({ status, count: statisticsCases.filter((item) => item.status === status).length, color: statusColors[status] ?? "#cbd5e1" })).filter((item) => item.count > 0);
    const typeFinance = summarizeCaseFinance(statisticsCases, payments, "type");
    const counterpartyFinance = summarizeCaseFinance(statisticsCases, payments, "counterparty");
    const owners = ["Juan Valencia", "Luis Hernando Barrios"].map((owner) => ({ owner, count: open.filter((item) => item.owners.includes(owner)).length }));
    const finance = statisticsCases.filter((item) => amountValue(item.fees) > 0 || amountValue(item.paid) > 0).map((item) => ({ id: item.id, name: item.client, type: item.type, fees: amountValue(item.fees), paid: amountValue(item.paid) })).sort((a, b) => b.paid - a.paid);
    const gradient = statusCounts.map((item, index) => {
      const start = statusCounts.slice(0, index).reduce((sum, previous) => sum + (statisticsCases.length ? previous.count / statisticsCases.length * 100 : 0), 0);
      const end = start + (statisticsCases.length ? item.count / statisticsCases.length * 100 : 0);
      return `${item.color} ${start}% ${end}%`;
    }).join(", ");
    return { open: open.length, paid, fees, statusCounts, typeFinance, counterpartyFinance, owners, finance, gradient };
  })();
  const visibleTasks = tasks.filter((task) => {
    const linkedCase = caseRecords.find((item) => item.id === task.caseId);
    const matchesQuery = `${task.title} ${task.owner} ${linkedCase?.client ?? ""} ${linkedCase?.type ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase());
    const matchesFilter = filter === "Todos" || task.owner.startsWith(filter) || (filter === "Hoy" && task.dueDate === todayKey);
    return matchesQuery && matchesFilter;
  });
  const taskTitleOptions = [...new Set([...commonTaskTitles, ...tasks.map((task) => task.title)].filter(Boolean))];
  const findAssistantUpdateCases = (message: string) => {
    const normalized = normalizeAssistantText(message);
    const exact = caseRecords.filter((item) => normalized.includes(normalizeAssistantText(item.id)) || normalized.includes(normalizeAssistantText(item.client)) || Boolean(item.nationalId && normalized.includes(normalizeAssistantText(item.nationalId))));
    if (exact.length) return exact.slice(0, 6);
    const withoutValues = [...statuses, ...processTypes, ...counterparties].reduce((value, option) => value.replace(normalizeAssistantText(option), " "), normalized);
    const words = withoutValues.replace(/\b(actualizar|actualiza|acutalizar|acutaliza|actulizar|actuliza|editar|edita|modificar|modifica|cambiar|cambia|asignar|asigna|el|la|los|las|un|una|caso|casos|expediente|expedientes|de|del|para|quiero|necesito|estado|responsable|celular|telefono|correo|email|tipo|proceso|contraparte|entidad|nota|anotacion|juan|luis)\b/g, " ").split(/\s+/).filter((word) => word.length >= 3 && !/^\d+$/.test(word));
    return words.length ? caseRecords.filter((item) => {
      const haystack = normalizeAssistantText(`${item.id} ${item.client} ${item.nationalId ?? ""}`);
      return words.every((word) => haystack.includes(word));
    }).slice(0, 6) : [];
  };
  const prepareAssistantFullPayment = (item: CaseRecord) => {
    const fees = amountValue(item.fees);
    const balance = Math.max(0, fees - amountValue(item.paid));
    if (!fees) {
      setAssistantMessages((current) => [...current, { role: "assistant", text: `No puedo calcular el pago total de ${item.client} porque aún no tiene honorarios acordados. Abre su expediente y registra ese valor primero.`, caseIds: [item.id] }]);
      return;
    }
    if (!balance) {
      setAssistantUpdateDraft(null);
      setAssistantMessages((current) => [...current, { role: "assistant", text: `${item.client} ya figura con los honorarios totalmente pagados. No registré otro pago.`, caseIds: [item.id] }]);
      return;
    }
    setAssistantUpdateDraft(null);
    setAssistantPaymentDraft({ caseId: item.id, date: localDateKey(new Date()) });
    setAssistantMessages((current) => [...current, { role: "assistant", text: `El saldo pendiente de ${item.client} es ${formatCOP(balance)}. Revisa el importe y la fecha antes de confirmar el pago total.` }]);
  };
  const sendAssistantMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = assistantQuery.trim();
    if (!text) return;
    const normalized = normalizeAssistantText(text);
    const createRequest = isCreateCaseRequest(text);
    const updateRequest = isUpdateCaseRequest(text);
    const bulkRequest = createRequest && isBulkCaseRequest(text);
    const taskRequest = /\b(tarea|demanda|radicar|presentar)\b/.test(normalized);
    const deadlineRequest = /\b(plazo|alerta|vencimiento|vence|vencen)\b/.test(normalized);
    const search = normalized.replace(/\b(busca|buscar|encuentra|muestra|mostrar|caso|casos|expediente|expedientes|de|del|la|el|los|las)\b/g, " ").trim();
    const searchWords = search.split(/\s+/).filter((word) => word.length >= 2);
    const matches = searchWords.length ? caseRecords.filter((item) => {
      const haystack = normalizeAssistantText(`${item.client} ${item.nationalId ?? ""} ${item.type} ${item.counterparty} ${item.status} ${item.id}`);
      return searchWords.every((word) => haystack.includes(word));
    }).slice(0, 5) : [];
    setAssistantMessages((current) => [...current, { role: "user", text }]);
    setAssistantQuery("");
    if (assistantCaseDraft && /\b(cancelar|cancela|olvidalo|descartar)\b/.test(normalized)) {
      setAssistantCaseDraft(null);
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Cancelé el borrador. No se creó ningún caso." }]);
    } else if (assistantUpdateDraft && /\b(cancelar|cancela|olvidalo|descartar)\b/.test(normalized)) {
      setAssistantUpdateDraft(null);
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Cancelé el cambio. El expediente no se modificó." }]);
    } else if (assistantPaymentDraft && /\b(cancelar|cancela|olvidalo|descartar)\b/.test(normalized)) {
      setAssistantPaymentDraft(null);
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Cancelé el registro. No se guardó ningún pago." }]);
    } else if (assistantPaymentDraft) {
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Revisa la fecha y confirma el pago en el resumen, o escribe «cancelar»." }]);
    } else if (bulkRequest) {
      setAssistantCaseDraft(null);
      setAssistantMessages((current) => [...current, { role: "assistant", text: "La importación de Excel aún no está disponible. Por ahora puedes crear casos uno por uno. No se ha guardado ningún caso." }]);
    } else if (isFullPaymentMessage(text) && !assistantUpdateDraft) {
      const found = findAssistantUpdateCases(text);
      if (found.length === 1) prepareAssistantFullPayment(found[0]);
      else {
        setAssistantUpdateDraft({ paymentIntent: true });
        setAssistantMessages((current) => [...current, { role: "assistant", text: "¿De qué expediente se recibió el pago total? Escribe el nombre del cliente, la cédula o el número BV.", caseIds: found.map((item) => item.id), action: found.length ? "select-update" : undefined }]);
      }
    } else if (updateRequest && !assistantUpdateDraft) {
      setAssistantCaseDraft(null);
      const found = findAssistantUpdateCases(text);
      if (found.length === 1) {
        setAssistantUpdateDraft({ caseId: found[0].id });
        setAssistantMessages((current) => [...current, { role: "assistant", text: `Encontré ${found[0].client} (${found[0].id}). ¿Qué dato quieres cambiar? Puedo actualizar estado, responsable, tipo, contraparte, celular, correo o registrar un pago total.` }]);
      } else {
        setAssistantUpdateDraft({});
        setAssistantMessages((current) => [...current, { role: "assistant", text: found.length ? "Encontré varios expedientes. Elige el que quieres actualizar." : "Claro. ¿Qué expediente quieres actualizar? Escribe el nombre del cliente, la cédula o el número BV.", caseIds: found.map((item) => item.id), action: found.length ? "select-update" : undefined }]);
      }
    } else if (assistantUpdateDraft) {
      if (!assistantUpdateDraft.caseId) {
        const found = findAssistantUpdateCases(text);
        if (found.length === 1) {
          if (assistantUpdateDraft.paymentIntent) prepareAssistantFullPayment(found[0]);
          else {
            setAssistantUpdateDraft({ caseId: found[0].id });
            setAssistantMessages((current) => [...current, { role: "assistant", text: `Encontré ${found[0].client} (${found[0].id}). ¿Qué dato quieres cambiar? Puedo actualizar estado, responsable, tipo, contraparte, celular, correo o registrar un pago total.` }]);
          }
        } else {
          setAssistantMessages((current) => [...current, { role: "assistant", text: found.length ? "Hay varios expedientes con ese dato. Elige uno de la lista." : "No encontré ese expediente. Prueba con más partes del nombre, la cédula o el número BV.", caseIds: found.map((item) => item.id), action: found.length ? "select-update" : undefined }]);
        }
      } else if (isFullPaymentMessage(text)) {
        const item = caseRecords.find((record) => record.id === assistantUpdateDraft.caseId);
        if (item) prepareAssistantFullPayment(item);
      } else if (isClarificationRequest(text)) {
        setAssistantMessages((current) => [...current, { role: "assistant", text: "Dime qué dato del expediente quieres cambiar y su nuevo valor. Por ejemplo: «cambia el estado a Esperando respuesta» o «asígnaselo a Juan»." }]);
      } else {
        const parsed = parseCaseUpdate(text, statuses, processTypes, counterparties, activeUser, assistantUpdateDraft.field);
        if (parsed.field === "note") {
          setSelectedCaseId(assistantUpdateDraft.caseId);
          setCaseTab("Propiedades");
          setAssistantOpen(false);
          setAssistantUpdateDraft(null);
          setAssistantMessages((current) => [...current, { role: "assistant", text: "Las anotaciones se escriben dentro del expediente del cliente, en Propiedades." }]);
          return;
        }
        const draft = { ...assistantUpdateDraft, ...parsed };
        if (!draft.field) {
          setAssistantMessages((current) => [...current, { role: "assistant", text: "¿Qué dato quieres cambiar? Puedo actualizar estado, responsable, tipo, contraparte, celular, correo o registrar un pago total." }]);
        } else if (!draft.value) {
          setAssistantUpdateDraft(draft);
          const prompts: Record<CaseUpdateField, string> = { status: `¿Cuál será el nuevo estado? Opciones: ${statuses.join(", ")}.`, owner: "¿El responsable será Juan o Luis?", phone: "¿Cuál es el nuevo celular?", email: "¿Cuál es el nuevo correo?", counterparty: `¿Cuál es la nueva contraparte? Opciones: ${counterparties.join(", ")}.`, type: `¿Cuál es el nuevo tipo de proceso? Opciones: ${processTypes.join(", ")}.`, note: "¿Qué texto quieres agregar como nota?" };
          setAssistantMessages((current) => [...current, { role: "assistant", text: prompts[draft.field!] }]);
        } else {
          setAssistantUpdateDraft(draft);
          setAssistantMessages((current) => [...current, { role: "assistant", text: "Tengo el cambio preparado. Revisa el resumen y confirma si está correcto." }]);
        }
      }
    } else if (createRequest || assistantCaseDraft) {
      const awaiting = assistantCaseDraft ? nextMissingCaseField(assistantCaseDraft) : undefined;
      if (awaiting && isClarificationRequest(text)) {
        setAssistantMessages((current) => [...current, { role: "assistant", text: explanationForCaseDraft(assistantCaseDraft!, awaiting) }]);
        return;
      }
      const parsed = extractCaseDraft(text, processTypes, counterparties, awaiting, activeUser, assistantCaseDraft?.indemnityStage);
      const draft = { ...assistantCaseDraft, ...parsed, owner: parsed.owner ?? assistantCaseDraft?.owner ?? activeUser };
      setAssistantCaseDraft(draft);
      const missing = nextMissingCaseField(draft);
      const rejectedStatus = awaiting === "type" && /^(pendiente|prospecto|cerrado|en consulta)$/i.test(normalized);
      setAssistantMessages((current) => [...current, { role: "assistant", text: rejectedStatus ? `«${text}» indica el estado del caso. ${questionForCaseDraft(draft, "type")}` : missing ? questionForCaseDraft(draft, missing) : "Tengo los datos básicos. Revisa el resumen y confirma si quieres crear el caso. Puedes escribir una corrección antes de confirmar." }]);
    } else if (taskRequest) {
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Abre el formulario de tarea y asóciala al expediente correcto.", action: "task" }]);
    } else if (deadlineRequest) {
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Puedes revisar los plazos y alertas registrados.", action: "deadlines" }]);
    } else if (matches.length) {
      setAssistantMessages((current) => [...current, { role: "assistant", text: `Encontré ${matches.length} expediente${matches.length === 1 ? "" : "s"}.`, caseIds: matches.map((item) => item.id) }]);
    } else {
      setAssistantMessages((current) => [...current, { role: "assistant", text: "Puedo ayudarte a crear, buscar o actualizar un caso, crear una tarea y revisar plazos. Dime qué necesitas." }]);
    }
  };
  useEffect(() => {
    if (assistantOpen) assistantEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [assistantMessages, assistantOpen]);
  useEffect(() => {
    if (activeSection !== "casos" || caseView !== "Lista") return;
    const viewport = document.querySelector<HTMLDivElement>('[data-bv-platform] .bv-case-table-scroll');
    const table = viewport?.querySelector("table");
    const fixedViewport = fixedCaseScrollRef.current;
    if (!table || !viewport || !fixedViewport) return;
    const updateWidth = () => {
      const bounds = viewport.getBoundingClientRect();
      fixedViewport.style.left = `${bounds.left}px`;
      fixedViewport.style.width = `${bounds.width}px`;
      setCaseTableWidth(table.scrollWidth);
    };
    const syncFixed = () => { fixedViewport.scrollLeft = viewport.scrollLeft; };
    const syncTable = () => { viewport.scrollLeft = fixedViewport.scrollLeft; };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(table);
    observer.observe(viewport);
    window.addEventListener("resize", updateWidth);
    viewport.addEventListener("scroll", syncFixed);
    fixedViewport.addEventListener("scroll", syncTable);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
      viewport.removeEventListener("scroll", syncFixed);
      fixedViewport.removeEventListener("scroll", syncTable);
    };
  }, [activeSection, caseView, visibleCases.length]);

  const calendarEvents = [
    ...caseRecords.flatMap((item) => [
      ...(item.dueDate ? [{ date: item.dueDate, title: `${item.deadlineLabel || "Vencimiento del proceso"} · ${item.client}`, caseId: item.id, kind: "Vencimiento", owners: item.owners }] : []),
      ...(item.alertDate ? [{ date: item.alertDate, title: `${item.alertMessage || item.alert}: ${item.client}`, caseId: item.id, kind: "Alerta", owners: item.owners }] : []),
      ...(item.annotations ?? []).filter((annotation) => annotation.reminderDate).map((annotation) => ({ date: annotation.reminderDate!, title: `Recordatorio · ${annotation.reference} · ${item.client}`, caseId: item.id, kind: "Recordatorio", owners: item.owners })),
    ]),
    ...tasks.filter((task) => task.dueDate).map((task) => ({ date: task.dueDate, title: `Tarea · ${task.title}`, caseId: task.caseId, kind: task.done ? "Tarea completada" : "Tarea", owners: [task.owner] })),
    ...alerts.map((alert) => ({ date: alert.date, title: `Alerta · ${alert.title} · ${caseRecords.find((item) => item.id === alert.caseId)?.client ?? "Expediente"}`, caseId: alert.caseId, kind: "Alerta", owners: [alert.owner] })),
  ];
  const calendarOffset = (new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() + 6) % 7;
  const calendarCellCount = Math.ceil((calendarOffset + new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()) / 7) * 7;
  const calendarDays = Array.from({ length: calendarCellCount }, (_, index) => {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - calendarOffset + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  });
  const paymentsByCase = (caseId: string) => payments.filter((payment) => payment.caseId === caseId).sort((a, b) => b.date.localeCompare(a.date));
  const activity = caseActivity({ cases: caseRecords, caseFields, caseColumnOrder, deletedCases, statuses, statusColors, tasks, alerts, processTypes, payments, documents, counterparties, documentCategories });
  const visibleActivity = activity.filter((entry) => `${entry.caseName} ${entry.action} ${entry.detail} ${entry.by}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && (filter === "Todos" || (filter === "Hoy" && entry.timestamp && new Date(entry.timestamp).toLocaleDateString("sv-SE") === todayKey) || entry.by.startsWith(filter)));
  const visibleCalendarEvents = calendarEvents.filter((entry) => {
    const linkedCase = caseRecords.find((item) => item.id === entry.caseId);
    const matchesQuery = `${entry.title} ${entry.kind} ${linkedCase?.client ?? ""} ${linkedCase?.type ?? ""} ${linkedCase?.counterparty ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    return matchesQuery && (filter === "Todos" || (filter === "Hoy" && entry.date === todayKey) || entry.owners.some((owner) => owner.startsWith(filter)));
  });
  const undatedCases = scopedCases.filter((item) => !item.dueDate && !item.alertDate && !(item.annotations ?? []).some((annotation) => annotation.reminderDate) && !tasks.some((task) => task.caseId === item.id && task.dueDate));
  const filterOptions: Record<SectionId, string[]> = {
    inicio: ["Todos", "Juan", "Luis", "Hoy"], clientes: ["Todos", "Juan", "Luis", "Activo"], casos: ["Todos", "Juan", "Luis"], tareas: ["Todos", "Juan", "Luis", "Hoy"], calendario: ["Todos", "Juan", "Luis", "Hoy"], documentos: ["Todos", "Juan", "Luis", "Sin documentos"], pagos: ["Todos", "Juan", "Luis", "Pendientes", "Pagados", "Sin honorarios"], estadisticas: ["Todos", "Juan", "Luis", "Hoy"], actividad: ["Todos", "Juan", "Luis", "Hoy"], configuracion: [],
  };

  const selectSection = (id: SectionId) => {
    window.scrollTo(0, 0);
    setActiveSection(id);
    setQuery("");
    setFilter("Todos");
    setCaseStatusFilter("");
    setHomeDrilldownScope(null);
    setSidebarOpen(false);
  };

  const openHomeMetric = (metricFilter: string) => {
    setHomeDrilldownScope(["Juan", "Luis", "Hoy"].includes(filter) ? filter : null);
    setActiveSection("casos");
    setCaseView("Lista");
    setFilter(metricFilter);
    setCaseStatusFilter("");
    setQuery("");
  };

  const createTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTask.title.trim() || !newTask.caseId || !caseRecords.some((item) => item.id === newTask.caseId)) return;
    const task = { ...newTask, id: `T-${window.crypto.randomUUID()}`, title: newTask.title.trim(), done: false, createdAt: new Date().toLocaleString("es-CO") };
    setTasks((current) => [task, ...current]);
    updateCase(newTask.caseId, {}, "Creó tarea", newTask.title.trim(), { taskCreateId: task.id });
    setShowNewTask(false);
    setNewTask({ title: "", caseId: "", owner: activeUser, priority: "Media", dueDate: "" });
  };

  const createCalendarAlert = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const item = caseRecords.find((record) => record.id === calendarAlertDraft.caseId);
    const title = calendarAlertDraft.title.trim();
    if (!item || !title) return;
    const alert: CalendarAlertRecord = { id: `A-${window.crypto.randomUUID()}`, caseId: item.id, title, date: calendarSelectedDate, owner: calendarAlertDraft.owner || item.owners[0] || activeUser, createdAt: new Date().toLocaleString("es-CO") };
    setAlerts((current) => [alert, ...current]);
    updateCase(item.id, {}, "Creó alerta de calendario", `${calendarSelectedDate} · ${title} · ${alert.owner}`);
    setCalendarAlertDraft({ caseId: "", title: "", owner: "" });
    setShowCalendarAlert(false);
  };

  const applyAlertAsTask = (item: CaseRecord) => {
    const title = item.alertMessage?.trim() || item.deadlineLabel?.trim() || (item.alert !== "Sin alerta" ? item.alert : "") || `Revisar alerta de ${item.client}`;
    const dueDate = item.alertDate || item.dueDate || "";
    const priority: TaskRecord["priority"] = ["Vence hoy", "Atención prioritaria"].includes(item.alert) ? "Alta" : "Media";
    const linkedTask = tasks.find((task) => task.id === item.alertTaskId && task.caseId === item.id);
    if (linkedTask) {
      setTasks((current) => current.map((task) => task.id === linkedTask.id ? { ...task, title, dueDate, priority } : task));
      updateCase(item.id, {}, "Actualizó tarea de alerta", `${title}${dueDate ? ` · ${dueDate}` : ""}`);
      return;
    }
    const task: TaskRecord = { id: `T-${window.crypto.randomUUID()}`, title, caseId: item.id, owner: item.owners[0] || activeUser, priority, dueDate, done: false, createdAt: new Date().toLocaleString("es-CO") };
    setTasks((current) => [task, ...current]);
    updateCase(item.id, { alertTaskId: task.id }, "Aplicó alerta como tarea", `${title}${dueDate ? ` · ${dueDate}` : ""}`, { taskCreateId: task.id });
  };

  const updateCase = (id: string, patch: Partial<CaseRecord>, action?: string, detail?: string, linkedUndo?: NonNullable<CaseHistoryEntry["undo"]>) => {
    setCaseRecords((current) => current.map((item) => {
      if (item.id !== id) return item;
      const previous = Object.fromEntries(Object.keys(patch).map((key) => [key, item[key as keyof CaseRecord]])) as Partial<Omit<CaseRecord, "id" | "history">>;
      const undo = Object.keys(previous).length || linkedUndo ? { values: previous, ...linkedUndo } : undefined;
      const history = action ? [{ at: new Date().toLocaleString("es-CO"), timestamp: Date.now(), by: activeUser, action, detail: detail ?? "", undo }, ...item.history] : item.history;
      return { ...item, ...patch, history };
    }));
  };

  const updateCustomValue = (caseId: string, field: CustomCaseField, value: string) => {
    const item = caseRecords.find((record) => record.id === caseId);
    if (!item || (item.customValues?.[field.id] ?? "") === value) return;
    if (field.type === "select" && value && !field.options.includes(value)) return;
    updateCase(caseId, { customValues: { ...item.customValues, [field.id]: value } }, `Actualizó ${field.name}`, `${item.customValues?.[field.id] || "Sin definir"} → ${value || "Sin definir"}`);
  };

  const updateTableCaseField = (caseId: string, field: "counterparty" | "type" | "owners", value: string) => {
    const item = caseRecords.find((record) => record.id === caseId);
    if (!item) return;
    if (field === "owners") {
      const owners = value === "Ambos" ? ["Juan Valencia", "Luis Hernando Barrios"] : value ? [value] : [];
      if (item.owners.join("|") !== owners.join("|")) updateCase(caseId, { owners }, "Actualizó responsable", `${item.owners.join(", ") || "Sin responsable"} → ${owners.join(", ") || "Sin responsable"}`);
      return;
    }
    if (item[field] === value) return;
    const label = field === "type" ? "tipo" : "contraparte";
    updateCase(caseId, { [field]: value }, `Actualizó ${label}`, `${item[field] || "Sin definir"} → ${value}`);
  };

  const openCaseTab = (caseId: string, tab: "Propiedades" | "Pagos" | "Datos del cliente", focusDeadline = false) => {
    setSelectedCaseId(caseId);
    setCaseTab(tab);
    if (focusDeadline) window.setTimeout(() => {
      const scroller = document.querySelector<HTMLElement>('[role="dialog"][aria-label^="Expediente"] > div.overflow-y-auto');
      const section = scroller?.querySelector<HTMLElement>("#bv-case-deadline");
      if (scroller && section) scroller.scrollTo({ top: scroller.scrollTop + section.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 12, behavior: "smooth" });
    }, 0);
  };

  const deleteCustomField = (id: string) => {
    const field = caseFields.find((item) => item.id === id);
    if (!field) return;
    const at = new Date().toLocaleString("es-CO");
    const timestamp = Date.now();
    setCaseFields((current) => current.filter((item) => item.id !== id));
    setCaseColumnOrder((current) => current.filter((item) => item !== id));
    setCaseRecords((current) => current.map((item) => {
      if (!item.customValues || !(id in item.customValues)) return item;
      const customValues = { ...item.customValues };
      const previous = customValues[id];
      delete customValues[id];
      return { ...item, customValues, history: previous ? [{ at, timestamp, by: activeUser, action: `Eliminó columna ${field.name}`, detail: `Valor anterior: ${previous}` }, ...item.history] : item.history };
    }));
  };

  const confirmAssistantUpdate = () => {
    const draft = assistantUpdateDraft;
    const item = caseRecords.find((record) => record.id === draft?.caseId);
    if (!draft?.field || !draft.value || !item) return;
    const origin = "Origen: Asistente guiado";
    const field = draft.field;
    const value = draft.value;
    if (field === "status") {
      if (item.status === value) {
        setAssistantMessages((current) => [...current, { role: "assistant", text: "Ese expediente ya tiene ese estado. No hice cambios." }]);
        setAssistantUpdateDraft(null);
        return;
      }
      updateCase(item.id, { status: value }, "Cambió estado", `${origin}\n${item.status} → ${value}`);
    } else if (field === "note") {
      setSelectedCaseId(item.id);
      setCaseTab("Propiedades");
      setAssistantOpen(false);
      setAssistantUpdateDraft(null);
      return;
    } else {
      const oldValue = field === "owner" ? item.owners.join(", ") : item[field] ?? "";
      if (oldValue === value) {
        setAssistantMessages((current) => [...current, { role: "assistant", text: "Ese expediente ya tiene ese valor. No hice cambios." }]);
        setAssistantUpdateDraft(null);
        return;
      }
      const patch: Partial<CaseRecord> = field === "owner" ? { owners: [value] } : { [field]: value };
      if (field === "type" && !processTypes.includes(value)) setProcessTypes((current) => [...current, value]);
      updateCase(item.id, patch, `Actualizó ${assistantUpdateLabels[field].toLocaleLowerCase()}`, `${origin}\n${oldValue || "Vacío"} → ${value}`);
    }
    setAssistantUpdateDraft(null);
    setAssistantMessages((current) => [...current, { role: "assistant", text: `Actualicé ${item.client} (${item.id}) y registré el cambio en el historial.`, caseIds: [item.id] }]);
  };

  const deleteCase = (caseId: string, reason: DeletedCaseRecord["reason"] = "manual") => {
    const current: PlatformSnapshot = { cases: caseRecords, caseFields, caseColumnOrder, deletedCases, statuses, statusColors, tasks, alerts, processTypes, payments, documents, counterparties, documentCategories };
    const next = archiveDeletedCase(current, caseId, activeUser, new Date(), reason);
    if (next === current) return;
    setCaseRecords(next.cases);
    setTasks(next.tasks);
    setAlerts(next.alerts);
    setPayments(next.payments);
    setDocuments(next.documents);
    setDeletedCases(next.deletedCases);
    setDeleteCaseId(null);
    setSelectedCaseId(null);
  };

  const undoActivity = (caseId: string, timestamp: number | undefined) => {
    if (!timestamp) return;
    const item = caseRecords.find((record) => record.id === caseId);
    const entry = item?.history.find((record) => record.timestamp === timestamp);
    if (!item || !entry?.undo) return;
    if (entry.undo.deleteCase) {
      deleteCase(caseId, "undo_creation");
      return;
    }
    const { values } = entry.undo;
    const undonePayment = entry.undo.paymentId ? payments.find((payment) => payment.id === entry.undo?.paymentId) : null;
    if (entry.undo.paymentId) setPayments((current) => current.filter((payment) => payment.id !== entry.undo?.paymentId));
    if (entry.undo.documentId) setDocuments((current) => current.filter((document) => document.id !== entry.undo?.documentId));
    if (entry.undo.taskCreateId) setTasks((current) => current.filter((task) => task.id !== entry.undo?.taskCreateId));
    if (entry.undo.taskState) {
      const taskState = entry.undo.taskState;
      setTasks((current) => current.map((task) => task.id === taskState.id ? { ...task, done: taskState.done, completedBy: taskState.completedBy } : task));
    }
    setCaseRecords((current) => current.map((record) => record.id !== caseId ? record : {
      ...record, ...values, ...(undonePayment ? { paid: String(Math.max(0, amountValue(record.paid) - undonePayment.amount)) } : {}),
      history: [{ at: new Date().toLocaleString("es-CO"), timestamp: Date.now(), by: activeUser, action: "Deshizo un cambio", detail: entry.action }, ...record.history.map((historyEntry) => historyEntry.timestamp === timestamp ? { ...historyEntry, undo: undefined } : historyEntry)],
    }));
  };

  const savePayment = (item: CaseRecord, amount: number, date: string, note: string) => {
    const payment: PaymentRecord = { id: `P-${window.crypto.randomUUID()}`, caseId: item.id, amount, date, note, by: activeUser };
    setPayments((current) => [payment, ...current]);
    updateCase(item.id, { paid: String(amountValue(item.paid) + amount) }, "Registró pago", `${formatCOP(amount)} · ${date}${payment.note ? ` · ${payment.note}` : ""}`, { paymentId: payment.id });
  };

  const recordPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(paymentForm.amount);
    const item = caseRecords.find((record) => record.id === paymentForm.caseId);
    if (!item || !paymentForm.date || !Number.isFinite(amount) || amount <= 0) return;
    savePayment(item, amount, paymentForm.date, paymentForm.note.trim());
    setPaymentOpen(false);
    setPaymentForm({ caseId: "", amount: "", date: localDateKey(new Date()), note: "" });
  };

  const confirmAssistantPayment = () => {
    if (!assistantPaymentDraft?.date || !assistantPaymentCase || !assistantPaymentBalance) return;
    const item = assistantPaymentCase;
    const amount = assistantPaymentBalance;
    savePayment(item, amount, assistantPaymentDraft.date, "Pago total registrado desde el asistente BV");
    setAssistantPaymentDraft(null);
    setAssistantMessages((current) => [...current, { role: "assistant", text: `Registré ${formatCOP(amount)} para completar los honorarios de ${item.client}. El saldo quedó en cero.`, caseIds: [item.id] }]);
  };

  const addDocument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCase || !documentForm.name.trim() || !documentForm.url.trim()) return;
    const document: DocumentRecord = { id: `D-${window.crypto.randomUUID()}`, caseId: selectedCase.id, name: documentForm.name.trim(), category: documentCategories.includes(documentForm.category) ? documentForm.category : (documentCategories[0] ?? "Otros"), url: documentForm.url.trim(), addedAt: todayKey, by: activeUser };
    setDocuments((current) => [document, ...current]);
    updateCase(selectedCase.id, {}, "Agregó documento", `${document.name} · ${document.category}`, { documentId: document.id });
    setDocumentForm({ name: "", category: documentCategories[0] ?? "Otros", url: "" });
  };

  const toggleTask = (task: TaskRecord, done: boolean) => {
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done, completedBy: done ? activeUser : undefined } : item));
    updateCase(task.caseId, {}, done ? "Completó tarea" : "Reabrió tarea", task.title, { taskState: { id: task.id, done: task.done, completedBy: task.completedBy } });
  };

  const updateCaseText = (id: string, field: "client" | "nationalId" | "phone" | "email" | "relativeName" | "relativePhone" | "relativeRelationship" | "counterparty" | "type", value: string, label: string) => {
    const current = caseRecords.find((item) => item.id === id);
    if (!current || current[field] === value) return;
    updateCase(id, { [field]: value }, `Actualizo ${label}`, `${current[field] || "Vacio"} -> ${value || "Vacio"}`);
  };

  const requestStatusChange = (caseId: string, next: string) => {
    const current = caseRecords.find((item) => item.id === caseId);
    if (!current || current.status === next) return;
    updateCase(caseId, { status: next }, "Cambió estado", `${current.status} → ${next}`);
  };

  const saveCase = (data: typeof newCase, origin: "Formulario" | "Asistente guiado", customValues: Record<string, string> = {}) => {
    if (!data.client.trim() || !data.nationalId.trim() || !data.phone.trim()) return;
    if (!processTypes.includes(data.type)) setProcessTypes((current) => [...current, data.type]);
    const id = `BV-${String(Date.now()).slice(-6)}`;
    const item: CaseRecord = { id, client: data.client.trim().toLocaleUpperCase(), nationalId: data.nationalId.trim(), phone: data.phone.trim(), email: data.email.trim(), relativeName: data.relativeName.trim(), relativePhone: data.relativePhone.trim(), relativeRelationship: data.relativeRelationship, counterparty: data.counterparty, type: data.type, owners: [data.owner], status: data.status, alert: "Sin alerta", alertDate: "", dueDate: "", fees: "", paid: "", notes: [], annotations: [], customValues, driveUrl: "", history: [{ at: new Date().toLocaleString("es-CO"), timestamp: Date.now(), by: activeUser, action: "Caso creado", detail: `Origen: ${origin}\nEstado inicial: ${data.status}`, undo: { deleteCase: true } }] };
    setCaseRecords((current) => [item, ...current]);
    setShowNewCase(false);
    setActiveSection("casos");
    setCaseView("Lista");
    setFilter("Todos");
    setCaseStatusFilter("");
    setHomeDrilldownScope(null);
    setQuery("");
    setSelectedCaseId(id);
    setCaseTab("Propiedades");
    setNewCase({ client: "", nationalId: "", phone: "", email: "", relativeName: "", relativePhone: "", relativeRelationship: "", counterparty: "Colpensiones", type: initialProcessTypes[0], status: "Prospecto", owner: "Juan Valencia" });
    setNewCaseCustomValues({});
  };

  const createCase = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveCase(newCase, "Formulario", newCaseCustomValues);
  };

  const confirmAssistantCase = () => {
    const draft = assistantCaseDraft;
    if (!draft || nextMissingCaseField(draft)) return;
    saveCase({ client: draft.client!, nationalId: draft.nationalId!, phone: draft.phone!, email: "", relativeName: "", relativePhone: "", relativeRelationship: "", counterparty: draft.counterparty!, type: draft.type!, status: "Prospecto", owner: draft.owner ?? activeUser }, "Asistente guiado");
    setAssistantCaseDraft(null);
    setAssistantOpen(false);
  };

  const addCaseNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCase || !newNote.trim()) return;
    const note = newNote.trim();
    const annotation: CaseAnnotation = { date: newNoteDate, reference: newNoteReference.trim() || "Anotacion", text: note, by: activeUser, reminderDate: newNoteReminderDate || undefined };
    const noteLine = `${annotation.date} · ${annotation.reference}: ${annotation.text}${annotation.reminderDate ? ` · Recordarme ${annotation.reminderDate}` : ""}`;
    updateCase(selectedCase.id, { notes: [noteLine, ...selectedCase.notes], annotations: [annotation, ...(selectedCase.annotations ?? [])] }, "Agrego una anotacion", noteLine);
    setNewNote("");
    setNewNoteReference("");
    setNewNoteReminderDate("");
    setNewNoteDate(localDateKey(new Date()));
  };

  const downloadLocalBackup = () => {
    const data = storageReady
      ? JSON.stringify({ cases: caseRecords, caseFields, caseColumnOrder, deletedCases, statuses, statusColors, tasks, alerts, processTypes, payments, documents, counterparties, documentCategories }, null, 2)
      : window.localStorage.getItem("bv-platform-cases-v1") ?? "{}";
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `barrios-valencia-respaldo-${localDateKey(new Date())}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div data-bv-platform className="min-h-screen bg-[#f8f9fa] text-slate-800">
      {storageError && <div role="alert" className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-950"><span>{storageError}</span><button type="button" onClick={downloadLocalBackup} className="border border-amber-500 px-2 py-1 font-medium">Descargar copia</button></div>}
      {paymentOpen && <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/35 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaymentOpen(false); }}><form onSubmit={recordPayment} className="w-full max-w-md border border-slate-200 bg-white shadow-xl"><div className="border-b border-slate-200 px-4 py-3"><h2 className="text-sm font-semibold">Registrar pago</h2></div><div className="space-y-3 p-4"><label className="block text-xs text-slate-600">Expediente<select required value={paymentForm.caseId} onChange={(event) => setPaymentForm({ ...paymentForm, caseId: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm"><option value="">Seleccionar caso</option>{caseRecords.map((item) => <option key={item.id} value={item.id}>{item.client} · {item.type}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-600">Valor recibido<input required min="1" type="number" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm" /></label><label className="text-xs text-slate-600">Fecha del pago<input required type="date" value={paymentForm.date} onChange={(event) => setPaymentForm({ ...paymentForm, date: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm" /></label></div><label className="block text-xs text-slate-600">Nota<input value={paymentForm.note} onChange={(event) => setPaymentForm({ ...paymentForm, note: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm" placeholder="Referencia o medio de pago" /></label></div><div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3"><button type="button" onClick={() => setPaymentOpen(false)} className="px-3 py-2 text-xs">Cancelar</button><button className="bg-[#10263C] px-3 py-2 text-xs text-white">Guardar pago</button></div></form></div>}
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-[#25445f] bg-[#10263C] px-3 lg:hidden">
        <span className="text-sm font-semibold text-white">Barrios Valencia</span>
        <button type="button" onClick={() => setSidebarOpen((value) => !value)} aria-label={sidebarOpen ? "Cerrar menu" : "Abrir menu"} className="inline-flex h-9 w-9 items-center justify-center text-white">
          <Icon name={sidebarOpen ? "close" : "menu"} className="h-[18px] w-[18px]" />
        </button>
      </header>

      {sidebarOpen && <button type="button" aria-label="Cerrar menu" className="fixed inset-0 top-12 z-30 bg-slate-950/25 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={cn("fixed bottom-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white px-2 py-3 transition-all duration-200 lg:top-0", sidebarOpen ? "top-12 w-52" : "top-12 hidden w-52 lg:flex", sidebarCollapsed ? "lg:w-[56px]" : "lg:w-[192px]")}>
        <div className={cn("flex h-10 items-center gap-2 px-1", sidebarCollapsed && "lg:justify-center lg:px-0")}>
          <Image src="/barriosvalencia.png" alt="Barrios Valencia" width={36} height={36} className={cn("h-8 w-8 shrink-0 object-contain", sidebarCollapsed && "lg:hidden")} priority />
          <div className={cn("min-w-0", sidebarCollapsed && "lg:hidden")}>
            <Link href="/" className="block truncate text-[13px] font-semibold text-slate-900">Barrios Valencia</Link>
            <p className="text-[11px] text-slate-500">Gestion juridica</p>
          </div>
          <button type="button" onClick={() => setSidebarCollapsed((value) => !value)} aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Ocultar barra lateral"} title={sidebarCollapsed ? "Expandir" : "Ocultar"} className={cn("ml-auto hidden h-7 w-7 items-center justify-center text-slate-500 hover:bg-slate-100 lg:flex", sidebarCollapsed && "lg:ml-0")}>
            <Icon name="chevron" className={cn("h-4 w-4 transition", !sidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        <p className={cn("mb-1 mt-6 px-2 text-[10px] font-semibold uppercase text-slate-400", sidebarCollapsed && "lg:hidden")}>Espacio de trabajo</p>
        <nav className="space-y-0.5" aria-label="Navegacion de plataforma">
          {menuItems.map((item) => (
            <button key={item.id} type="button" onClick={() => selectSection(item.id)} aria-current={activeSection === item.id ? "page" : undefined} title={sidebarCollapsed ? item.label : undefined} className={cn("flex h-8 w-full items-center gap-2 border-l-2 px-2 text-left text-[12px] transition", sidebarCollapsed && "lg:justify-center lg:px-0", activeSection === item.id ? "border-[#A1805E] bg-[#f4f1ed] font-medium text-[#10263C]" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <Icon name={item.id} className="h-[17px] w-[17px] shrink-0" />
              <span className={cn(sidebarCollapsed && "lg:hidden")}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 px-1 pt-3">
          <p className={cn("truncate text-[12px] font-medium text-slate-900", sidebarCollapsed && "lg:hidden")}>{activeUser}</p>
          <p className={cn("mt-0.5 truncate text-[11px] text-slate-500", sidebarCollapsed && "lg:hidden")}>Usuario activo</p>
          {onSignOut && <button type="button" onClick={onSignOut} className={cn("mt-2 text-[11px] text-slate-500 hover:text-slate-900", sidebarCollapsed && "lg:w-full lg:text-center")}>{sidebarCollapsed ? "Salir" : "Cerrar sesión"}</button>}
        </div>
      </aside>

      <div className={cn("min-w-0 transition-[margin] duration-200", sidebarCollapsed ? "lg:ml-[56px]" : "lg:ml-[192px]")}>
        <header className="border-b border-[#25445f] bg-[#10263C] px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase text-slate-300">{active.eyebrow}</p>
              <h1 className="mt-0.5 text-lg font-semibold leading-6 text-white">{active.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="hidden items-center gap-1 text-[11px] text-slate-300 sm:flex">Usuario
                {signedInUser ? <span className="text-xs font-medium text-white">{signedInUser}</span> : <select value={activeUser} onChange={(event) => setActiveUser(event.target.value)} className="border-0 bg-[#10263C] py-1 text-xs font-medium text-white outline-none"><option>Juan Valencia</option><option>Luis Hernando Barrios</option></select>}
              </label>
              {activeSection === "casos" && <button onClick={() => setShowNewCase(true)} className="shrink-0 bg-white px-3 py-2 text-xs font-medium text-[#10263C] hover:bg-slate-100">+ Nuevo caso</button>}
              {activeSection === "tareas" && <button onClick={() => { setNewTask((current) => ({ ...current, owner: activeUser })); setShowNewTask(true); }} className="shrink-0 bg-white px-3 py-2 text-xs font-medium text-[#10263C] hover:bg-slate-100">+ Nueva tarea</button>}
              {activeSection === "pagos" && <button onClick={() => { setPaymentForm((current) => ({ ...current, caseId: caseRecords[0]?.id ?? "" })); setPaymentOpen(true); }} className="shrink-0 bg-white px-3 py-2 text-xs font-medium text-[#10263C] hover:bg-slate-100">+ Registrar pago</button>}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-3 py-3 sm:px-5">
          <p className="mb-2 max-w-3xl text-xs leading-5 text-slate-500">{active.description}</p>
          {activeSection === "inicio" && (
            <section className="mb-3 grid grid-cols-2 border-y border-slate-200 sm:grid-cols-4">
              {homeMetrics.map((metric, index) => <button key={metric.label} type="button" onClick={() => openHomeMetric(metric.filter)} className={cn("group py-3 text-left hover:bg-slate-50", index > 0 && "border-l border-slate-200 pl-4")}><p className="text-[11px] text-slate-500 group-hover:text-[#315875]">{metric.label} <span aria-hidden="true">↗</span></p><p className="mt-0.5 text-xl font-semibold text-slate-900">{metric.count}</p></button>)}
            </section>
          )}

          {activeSection === "estadisticas" && (
            <section className="mb-3 grid grid-cols-2 border-y border-slate-200 sm:grid-cols-4">
              {[["Casos visibles", String(statisticsCases.length)], ["Casos activos", String(statistics.open)], ["Honorarios", formatCOP(statistics.fees)], ["Recaudado", formatCOP(statistics.paid)]].map(([label, value], index) => <div key={label} className={cn("py-2", index > 0 && "border-l border-slate-200 pl-3")}><p className="text-[10px] text-slate-500">{label}</p><p className="mt-0.5 text-base font-semibold text-slate-900">{value}</p></div>)}
            </section>
          )}
          {activeSection === "estadisticas" && filter === "Hoy" && <p className="mb-2 text-[10px] text-slate-500">Hoy muestra expedientes con movimiento, pago o fecha programada hoy. Los importes son sus totales acumulados.</p>}

          {activeSection === "pagos" && <section className="mb-3 grid grid-cols-2 border-y border-slate-200 sm:grid-cols-4">{[["Expedientes", String(paymentCases.length)], ["Honorarios", formatCOP(paymentCases.reduce((sum, item) => sum + amountValue(item.fees), 0))], ["Cobrado", formatCOP(paymentCases.reduce((sum, item) => sum + amountValue(item.paid), 0))], ["Saldo", formatCOP(paymentCases.reduce((sum, item) => sum + Math.max(0, amountValue(item.fees) - amountValue(item.paid)), 0))]].map(([label, value], index) => <div key={label} className={cn("py-2", index > 0 && "border-l border-slate-200 pl-3")}><p className="text-[10px] text-slate-500">{label}</p><p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{value}</p></div>)}</section>}

          {activeSection === "casos" && <section className="border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
              <div className="flex flex-wrap gap-1">{["Lista", "Tablero", "Prospectos", "Cerrados", "Estadisticas", "Pagados"].map((view) => <button key={view} type="button" onClick={() => setCaseView(view)} className={cn("border-b-2 px-2.5 py-2 text-[11px]", caseView === view ? "border-[#315875] font-medium text-[#10263C]" : "border-transparent text-slate-500 hover:text-slate-800")}>{view}</button>)}</div>
              <button type="button" onClick={() => setAddStatusOpen((value) => !value)} className="px-2 py-2 text-[11px] text-slate-500 hover:text-slate-900">+ Crear estado</button>
            </div>
            {addStatusOpen && <div className="border-b border-slate-200 py-2"><form className="flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); const name = statusDraft.trim(); if (name && !statuses.includes(name)) { setStatuses((current) => [...current, name]); setStatusColors((current) => ({ ...current, [name]: statusDraftColor })); } setStatusDraft(""); }}><input autoFocus value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)} placeholder="Nombre del nuevo estado" className="h-8 w-56 border border-slate-300 px-2 text-xs outline-none focus:border-[#A1805E]"/><label title="Color del estado" className="flex h-8 items-center gap-1 border border-slate-300 px-1.5 text-[11px] text-slate-500"><input type="color" value={statusDraftColor} onChange={(event) => setStatusDraftColor(event.target.value)} aria-label="Elegir color del estado" className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"/>Color</label><button className="h-8 bg-[#10263C] px-3 text-xs text-white">Agregar estado</button></form><div className="mt-2 flex flex-wrap gap-2">{statuses.map((status) => <label key={status} className="flex items-center gap-1 border border-slate-200 px-1.5 py-1 text-[10px] text-slate-600"><input type="color" value={statusColors[status] ?? "#e2e8f0"} onChange={(event) => setStatusColors((current) => ({ ...current, [status]: event.target.value }))} aria-label={`Color de ${status}`} className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"/>{status}</label>)}</div></div>}
          </section>}

          <section className="min-w-0 border-t border-slate-200">
            {activeSection !== "configuracion" && <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 py-2">
              <div className="flex flex-wrap items-center gap-1">
                {filterOptions[activeSection].map((item) => (
                  <button key={item} type="button" onClick={() => { setFilter(item); setHomeDrilldownScope(null); if (activeSection === "casos" && item === "Todos") setCaseStatusFilter(""); if (activeSection === "calendario" && item === "Hoy") { setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setCalendarSelectedDate(todayKey); } }} aria-pressed={filter === item} className={cn("px-2.5 py-1.5 text-[11px]", filter === item ? "bg-[#e9edf1] font-medium text-[#10263C]" : "text-slate-500 hover:bg-slate-100")}>{item}</button>
                ))}
                {activeSection === "casos" && homeDrilldownScope && <button type="button" onClick={() => setHomeDrilldownScope(null)} className="border border-slate-300 px-2 py-1 text-[10px] text-slate-600">{homeDrilldownScope} ×</button>}
              </div>
              <div className="flex items-center gap-2">
                {activeSection === "casos" && <label className="flex items-center gap-1.5 text-[11px] text-slate-500">Estado<select value={caseStatusFilter} onChange={(event) => setCaseStatusFilter(event.target.value)} aria-label="Filtrar casos por estado" className="h-8 max-w-44 border border-slate-300 bg-white px-2 text-[11px] text-[#10263C] outline-none focus:border-[#315875]"><option value="">Todos los estados</option>{availableCaseStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>}
                <span className="text-[11px] text-slate-400">{activeSection === "casos" ? visibleCases.length : activeSection === "estadisticas" ? statisticsCases.length : activeSection === "inicio" ? displayHomeCases.length : activeSection === "tareas" ? visibleTasks.length : activeSection === "clientes" ? clients.length : activeSection === "documentos" ? documentCases.length : activeSection === "pagos" ? paymentCases.length : activeSection === "actividad" ? visibleActivity.length : activeSection === "calendario" ? visibleCalendarEvents.length : 0} registros</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={`Buscar en ${active.title}`} className="h-8 w-40 border border-slate-300 bg-white px-2 text-xs outline-none focus:border-[#A1805E] sm:w-56" placeholder="Buscar..." />
              </div>
            </div>}

            {activeSection === "casos" && caseView === "Estadisticas" && <section className="border-b border-slate-200 py-4"><h2 className="mb-2 text-sm font-semibold text-slate-900">Casos por tipo</h2><div className="divide-y divide-slate-100">{visibleCaseTypes.map((item) => <div key={item.type} className="flex justify-between gap-4 py-2 text-xs"><span className="text-slate-700">{item.type}</span><span className="font-semibold tabular-nums text-slate-900">{item.count}</span></div>)}{!visibleCaseTypes.length && <p className="py-4 text-xs text-slate-400">No hay casos para estos filtros.</p>}</div></section>}

            {activeSection === "calendario" ? (
              <div className="py-3">
                <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><button aria-label="Mes anterior" onClick={() => { const month = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1); setCalendarMonth(month); setCalendarSelectedDate(localDateKey(month)); setFilter("Todos"); }} className="h-8 w-8 border border-slate-200">‹</button><button aria-label="Mes siguiente" onClick={() => { const month = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1); setCalendarMonth(month); setCalendarSelectedDate(localDateKey(month)); setFilter("Todos"); }} className="h-8 w-8 border border-slate-200">›</button><h2 className="ml-1 text-sm font-semibold capitalize">{calendarMonth.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}</h2></div><button onClick={() => { const now = new Date(); setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setCalendarSelectedDate(todayKey); setFilter("Hoy"); }} className="border border-slate-200 px-3 py-1.5 text-xs">Hoy</button></div>
                <div className="grid grid-cols-7 border-l border-t border-slate-200">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <div key={day} className="border-b border-r border-slate-200 bg-[#f2f4f6] py-2 text-center text-[10px] text-slate-500">{day}</div>)}{calendarDays.map((date) => { const events = visibleCalendarEvents.filter((entry) => entry.date === date); const inMonth = date.slice(0, 7) === `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}`; return <button key={date} onClick={() => { setCalendarSelectedDate(date); if (date !== todayKey) setFilter("Todos"); }} className={cn("min-h-14 border-b border-r border-slate-200 p-1 text-left hover:bg-slate-50 sm:min-h-16", !inMonth && "bg-slate-50 text-slate-300", calendarSelectedDate === date && "bg-[#edf2f5]")}><span className="text-[10px]">{Number(date.slice(-2))}</span><span className="mt-1 hidden space-y-0.5 sm:block">{events.slice(0, 2).map((entry, index) => <span key={`${entry.caseId}-${index}`} className="block truncate border-l-2 border-[#A1805E] pl-1 text-[9px] text-slate-600">{entry.title}</span>)}{events.length > 2 && <span className="text-[9px] text-slate-400">+{events.length - 2} más</span>}</span>{events.length > 0 && <i className="mt-1 block h-1 w-1 rounded-full bg-[#A1805E] sm:hidden" />}</button>; })}</div>
                <div className="mt-2 flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 pb-2"><button type="button" disabled={!caseRecords.length} onClick={() => { setNewTask({ title: "", caseId: "", owner: activeUser, priority: "Media", dueDate: calendarSelectedDate }); setShowNewTask(true); }} className="border border-slate-300 px-3 py-1.5 text-xs text-[#10263C] disabled:opacity-40">+ Tarea para este día</button><button type="button" disabled={!caseRecords.length} onClick={() => { setCalendarAlertDraft({ caseId: "", title: "", owner: activeUser }); setShowCalendarAlert((open) => !open); }} className="bg-[#10263C] px-3 py-1.5 text-xs text-white disabled:opacity-40">+ Alerta para este día</button></div>
                {showCalendarAlert && <form onSubmit={createCalendarAlert} className="grid gap-2 border-b border-slate-200 bg-slate-50 px-3 py-3 sm:grid-cols-2"><p className="text-xs font-semibold text-slate-800 sm:col-span-2">Nueva alerta · {calendarSelectedDate}</p><label className="text-[11px] text-slate-600 sm:col-span-2">Asunto<input autoFocus required value={calendarAlertDraft.title} onChange={(event) => setCalendarAlertDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Ej. Revisar respuesta de Colpensiones" className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs" /></label><label className="text-[11px] text-slate-600">Expediente<select required value={calendarAlertDraft.caseId} onChange={(event) => setCalendarAlertDraft((current) => ({ ...current, caseId: event.target.value }))} className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs"><option value="">Elegir expediente...</option>{caseRecords.map((item) => <option key={item.id} value={item.id}>{item.client} · {item.type}</option>)}</select></label><label className="text-[11px] text-slate-600">Responsable<select value={calendarAlertDraft.owner} onChange={(event) => setCalendarAlertDraft((current) => ({ ...current, owner: event.target.value }))} className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs"><option>Juan Valencia</option><option>Luis Hernando Barrios</option></select></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setShowCalendarAlert(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancelar</button><button className="bg-[#10263C] px-3 py-1.5 text-xs text-white">Guardar alerta</button></div></form>}
                <div className="mt-2 border-t border-slate-200"><h3 className="py-2 text-xs font-semibold">Agenda · {new Date(`${calendarSelectedDate}T00:00:00`).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</h3>{visibleCalendarEvents.filter((entry) => entry.date === calendarSelectedDate).map((entry, index) => <button key={`${entry.caseId}-${index}`} onClick={() => { setSelectedCaseId(entry.caseId); setCaseTab(entry.kind === "Tarea" ? "Tareas" : "Propiedades"); }} className="flex w-full justify-between border-t border-slate-100 py-2 text-left text-xs hover:bg-slate-50"><span>{entry.title}</span><span className="text-[10px] text-slate-500">{entry.kind}</span></button>)}{!visibleCalendarEvents.some((entry) => entry.date === calendarSelectedDate) && <p className="py-4 text-xs text-slate-400">No hay eventos para esta fecha.</p>}</div>
                {filter !== "Hoy" && undatedCases.length > 0 && <div className="mt-2 border-t border-slate-200 pt-2"><h3 className="text-xs font-semibold text-slate-800">Expedientes sin fechas programadas <span className="font-normal text-slate-500">({undatedCases.length})</span></h3><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">{undatedCases.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedCaseId(item.id); setCaseTab("Propiedades"); }} className="text-left text-[11px] text-[#315875] hover:underline">{item.client}</button>)}</div></div>}
              </div>
            ) : activeSection === "pagos" ? (
              <div className="overflow-x-auto"><table className="bv-payment-table w-full min-w-[850px] text-left"><thead className="border-b border-slate-200 bg-[#f2f4f6] text-[10px] uppercase text-slate-500"><tr>{["Cliente / caso", "Honorarios", "Pagado", "Saldo", "Último pago", ""].map((heading) => <th key={heading} className="px-2 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{paymentCases.map((item) => { const latest = payments.filter((payment) => payment.caseId === item.id).sort((a, b) => b.date.localeCompare(a.date))[0]; const paid = amountValue(item.paid); const fees = amountValue(item.fees); return <tr key={item.id}><td className="px-2 py-2"><button onClick={() => { setSelectedCaseId(item.id); setCaseTab("Pagos"); }} className="text-left text-xs font-medium hover:underline">{item.client}</button><span className="block text-[10px] text-slate-500">{item.type} · {item.id}</span></td><td className="px-2 py-2 text-xs">{fees ? formatCOP(fees) : <input aria-label={`Honorarios de ${item.client}`} defaultValue={item.fees} onBlur={(event) => updateCase(item.id, { fees: event.currentTarget.value }, "Actualizó honorarios", event.currentTarget.value)} placeholder="Definir honorarios" className="h-7 w-32 border border-slate-200 px-1" />}</td><td className="px-2 py-2 text-xs">{formatCOP(paid)}</td><td className="px-2 py-2 text-xs">{formatCOP(Math.max(0, fees - paid))}</td><td className="px-2 py-2 text-xs">{latest?.date ?? "Sin pagos"}</td><td className="px-2 py-2"><button onClick={() => { setPaymentForm({ caseId: item.id, amount: "", date: localDateKey(new Date()), note: "" }); setPaymentOpen(true); }} className="border border-slate-300 px-2 py-1 text-[10px]">Registrar abono</button></td></tr>; })}{paymentCases.length === 0 && <tr><td colSpan={6} className="px-2 py-4 text-center text-xs text-slate-500">No hay casos para estos filtros.</td></tr>}</tbody></table></div>
            ) : activeSection === "actividad" ? (
              <div className="divide-y divide-slate-200">{visibleActivity.map((entry) => <article key={entry.historyKey} className="flex justify-between gap-3 py-3"><div className="min-w-0"><p className="text-[10px] text-slate-500">{entry.at} · {entry.by}</p><p className="mt-1 text-xs font-semibold">{entry.action} · {entry.archived ? <span className="text-slate-500">{entry.caseName} (eliminado)</span> : <button onClick={() => { setSelectedCaseId(entry.caseId); setCaseTab("Historial"); }} className="text-[#315875] hover:underline">{entry.caseName}</button>}</p><p className="mt-0.5 whitespace-pre-line text-xs text-slate-600">{entry.detail}</p></div>{!entry.archived && entry.undo && (entry.action !== "Registró pago" || entry.undo.paymentId) && (entry.action !== "Creó tarea" || entry.undo.taskCreateId) && (entry.action !== "Completó tarea" && entry.action !== "Reabrió tarea" || entry.undo.taskState) && <button onClick={() => undoActivity(entry.caseId, entry.timestamp)} className="h-7 shrink-0 border border-slate-300 px-2 text-[10px]">Deshacer</button>}</article>)}{visibleActivity.length === 0 && <p className="py-4 text-xs text-slate-500">No hay movimientos para estos filtros.</p>}</div>
            ) : activeSection === "tareas" ? (
              <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-slate-200 bg-[#f2f4f6] text-[10px] uppercase text-slate-500"><tr>{["", "Tarea", "Caso vinculado", "Responsable", "Prioridad", "Fecha límite", "Estado"].map((heading) => <th key={heading} className="px-2.5 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleTasks.map((task) => { const linkedCase = caseRecords.find((item) => item.id === task.caseId); return <tr key={task.id} className={cn("hover:bg-slate-50", task.done && "text-slate-400")}><td className="w-8 px-2.5 py-2"><input type="checkbox" checked={task.done} aria-label={task.done ? "Marcar tarea pendiente" : "Completar tarea"} onChange={(event) => toggleTask(task, event.target.checked)} /></td><td className={cn("max-w-64 truncate px-2.5 py-2 text-xs font-medium", task.done ? "line-through" : "text-slate-900")}>{task.title}</td><td className="px-2.5 py-2"><button onClick={() => { if (linkedCase) { setSelectedCaseId(linkedCase.id); setCaseTab("Propiedades"); } }} className="max-w-52 truncate text-left text-xs text-[#315875] hover:underline">{linkedCase?.client ?? "Caso eliminado"}</button></td><td className="px-2.5 py-2 text-xs text-slate-600">{task.owner}</td><td className="px-2.5 py-2 text-xs text-slate-600">{task.priority}</td><td className="px-2.5 py-2 text-xs text-slate-600">{task.dueDate || "Sin fecha"}</td><td className="px-2.5 py-2 text-xs text-slate-500">{task.done ? `Completada${task.completedBy ? ` por ${task.completedBy}` : ""}` : "Pendiente"}</td></tr>; })}{visibleTasks.length === 0 && <tr><td colSpan={7} className="px-3 py-4 text-center text-xs text-slate-500">{tasks.length ? "No hay tareas para estos filtros." : "Todavía no hay tareas."} <button onClick={() => setShowNewTask(true)} className="ml-1 font-medium text-[#315875] hover:underline">Crear tarea</button></td></tr>}</tbody></table></div>
            ) : activeSection === "inicio" ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 py-2"><h2 className="text-sm font-semibold text-slate-900">Casos que requieren seguimiento</h2><button onClick={() => openHomeMetric("Inicio: atención")} className="text-[11px] font-medium text-[#315875]">Ver todos <span aria-hidden="true">→</span></button></div>
                <div className="divide-y divide-slate-100">{displayHomeCases.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedCaseId(item.id); setCaseTab("Propiedades"); }} className="grid w-full gap-1 py-3 text-left hover:bg-slate-50 sm:grid-cols-[minmax(180px,1.2fr)_minmax(160px,1fr)_minmax(140px,1fr)_110px] sm:items-center"><span className="truncate text-xs font-semibold text-slate-900">{item.client}</span><span className="truncate text-xs text-slate-600">{item.type}</span><span className="truncate text-xs text-slate-500">{item.alert !== "Sin alerta" ? item.alert : isDueSoon(item) ? "Vence pronto" : !item.history.length ? "Sin actividad" : "Revisar expediente"}{item.alertDate ? ` · ${item.alertDate}` : item.dueDate ? ` · ${item.dueDate}` : ""}</span><span className="justify-self-start px-1.5 py-1 text-[10px] text-slate-700 sm:justify-self-end" style={{ backgroundColor: statusColors[item.status] ?? "#e2e8f0" }}>{item.status}</span></button>)}{displayHomeCases.length === 0 && <p className="py-4 text-center text-xs text-slate-500">No hay casos que coincidan con estos filtros.</p>}</div>
              </div>
            ) : activeSection === "estadisticas" ? (
              <div className="grid gap-x-5 lg:grid-cols-2">
                <DistributionPie title="Casos por tipo" totalLabel={`${statisticsCases.length} expedientes`} entries={statistics.typeFinance.map((item) => ({ label: item.name, value: item.count }))} />
                <DistributionPie title="Recaudo por tipo" totalLabel="Participación del cobrado" entries={statistics.typeFinance.map((item) => ({ label: item.name, value: item.paid }))} formatValue={formatCOP} />
                <DistributionPie title="Recaudo por contraparte" totalLabel="Participación del cobrado" entries={statistics.counterpartyFinance.map((item) => ({ label: item.name, value: item.paid }))} formatValue={formatCOP} />
                <section className="border-b border-slate-200 py-3 lg:col-span-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-sm font-semibold text-slate-900">Recaudo por tipo de caso</h2><span className="text-[10px] text-slate-500">Ordenado por dinero cobrado</span></div>
                  <div className="mt-2 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[11px]"><thead className="border-b border-slate-200 bg-[#f2f4f6] text-[10px] uppercase text-slate-500"><tr>{["Tipo de caso", "Casos", "Honorarios", "Cobrado", "Saldo", "Promedio cobrado", "Abonos"].map((heading) => <th key={heading} className="px-2 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{statistics.typeFinance.map((item, index) => <tr key={item.name}><td className="px-2 py-2 font-medium text-slate-800">{index === 0 && item.paid > 0 && <span className="mr-1 text-[#A1805E]">●</span>}{item.name}</td><td className="px-2 py-2 tabular-nums">{item.count}</td><td className="px-2 py-2 tabular-nums">{formatCOP(item.fees)}</td><td className="px-2 py-2 font-semibold tabular-nums text-[#10263C]">{formatCOP(item.paid)}</td><td className="px-2 py-2 tabular-nums">{formatCOP(item.balance)}</td><td className="px-2 py-2 tabular-nums">{formatCOP(item.averagePaid)}</td><td className="px-2 py-2 tabular-nums">{item.paymentCount}</td></tr>)}{!statistics.typeFinance.length && <tr><td colSpan={7} className="px-2 py-4 text-slate-500">No hay casos para estos filtros.</td></tr>}</tbody></table></div>
                  <p className="mt-2 text-[10px] text-slate-500">Cobrado refleja el total pagado de cada expediente; para medir ganancia neta faltaría registrar costos.</p>
                </section>
                <section className="border-b border-slate-200 py-3 lg:border-r lg:pr-5"><div className="flex items-baseline justify-between"><h2 className="text-sm font-semibold text-slate-900">Casos por estado</h2><span className="text-[11px] text-slate-400">{statisticsCases.length} expedientes</span></div><div className="mt-2 flex flex-wrap items-center gap-3"><div className="relative h-28 w-28 shrink-0" role="img" aria-label="Gráfico circular de casos por estado" style={{ background: statisticsCases.length ? `conic-gradient(${statistics.gradient})` : "#e2e8f0", borderRadius: "50%" }}><div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-[#f8f9fa]"><span className="text-2xl font-semibold text-slate-900">{statisticsCases.length}</span><span className="text-[10px] text-slate-500">casos</span></div></div><div className="min-w-[180px] flex-1 space-y-2">{statistics.statusCounts.map((item) => <div key={item.status} className="flex items-center justify-between gap-3 text-xs"><span className="flex min-w-0 items-center gap-2 text-slate-600"><i className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: item.color }} /> <span className="truncate">{item.status}</span></span><span className="font-medium text-slate-800">{item.count}</span></div>)}{!statistics.statusCounts.length && <p className="text-xs text-slate-400">No hay casos para estos filtros.</p>}</div></div></section>
                <section className="border-b border-slate-200 py-3 lg:pl-1"><h2 className="text-sm font-semibold text-slate-900">Casos activos por responsable</h2><div className="mt-2 space-y-2">{statistics.owners.map((item, index) => <div key={item.owner}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">{item.owner}</span><span className="font-semibold text-slate-900">{item.count}</span></div><div className="h-2 w-full bg-slate-100"><div className="h-full" style={{ width: `${statistics.open ? Math.max(3, (item.count / statistics.open) * 100) : 0}%`, backgroundColor: index === 0 ? "#315875" : "#A1805E" }} /></div></div>)}</div><p className="mt-2 text-[10px] text-slate-400">Un expediente con dos responsables cuenta para ambos.</p></section>
                <section className="border-b border-slate-200 py-3 lg:col-span-2"><h2 className="text-sm font-semibold text-slate-900">Recaudo por contraparte</h2><div className="mt-2 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-[11px]"><thead className="border-b border-slate-200 bg-[#f2f4f6] text-[10px] uppercase text-slate-500"><tr>{["Contraparte", "Casos", "Honorarios", "Cobrado", "Saldo"].map((heading) => <th key={heading} className="px-2 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{statistics.counterpartyFinance.map((item) => <tr key={item.name}><td className="px-2 py-2 text-slate-800">{item.name}</td><td className="px-2 py-2 tabular-nums">{item.count}</td><td className="px-2 py-2 tabular-nums">{formatCOP(item.fees)}</td><td className="px-2 py-2 font-medium tabular-nums">{formatCOP(item.paid)}</td><td className="px-2 py-2 tabular-nums">{formatCOP(item.balance)}</td></tr>)}{!statistics.counterpartyFinance.length && <tr><td colSpan={5} className="px-2 py-4 text-slate-500">No hay casos para estos filtros.</td></tr>}</tbody></table></div></section>
                <section className="border-b border-slate-200 py-3 lg:col-span-2"><h2 className="text-sm font-semibold text-slate-900">Honorarios y pagos por caso</h2><div className="mt-2 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-[11px]"><thead className="border-b border-slate-200 bg-[#f2f4f6] text-[10px] uppercase text-slate-500"><tr>{["Cliente", "Tipo", "Honorarios", "Cobrado", "Saldo"].map((heading) => <th key={heading} className="px-2 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{statistics.finance.map((item) => <tr key={item.id}><td className="px-2 py-2 text-slate-800">{item.name}</td><td className="px-2 py-2 text-slate-600">{item.type}</td><td className="px-2 py-2 tabular-nums">{formatCOP(item.fees)}</td><td className="px-2 py-2 font-medium tabular-nums">{formatCOP(item.paid)}</td><td className="px-2 py-2 tabular-nums">{formatCOP(Math.max(0, item.fees - item.paid))}</td></tr>)}{!statistics.finance.length && <tr><td colSpan={5} className="px-2 py-4 text-slate-500">Registra honorarios o pagos para ver estos importes.</td></tr>}</tbody></table></div></section>
              </div>
            ) : activeSection === "casos" ? (
              caseView === "Estadisticas" ? <div className="grid gap-x-10 sm:grid-cols-2">{statuses.filter((status) => visibleCases.some((item) => item.status === status)).map((status) => { const count = visibleCases.filter((item) => item.status === status).length; return <div key={status} className="flex items-center gap-3 border-b border-slate-100 py-2"><span className="w-48 truncate text-xs text-slate-600">{status}</span><span className="h-2" style={{ backgroundColor: statusColors[status], width: `${Math.max(6, count * 25)}px` }} /><span className="text-xs text-slate-500">{count}</span></div>; })}</div> : caseView === "Tablero" ? <div className="flex gap-4 overflow-x-auto py-3">{statuses.filter((status) => visibleCases.some((item) => item.status === status)).map((status) => <section key={status} className="w-60 shrink-0"><h2 className="border-b border-slate-200 py-2 text-xs font-semibold text-slate-700"><span className="mr-1.5 inline-block h-2 w-2" style={{ backgroundColor: statusColors[status] }} />{status}<span className="ml-2 font-normal text-slate-400">{visibleCases.filter((item) => item.status === status).length}</span></h2>{visibleCases.filter((item) => item.status === status).map((item) => <button key={item.id} onClick={() => { setSelectedCaseId(item.id); setCaseTab("Propiedades"); }} className="block w-full border-b border-slate-100 py-2 text-left"><span className="text-xs font-medium text-slate-800">{item.client}</span><span className="mt-0.5 block text-[10px] text-slate-500">{item.type} · {item.owners.join(", ")}</span></button>)}</section>)}</div> : <CaseListTable cases={visibleCases} fields={caseFields} columnOrder={resolvedCaseColumnOrder} counterparties={counterparties} processTypes={processTypes} statuses={statuses} statusColors={statusColors} onOpen={(id) => { setSelectedCaseId(id); setCaseTab("Propiedades"); }} onOpenTab={openCaseTab} onCaseFieldChange={updateTableCaseField} onStatusChange={requestStatusChange} onCustomValueChange={updateCustomValue} onMoveColumn={(sourceId, targetId) => setCaseColumnOrder(moveCaseColumn(resolvedCaseColumnOrder, sourceId, targetId))} />
            ) : activeSection === "clientes" ? (
              <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#10263C] text-[10px] uppercase text-white"><tr>{["Cliente", "Cédula", "Celular", "Correo", "Expedientes"].map((heading) => <th key={heading} className="px-2.5 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{clients.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-2.5 py-2"><button onClick={() => { setSelectedCaseId(item.id); setCaseTab("Datos del cliente"); }} className="text-left text-xs font-medium text-[#315875] hover:underline">{item.client}</button></td><td className="px-2.5 py-2 text-xs">{item.nationalId || "—"}</td><td className="px-2.5 py-2 text-xs">{item.phone || "—"}</td><td className="px-2.5 py-2 text-xs">{item.email || "—"}</td><td className="px-2.5 py-2"><button onClick={() => { setSelectedCaseId(item.id); setCaseTab("Propiedades"); }} className="text-xs text-[#315875] hover:underline">{caseRecords.filter((record) => (record.nationalId || record.client) === (item.nationalId || item.client)).length} · Abrir expediente</button></td></tr>)}{clients.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-500">No hay clientes registrados. Crea un caso para registrar un cliente.</td></tr>}</tbody></table></div>
            ) : activeSection === "documentos" ? (
              <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-[#10263C] text-[10px] uppercase text-white"><tr>{["Expediente", "Tipo de proceso", "Documentos", "Carpeta", "Acción"].map((heading) => <th key={heading} className="px-2.5 py-2 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{documentCases.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-2.5 py-2"><button onClick={() => { setSelectedCaseId(item.id); setCaseTab("Documentos"); }} className="text-left text-xs font-medium text-[#315875] hover:underline">{item.client}</button></td><td className="px-2.5 py-2 text-xs">{item.type}</td><td className="px-2.5 py-2 text-xs tabular-nums text-slate-600">{documents.filter((document) => document.caseId === item.id).length}</td><td className="px-2.5 py-2 text-xs text-slate-500">{item.driveUrl ? "Carpeta vinculada" : "Sin carpeta"}</td><td className="px-2.5 py-2"><button onClick={() => { setSelectedCaseId(item.id); setCaseTab("Documentos"); }} className="text-xs text-[#315875] hover:underline">{item.driveUrl ? "Abrir expediente" : "Vincular carpeta"}</button></td></tr>)}{documentCases.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-500">No hay expedientes para estos filtros.</td></tr>}</tbody></table></div>
            ) : activeSection === "configuracion" ? (
              <ConfigurationPanel
                cases={caseRecords}
                documents={documents}
                statuses={statuses}
                statusColors={statusColors}
                processTypes={processTypes}
                counterparties={counterparties}
                documentCategories={documentCategories}
                caseFields={caseFields}
                activeUser={activeUser}
                setActiveUser={setActiveUser}
                onStatusColorChange={(status, color) => setStatusColors((current) => ({ ...current, [status]: color }))}
                onAddStatus={(name, color) => { setStatuses((current) => [...current, name]); setStatusColors((current) => ({ ...current, [name]: color })); }}
                onAddType={(name) => setProcessTypes((current) => [...current, name])}
                onAddCounterparty={(name) => setCounterparties((current) => [...current, name])}
                onAddDocumentCategory={(name) => setDocumentCategories((current) => [...current, name])}
                onAddCaseField={(name, type, options) => setCaseFields((current) => current.some((field) => field.name.toLocaleLowerCase() === name.toLocaleLowerCase()) ? current : [...current, { id: `CF-${window.crypto.randomUUID()}`, name, type, options }])}
                onAddCaseFieldOption={(id, option) => setCaseFields((current) => current.map((field) => field.id !== id || field.options.some((value) => value.toLocaleLowerCase() === option.toLocaleLowerCase()) ? field : { ...field, options: [...field.options, option] }))}
                onDeleteCaseField={deleteCustomField}
                onDownloadBackup={downloadLocalBackup}
                isCloud={Boolean(cloudSnapshot)}
              />
            ) : null}
          </section>

          {activeSection === "inicio" && <section className="mt-5 border-t border-slate-200 pt-3"><h2 className="text-sm font-semibold text-slate-900">Plazos y actuaciones a vigilar</h2><div className="mt-2 divide-y divide-slate-100">{scopedCases.filter((item) => item.status !== "Cerrado" && (isDueSoon(item) || isAlertDueSoon(item))).sort((a, b) => (a.dueDate || a.alertDate).localeCompare(b.dueDate || b.alertDate)).map((item) => <button key={item.id} onClick={() => { setSelectedCaseId(item.id); setCaseTab("Propiedades"); }} className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 text-left hover:bg-slate-50"><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-900">{item.client} · {item.deadlineLabel || "Plazo del proceso"}</span><span className="mt-0.5 block text-[11px] text-slate-600">{item.alertMessage || item.alert || "Revisar el siguiente paso del proceso"}</span></span><span className="shrink-0 text-[10px] text-slate-500">Límite: {item.dueDate || "Sin fecha límite"}{item.alertDate ? ` · Aviso: ${item.alertDate}` : ""}</span></button>)}{!scopedCases.some((item) => item.status !== "Cerrado" && (isDueSoon(item) || isAlertDueSoon(item))) && <p className="py-4 text-xs text-slate-400">No hay plazos ni alertas próximos para revisar.</p>}</div></section>}

          {activeSection === "inicio" && scopedCases.length > 0 && <section className="mt-3 border-t border-slate-200 pt-2"><h2 className="text-xs font-semibold text-slate-800">Expedientes recientes</h2><div className="mt-1 divide-y divide-slate-100">{scopedCases.slice(0, 5).map((item) => <button key={item.id} type="button" onClick={() => { setSelectedCaseId(item.id); setCaseTab("Propiedades"); }} className="flex w-full flex-wrap items-center justify-between gap-2 py-1.5 text-left hover:bg-slate-50"><span className="text-xs text-slate-800">{item.client} <span className="text-slate-500">· {item.type}</span></span><span className="text-[10px] text-slate-500">{item.status}</span></button>)}</div></section>}
          {activeSection === "casos" && visibleCases.some((item) => tasks.some((task) => task.caseId === item.id && !task.done)) && <section className="mt-3 border-t border-slate-200 pt-2"><h2 className="text-xs font-semibold text-slate-800">Tareas pendientes por expediente</h2><div className="mt-1 divide-y divide-slate-100">{visibleCases.map((item) => { const pending = tasks.filter((task) => task.caseId === item.id && !task.done); return pending.length ? <button key={item.id} onClick={() => { setSelectedCaseId(item.id); setCaseTab("Tareas"); }} className="flex w-full items-center justify-between gap-2 py-1.5 text-left hover:bg-slate-50"><span className="min-w-0 truncate text-xs text-slate-800">{item.client}</span><span className="shrink-0 text-[10px] text-[#315875]">{pending.length} pendiente{pending.length === 1 ? "" : "s"} · {pending[0].title}</span></button> : null; })}</div></section>}


        </main>
      </div>

      {activeSection === "casos" && caseView === "Lista" && <div ref={fixedCaseScrollRef} aria-label="Desplazamiento horizontal de la tabla de casos" role="region" className="fixed bottom-0 z-30 h-5 overflow-x-auto border-t border-slate-300 bg-white shadow-[0_-2px_6px_rgba(15,23,42,0.08)]"><div style={{ width: caseTableWidth, height: 1 }} /></div>}

      {showNewTask && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/30 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewTask(false); }}><form onSubmit={createTask} className="w-full max-w-lg border border-slate-200 bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><div><h2 className="text-sm font-semibold text-slate-900">Nueva tarea</h2><p className="mt-0.5 text-[11px] text-slate-500">Asóciala con uno de los casos existentes.</p></div><button type="button" onClick={() => setShowNewTask(false)} aria-label="Cerrar" className="text-lg leading-none text-slate-500">×</button></div><div className="grid gap-3 p-4 sm:grid-cols-2"><label className="text-xs text-slate-600 sm:col-span-2">Tarea<input autoFocus required list="bv-task-title-options" value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-900 outline-none focus:border-[#A1805E]" placeholder="Buscar o escribir una tarea, ej. Presentar demanda" /><datalist id="bv-task-title-options">{taskTitleOptions.map((title) => <option key={title} value={title} />)}</datalist></label><label className="text-xs text-slate-600 sm:col-span-2">Caso relacionado<select required value={newTask.caseId} onChange={(event) => setNewTask({ ...newTask, caseId: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800"><option value="">Elegir un expediente...</option>{caseRecords.map((item) => <option key={item.id} value={item.id}>{item.client} · {item.type} · {item.status}</option>)}</select></label><label className="text-xs text-slate-600">Responsable<select value={newTask.owner} onChange={(event) => setNewTask({ ...newTask, owner: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800"><option>Juan Valencia</option><option>Luis Hernando Barrios</option></select></label><label className="text-xs text-slate-600">Prioridad<select value={newTask.priority} onChange={(event) => setNewTask({ ...newTask, priority: event.target.value as TaskRecord["priority"] })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800"><option>Alta</option><option>Media</option><option>Baja</option></select></label><label className="text-xs text-slate-600 sm:col-span-2">Fecha límite<input type="date" value={newTask.dueDate} onChange={(event) => setNewTask({ ...newTask, dueDate: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label></div><div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3"><button type="button" onClick={() => setShowNewTask(false)} className="px-3 py-2 text-xs text-slate-600">Cancelar</button><button disabled={!caseRecords.length} className="bg-[#10263C] px-3 py-2 text-xs font-medium text-white disabled:opacity-40">Crear tarea</button></div></form></div>}

      {showNewCase && <div className="fixed inset-0 z-[60] bg-slate-950/30" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewCase(false); }}><form onSubmit={createCase} className="absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col border-l border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-3"><div><p className="text-[10px] uppercase text-slate-400">Expediente nuevo</p><h2 className="text-base font-semibold text-slate-900">Datos del caso y del cliente</h2></div><button type="button" onClick={() => setShowNewCase(false)} aria-label="Cerrar" className="flex h-8 w-8 items-center justify-center text-xl text-slate-500">×</button></div><div className="flex-1 overflow-y-auto px-5 py-4"><section className="border-b border-slate-200 pb-4"><h3 className="text-xs font-semibold text-slate-800">Información del expediente</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-600 sm:col-span-2">Nombre completo del cliente<input autoFocus required value={newCase.client} onChange={(event) => setNewCase({ ...newCase, client: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-900 outline-none focus:border-[#A1805E]" placeholder="Nombres y apellidos" /></label><label className="text-xs text-slate-600">Contraparte<select value={newCase.counterparty} onChange={(event) => setNewCase({ ...newCase, counterparty: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800">{counterparties.map((counterparty) => <option key={counterparty}>{counterparty}</option>)}</select></label><label className="text-xs text-slate-600">Estado inicial<select value={newCase.status} onChange={(event) => setNewCase({ ...newCase, status: event.target.value })} style={{ backgroundColor: statusColors[newCase.status] }} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className="text-xs text-slate-600 sm:col-span-2">Tipo de proceso<select value={newCase.type} onChange={(event) => setNewCase({ ...newCase, type: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800">{processTypes.map((type) => <option key={type}>{type}</option>)}</select></label><div className="flex gap-2 sm:col-span-2"><input value={processTypeDraft} onChange={(event) => setProcessTypeDraft(event.target.value)} className="h-8 min-w-0 flex-1 border border-slate-300 px-2 text-xs" placeholder="Agregar otro tipo de proceso"/><button type="button" onClick={() => { const type = processTypeDraft.trim(); if (type && !processTypes.some((item) => item.toLocaleLowerCase() === type.toLocaleLowerCase())) { setProcessTypes((items) => [...items, type]); setNewCase((item) => ({ ...item, type })); setProcessTypeDraft(""); } }} className="border border-slate-300 px-3 text-xs text-slate-700">+ Agregar tipo</button></div><label className="text-xs text-slate-600 sm:col-span-2">Responsable principal<select value={newCase.owner} onChange={(event) => setNewCase({ ...newCase, owner: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800"><option>Juan Valencia</option><option>Luis Hernando Barrios</option></select></label></div></section><section className="py-4"><h3 className="text-xs font-semibold text-slate-800">Identificación y contacto</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-600">Cédula<input required value={newCase.nationalId} onChange={(event) => setNewCase({ ...newCase, nationalId: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" placeholder="Número de documento" /></label><label className="text-xs text-slate-600">Celular del cliente<input required type="tel" value={newCase.phone} onChange={(event) => setNewCase({ ...newCase, phone: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" placeholder="Número de contacto" /></label><label className="text-xs text-slate-600 sm:col-span-2">Correo electrónico<input type="email" value={newCase.email} onChange={(event) => setNewCase({ ...newCase, email: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" placeholder="correo@ejemplo.com" /></label></div></section><section className="border-t border-slate-200 py-4"><h3 className="text-xs font-semibold text-slate-800">Contacto de familiar cercano</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-600 sm:col-span-2">Nombre del familiar<input value={newCase.relativeName} onChange={(event) => setNewCase({ ...newCase, relativeName: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" placeholder="Nombre y apellidos" /></label><label className="text-xs text-slate-600">Celular del familiar<input type="tel" value={newCase.relativePhone} onChange={(event) => setNewCase({ ...newCase, relativePhone: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" placeholder="Número de contacto" /></label><label className="text-xs text-slate-600">Parentesco<select value={newCase.relativeRelationship} onChange={(event) => setNewCase({ ...newCase, relativeRelationship: event.target.value })} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800"><option value="">Seleccionar parentesco</option><option>Madre</option><option>Padre</option><option>Hijo/a</option><option>Hermano/a</option><option>Cónyuge</option><option>Otro familiar</option><option>Otro</option></select></label></div></section>{caseFields.length > 0 && <section className="border-t border-slate-200 py-4"><h3 className="text-xs font-semibold text-slate-800">Campos personalizados</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{caseFields.map((field) => <label key={field.id} className="text-xs text-slate-600">{field.name}{field.type === "select" ? <select value={newCaseCustomValues[field.id] ?? ""} onChange={(event) => setNewCaseCustomValues((current) => ({ ...current, [field.id]: event.target.value }))} className="mt-1 h-9 w-full border border-slate-300 bg-white px-2 text-sm"><option value="">Sin definir</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={field.type} step={field.type === "number" ? "any" : undefined} value={newCaseCustomValues[field.id] ?? ""} onChange={(event) => setNewCaseCustomValues((current) => ({ ...current, [field.id]: event.target.value }))} className="mt-1 h-9 w-full border border-slate-300 px-2 text-sm" />}</label>)}</div></section>}</div><div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3"><button type="button" onClick={() => setShowNewCase(false)} className="px-3 py-2 text-xs text-slate-600">Cancelar</button><button className="bg-[#10263C] px-3 py-2 text-xs font-medium text-white">Crear y abrir expediente</button></div></form></div>}

      {casePendingDeletion && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteCaseId(null); }}><div role="alertdialog" aria-modal="true" aria-labelledby="delete-case-title" className="w-full max-w-md border border-slate-200 bg-white p-5 shadow-xl"><h2 id="delete-case-title" className="text-sm font-semibold text-slate-900">Eliminar expediente</h2><p className="mt-2 text-xs leading-5 text-slate-600">Se retirará <strong>{casePendingDeletion.client}</strong> de los casos activos junto con sus tareas, alertas, pagos y documentos vinculados. La eliminación y el historial anterior quedarán en Actividad.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteCaseId(null)} className="border border-slate-300 px-3 py-2 text-xs">Cancelar</button><button type="button" onClick={() => deleteCase(casePendingDeletion.id)} className="bg-red-700 px-3 py-2 text-xs font-medium text-white hover:bg-red-800">Eliminar caso</button></div></div></div>}
      {selectedCase && <div className="fixed inset-0 z-[55] bg-slate-950/25" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCaseId(null); }}><aside role="dialog" aria-modal="true" aria-label={`Expediente de ${selectedCase.client}`} className="absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col border-l border-slate-200 bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-4 py-2"><div className="text-[11px] text-slate-500">Casos <span className="mx-1">/</span> {selectedCase.id}</div><div className="flex items-center gap-2"><button type="button" onClick={() => setDeleteCaseId(selectedCase.id)} className="px-2 py-1 text-[11px] text-red-700 hover:bg-red-50">Eliminar caso</button><button onClick={() => setSelectedCaseId(null)} aria-label="Cerrar ficha" className="flex h-8 w-8 items-center justify-center text-xl text-slate-500 hover:bg-slate-100">×</button></div></div><div className="overflow-y-auto px-5 py-4"><p className="text-[10px] font-medium uppercase text-slate-400">Expediente juridico</p><h2 className="mt-1 break-words text-xl font-semibold text-slate-900">{selectedCase.client}</h2><div className="mt-1 text-xs text-slate-500">{selectedCase.type} · {selectedCase.counterparty}</div>
        <div className="mt-4 grid gap-x-5 border-y border-slate-200 py-3 sm:grid-cols-2">{[["Alerta", selectedCase.alert], ["Estado", selectedCase.status], ["Honorarios", selectedCase.fees || "Vacío"], ["Pagado", selectedCase.paid || "Vacío"], ["Responsable", selectedCase.owners.join(", ") || "Vacío"], ["Vencimiento", selectedCase.dueDate || "Sin fecha"], ["Última actividad", selectedCase.history[0]?.at || "Sin actividad"]].map(([label, value]) => <div key={label} className="flex min-h-8 items-center gap-2 border-b border-slate-100 text-xs"><span className="w-28 shrink-0 text-slate-500">{label}</span>{label === "Estado" ? <select value={selectedCase.status} onChange={(event) => requestStatusChange(selectedCase.id, event.target.value)} style={{ backgroundColor: statusColors[selectedCase.status] ?? "#e2e8f0" }} className="min-w-0 border-0 px-1.5 py-1 text-xs text-slate-700 outline-none">{statuses.map((status) => <option key={status}>{status}</option>)}</select> : <span className="min-w-0 truncate text-slate-800">{label === "Alerta" && selectedCase.alertDate ? `${value} · ${selectedCase.alertDate}` : value}</span>}</div>)}</div>
        <div className="mt-4 flex flex-wrap border-b border-slate-200">{["Propiedades", "Historial", "Documentos", "Tareas", "Pagos", "Datos del cliente"].map((tab) => <button key={tab} onClick={() => setCaseTab(tab)} className={cn("border-b-2 px-2 py-2 text-[11px]", caseTab === tab ? "border-[#315875] font-medium text-[#10263C]" : "border-transparent text-slate-500")}>{tab}</button>)}</div>
        {caseTab === "Propiedades" && <div className="space-y-4 py-4"><section><h3 className="text-sm font-semibold text-slate-800">Anotaciones</h3>{selectedCase.notes.length ? <div className="mt-2 space-y-2">{selectedCase.notes.map((note, index) => <p key={`${index}-${note}`} className="border-l-2 border-[#A1805E] pl-3 text-xs leading-5 text-slate-600">{note}</p>)}</div> : <p className="mt-2 text-xs text-slate-400">Aún no hay anotaciones.</p>}<form onSubmit={addCaseNote} className="mt-3 space-y-2"><div className="grid gap-2 sm:grid-cols-2"><label className="text-[11px] text-slate-500">Fecha de la anotación<input type="date" required value={newNoteDate} onChange={(event) => setNewNoteDate(event.target.value)} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs" /></label><label className="text-[11px] text-slate-500">¿A qué refiere?<input required value={newNoteReference} onChange={(event) => setNewNoteReference(event.target.value)} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs" placeholder="Llamada, radicación, audiencia..." /></label></div><textarea required minLength={3} value={newNote} onChange={(event) => setNewNote(event.target.value)} rows={3} className="block w-full border border-slate-300 p-2 text-xs outline-none focus:border-[#A1805E]" placeholder="Escribe la anotación"/><div className="flex justify-end"><button className="bg-[#10263C] px-3 py-2 text-xs text-white">Guardar anotación</button></div></form></section><section><h3 className="text-sm font-semibold text-slate-800">Responsables</h3><div className="mt-2 flex gap-4">{["Juan Valencia", "Luis Hernando Barrios"].map((owner) => <label key={owner} className="flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" checked={selectedCase.owners.includes(owner)} onChange={(event) => { const owners = event.target.checked ? [...selectedCase.owners, owner] : selectedCase.owners.filter((item) => item !== owner); updateCase(selectedCase.id, { owners }, "Actualizo responsables", owners.join(", ") || "Sin responsable"); }} />{owner}</label>)}</div></section><section><h3 className="text-sm font-semibold text-slate-800">Datos del expediente</h3><div className="mt-2 grid gap-3 sm:grid-cols-2"><label className="text-[11px] text-slate-500">Fecha de vencimiento<input type="date" value={selectedCase.dueDate} onChange={(event) => updateCase(selectedCase.id, { dueDate: event.target.value })} onBlur={(event) => updateCase(selectedCase.id, {}, "Actualizo vencimiento", event.currentTarget.value || "Sin fecha")} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs text-slate-800" /></label><label className="text-[11px] text-slate-500">Honorarios acordados<input value={selectedCase.fees} onChange={(event) => updateCase(selectedCase.id, { fees: event.target.value })} onBlur={(event) => updateCase(selectedCase.id, {}, "Actualizo honorarios", event.currentTarget.value || "Vacio")} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs text-slate-800" placeholder="$" /></label><div className="text-[11px] text-slate-500">Total pagado<button type="button" onClick={() => setCaseTab("Pagos")} className="mt-1 block h-8 w-full border-b border-slate-200 text-left text-xs font-medium text-[#315875]">{formatCOP(amountValue(selectedCase.paid))} · Ver abonos</button></div></div></section></div>}
        {caseTab === "Propiedades" && <section className="border-t border-slate-200 py-4"><h3 className="text-sm font-semibold text-slate-800">Clasificación del caso</h3><div className="mt-2 grid gap-3 sm:grid-cols-2"><label className="text-[11px] text-slate-500">Contraparte<input defaultValue={selectedCase.counterparty} onBlur={(event) => updateCaseText(selectedCase.id, "counterparty", event.currentTarget.value, "contraparte")} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs text-slate-800" /></label><label className="text-[11px] text-slate-500">Tipo de proceso<select value={selectedCase.type} onChange={(event) => updateCaseText(selectedCase.id, "type", event.target.value, "tipo de proceso")} className="mt-1 block h-8 w-full border border-slate-300 bg-white px-2 text-xs text-slate-800">{processTypes.map((type) => <option key={type}>{type}</option>)}</select></label></div></section>}
        {caseTab === "Propiedades" && caseFields.length > 0 && <section className="border-t border-slate-200 py-4"><h3 className="text-sm font-semibold text-slate-800">Campos personalizados</h3><div className="mt-2 grid gap-3 sm:grid-cols-2">{caseFields.map((field) => <label key={field.id} className="text-[11px] text-slate-500">{field.name}<CustomCaseInput field={field} value={selectedCase.customValues?.[field.id] ?? ""} onSave={(value) => updateCustomValue(selectedCase.id, field, value)} ariaLabel={`${field.name} de ${selectedCase.client}`} /></label>)}</div></section>}
        {caseTab === "Propiedades" && <section id="bv-case-deadline" className="border-t border-slate-200 py-4"><h3 className="text-sm font-semibold text-slate-800">Alerta y recordatorio del proceso</h3><p className="mt-1 text-[11px] text-slate-500">Configura aquí el seguimiento del plazo y el recordatorio asociado a la anotación.</p><div className="mt-2 grid gap-3 sm:grid-cols-2"><label className="text-[11px] text-slate-600">Plazo / hito del proceso<input defaultValue={selectedCase.deadlineLabel ?? ""} onBlur={(event) => updateCase(selectedCase.id, { deadlineLabel: event.currentTarget.value }, "Actualizo hito del proceso", event.currentTarget.value || "Sin hito")} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs" placeholder="Ej. Vence término para presentar demanda" /></label><label className="text-[11px] text-slate-600">Fecha límite<input type="date" value={selectedCase.dueDate} onChange={(event) => updateCase(selectedCase.id, { dueDate: event.target.value }, "Actualizo fecha límite", event.target.value || "Sin fecha")} className="mt-1 block h-8 w-full border border-slate-300 bg-white px-2 text-xs" /></label><label className="text-[11px] text-slate-600">Nivel de atención<select value={selectedCase.alert} onChange={(event) => updateCase(selectedCase.id, { alert: event.target.value }, "Cambio nivel de atención", event.target.value)} className="mt-1 block h-8 w-full border border-slate-300 bg-white px-2 text-xs"><option>Sin alerta</option><option>Vence pronto</option><option>Vence hoy</option><option>En seguimiento</option><option>Atención prioritaria</option><option>Revisar con cuidado</option></select></label><label className="text-[11px] text-slate-600">Avisarme del plazo el<input type="date" value={selectedCase.alertDate ?? ""} onChange={(event) => updateCase(selectedCase.id, { alertDate: event.target.value }, "Actualizo fecha de alerta", event.target.value || "Sin fecha")} className="mt-1 block h-8 w-full border border-slate-300 bg-white px-2 text-xs" /></label><label className="text-[11px] text-slate-600">Recordarme esta anotación el<input type="date" value={newNoteReminderDate} onChange={(event) => setNewNoteReminderDate(event.target.value)} className="mt-1 block h-8 w-full border border-slate-300 bg-white px-2 text-xs" /></label><label className="text-[11px] text-slate-600 sm:col-span-2">Instrucción para Inicio<textarea defaultValue={selectedCase.alertMessage ?? ""} onBlur={(event) => updateCase(selectedCase.id, { alertMessage: event.currentTarget.value }, "Actualizo instrucción de alerta", event.currentTarget.value || "Sin instrucción")} rows={2} className="mt-1 block w-full border border-slate-300 p-2 text-xs" placeholder="Ej. Está por vencerse el plazo. Revisar la siguiente actuación y tener cuidado con el término." /></label></div></section>}
        {caseTab === "Propiedades" && <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4"><button type="button" onClick={() => applyAlertAsTask(selectedCase)} disabled={selectedCase.alert === "Sin alerta" && !selectedCase.alertDate && !selectedCase.dueDate && !selectedCase.deadlineLabel?.trim() && !selectedCase.alertMessage?.trim()} className="bg-[#10263C] px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">{tasks.some((task) => task.id === selectedCase.alertTaskId && task.caseId === selectedCase.id) ? "Actualizar tarea de alerta" : "Aplica como tarea"}</button>{tasks.some((task) => task.id === selectedCase.alertTaskId && task.caseId === selectedCase.id) && <button type="button" onClick={() => setCaseTab("Tareas")} className="px-2 py-2 text-xs text-[#315875] hover:underline">Ver tarea vinculada</button>}<span className="text-[11px] text-slate-500">Se guarda en Tareas con la fecha y el responsable del expediente.</span></div>}
        {caseTab === "Propiedades" && alerts.some((alert) => alert.caseId === selectedCase.id) && <section className="border-b border-slate-200 py-3"><h3 className="text-xs font-semibold text-slate-800">Alertas del calendario</h3><div className="mt-1 divide-y divide-slate-100">{alerts.filter((alert) => alert.caseId === selectedCase.id).sort((a, b) => a.date.localeCompare(b.date)).map((alert) => <div key={alert.id} className="flex flex-wrap justify-between gap-x-3 py-2 text-[11px]"><span className="font-medium text-slate-700">{alert.title}</span><span className="text-slate-500">{alert.date} · {alert.owner}</span></div>)}</div></section>}
        {caseTab === "Historial" && <div className="divide-y divide-slate-100 py-2">{selectedCase.history.length ? selectedCase.history.map((entry, index) => <article key={`${entry.at}-${index}`} className="py-3"><div className="flex justify-between gap-3 text-[11px] text-slate-500"><span>{entry.by}</span><time>{entry.at}</time></div><p className="mt-1 text-xs font-medium text-slate-800">{entry.action}</p><p className="mt-0.5 text-xs text-slate-600">{entry.detail}</p></article>) : <p className="py-5 text-xs text-slate-500">Los cambios del expediente aparecerán aquí.</p>}</div>}
        {caseTab === "Documentos" && <section className="py-3">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Documentos del expediente</h3><span className="text-[10px] text-slate-500">{documents.filter((document) => document.caseId === selectedCase.id).length} enlaces</span></div>
          <div className="mt-2 divide-y divide-slate-100">{documents.filter((document) => document.caseId === selectedCase.id).map((document) => <div key={document.id} className="flex items-center justify-between gap-3 py-2 text-xs"><div className="min-w-0"><a href={document.url} target="_blank" rel="noreferrer" className="block truncate font-medium text-[#315875] hover:underline">{document.name} ↗</a><p className="text-[10px] text-slate-500">{document.category} · {document.addedAt} · {document.by}</p></div></div>)}{!documents.some((document) => document.caseId === selectedCase.id) && <p className="py-2 text-xs text-slate-500">Todavía no hay enlaces individuales.</p>}</div>
          <form onSubmit={addDocument} className="mt-3 grid gap-2 border-t border-slate-200 pt-3 sm:grid-cols-2"><label className="text-[11px] text-slate-600">Nombre<input required value={documentForm.name} onChange={(event) => setDocumentForm((current) => ({ ...current, name: event.target.value }))} className="mt-1 h-8 w-full border border-slate-300 px-2 text-xs" placeholder="Ej. Poder firmado" /></label><label className="text-[11px] text-slate-600">Categoría<select value={documentCategories.includes(documentForm.category) ? documentForm.category : documentCategories[0]} onChange={(event) => setDocumentForm((current) => ({ ...current, category: event.target.value }))} className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs">{documentCategories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="text-[11px] text-slate-600 sm:col-span-2">Enlace del documento<input required type="url" value={documentForm.url} onChange={(event) => setDocumentForm((current) => ({ ...current, url: event.target.value }))} className="mt-1 h-8 w-full border border-slate-300 px-2 text-xs" placeholder="https://drive.google.com/..." /></label><button className="h-8 bg-[#10263C] px-3 text-xs text-white sm:col-span-2 sm:justify-self-end">Agregar documento</button></form>
          <div className="mt-4 border-t border-slate-200 pt-3"><h4 className="text-xs font-semibold text-slate-800">Carpeta de Google Drive</h4>{selectedCase.driveUrl && <a href={selectedCase.driveUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-[#315875]">Abrir carpeta vinculada ↗</a>}<form onSubmit={(event) => { event.preventDefault(); if (driveInput.trim()) { updateCase(selectedCase.id, { driveUrl: driveInput.trim() }, "Vinculó carpeta de Drive", driveInput.trim()); setDriveInput(""); } }} className="mt-2 flex gap-2"><input value={driveInput} onChange={(event) => setDriveInput(event.target.value)} type="url" className="h-8 min-w-0 flex-1 border border-slate-300 px-2 text-xs" placeholder={selectedCase.driveUrl ? "Reemplazar enlace de la carpeta" : "Pegar enlace de Google Drive"} /><button className="bg-[#10263C] px-3 text-xs text-white">Guardar</button></form></div>
        </section>}
        {caseTab === "Tareas" && <section className="py-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Tareas del expediente</h3><button onClick={() => { setNewTask((current) => ({ ...current, caseId: selectedCase.id, owner: activeUser })); setShowNewTask(true); }} className="border border-slate-300 px-2 py-1 text-[10px]">+ Nueva tarea</button></div><div className="mt-2 divide-y divide-slate-100">{tasks.filter((task) => task.caseId === selectedCase.id).map((task) => <div key={task.id} className="flex items-center gap-2 py-2"><input type="checkbox" checked={task.done} aria-label="Cambiar estado de tarea" onChange={(event) => toggleTask(task, event.target.checked)} /><div className="min-w-0 flex-1"><p className={cn("truncate text-xs font-medium", task.done && "text-slate-400 line-through")}>{task.title}</p><p className="text-[10px] text-slate-500">{task.owner} · {task.dueDate || "Sin fecha"} · {task.priority}</p></div><span className="text-[10px] text-slate-500">{task.done ? "Completada" : "Pendiente"}</span></div>)}{!tasks.some((task) => task.caseId === selectedCase.id) && <p className="py-4 text-xs text-slate-400">No hay tareas asociadas.</p>}</div></section>}
        {caseTab === "Pagos" && <section className="py-3"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs text-slate-500">Honorarios acordados<input value={selectedCase.fees} onChange={(event) => updateCase(selectedCase.id, { fees: event.target.value })} className="mt-1 block h-8 w-full border border-slate-300 px-2 text-xs text-slate-800" placeholder="Valor acordado" /></label><div className="text-xs text-slate-500">Cobrado<p className="mt-1 h-8 border-b border-slate-200 py-1 text-sm font-semibold text-slate-900">{formatCOP(amountValue(selectedCase.paid))}</p></div><div className="text-xs text-slate-500">Saldo<p className="mt-1 h-8 border-b border-slate-200 py-1 text-sm font-semibold text-slate-900">{formatCOP(Math.max(0, amountValue(selectedCase.fees) - amountValue(selectedCase.paid)))}</p></div></div><button type="button" onClick={() => { setPaymentForm({ caseId: selectedCase.id, amount: "", date: todayKey, note: "" }); setPaymentOpen(true); }} className="mt-3 bg-[#10263C] px-3 py-2 text-xs text-white">+ Registrar abono</button><div className="mt-3 divide-y divide-slate-100 border-t border-slate-200">{paymentsByCase(selectedCase.id).map((payment) => <div key={payment.id} className="flex justify-between gap-3 py-2 text-xs"><span>{payment.date} · {payment.note || "Abono"}<span className="block text-[10px] text-slate-500">{payment.by}</span></span><span className="font-semibold tabular-nums">{formatCOP(payment.amount)}</span></div>)}{paymentsByCase(selectedCase.id).length === 0 && <p className="py-3 text-xs text-slate-500">No hay abonos registrados.</p>}</div></section>}
        {caseTab === "Datos del cliente" && <section className="py-4"><div className="flex items-center justify-between border-b border-slate-200 pb-3"><div><h3 className="text-sm font-semibold text-slate-900">{selectedCase.client}</h3><p className="mt-0.5 text-[11px] text-slate-500">Expediente {selectedCase.id}</p></div><span className="text-[10px] text-slate-400">Los cambios se guardan al salir del campo</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-[11px] text-slate-500 sm:col-span-2">Nombre completo<input defaultValue={selectedCase.client} onBlur={(event) => updateCaseText(selectedCase.id, "client", event.currentTarget.value.toLocaleUpperCase(), "nombre del cliente")} className="mt-1 block h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label><label className="text-[11px] text-slate-500">Cédula<input defaultValue={selectedCase.nationalId ?? ""} onBlur={(event) => updateCaseText(selectedCase.id, "nationalId", event.currentTarget.value, "cédula")} className="mt-1 block h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label><label className="text-[11px] text-slate-500">Celular del cliente<input type="tel" defaultValue={selectedCase.phone ?? ""} onBlur={(event) => updateCaseText(selectedCase.id, "phone", event.currentTarget.value, "celular del cliente")} className="mt-1 block h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label><label className="text-[11px] text-slate-500 sm:col-span-2">Correo electrónico<input type="email" defaultValue={selectedCase.email ?? ""} onBlur={(event) => updateCaseText(selectedCase.id, "email", event.currentTarget.value, "correo del cliente")} className="mt-1 block h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label><div className="border-t border-slate-200 pt-3 sm:col-span-2"><h4 className="text-xs font-semibold text-slate-800">Familiar cercano</h4></div><label className="text-[11px] text-slate-500">Nombre del familiar<input defaultValue={selectedCase.relativeName ?? ""} onBlur={(event) => updateCaseText(selectedCase.id, "relativeName", event.currentTarget.value, "nombre del familiar")} className="mt-1 block h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label><label className="text-[11px] text-slate-500">Celular del familiar<input type="tel" defaultValue={selectedCase.relativePhone ?? ""} onBlur={(event) => updateCaseText(selectedCase.id, "relativePhone", event.currentTarget.value, "celular del familiar")} className="mt-1 block h-9 w-full border border-slate-300 px-2 text-sm text-slate-800" /></label><label className="text-[11px] text-slate-500">Parentesco<select defaultValue={selectedCase.relativeRelationship ?? ""} onChange={(event) => updateCaseText(selectedCase.id, "relativeRelationship", event.target.value, "parentesco")} className="mt-1 block h-9 w-full border border-slate-300 bg-white px-2 text-sm text-slate-800"><option value="">Seleccionar parentesco</option><option>Madre</option><option>Padre</option><option>Hijo/a</option><option>Hermano/a</option><option>Cónyuge</option><option>Otro familiar</option><option>Otro</option></select></label></div></section>}
      </div></aside></div>}
      {!selectedCase && !showNewCase && !showNewTask && <>
        {assistantOpen && <section role="dialog" aria-label="Asistente de gestión" className={cn("fixed bottom-[76px] left-3 z-[70] flex max-h-[min(60vh,440px)] w-[min(340px,calc(100vw-24px))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:left-5", sidebarCollapsed ? "lg:left-[72px]" : "lg:left-[208px]")}>
          <header className="flex items-center gap-2 border-b border-[#25445f] bg-[#10263C] px-3 py-2"><Image src="/barriosvalencia.png" alt="" width={30} height={30} className="h-7 w-7 shrink-0 rounded-full bg-white object-contain" /><div className="min-w-0 flex-1"><h2 className="text-xs font-semibold text-white">Asistente de gestión BV</h2><p className="text-[10px] text-slate-300">Para {activeUser.startsWith("Juan") ? "Juan" : "Luis"}</p></div><button type="button" onClick={() => setAssistantOpen(false)} aria-label="Cerrar asistente" className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-white hover:bg-white/10">×</button></header>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[#f7f8fa] p-2.5">
            <div className="flex items-end gap-1.5"><Image src="/barriosvalencia.png" alt="" width={22} height={22} className="h-[22px] w-[22px] shrink-0 object-contain" /><p className="max-w-[82%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] leading-4 text-slate-700">Hola, {activeUser.startsWith("Juan") ? "Juan" : "Luis"}. ¿Qué quieres hacer hoy? Puedo ayudarte con casos, tareas y plazos.</p></div>
            {assistantMessages.map((message, index) => <div key={`${index}-${message.role}`} className={message.role === "user" ? "flex justify-end" : "flex items-end gap-1.5"}>{message.role === "assistant" && <Image src="/barriosvalencia.png" alt="" width={22} height={22} className="h-[22px] w-[22px] shrink-0 object-contain" />}<div className={message.role === "user" ? "max-w-[82%] rounded-2xl rounded-br-sm bg-[#dceaf1] px-2.5 py-1.5 text-[11px] leading-4 text-[#10263C]" : "max-w-[82%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] leading-4 text-slate-700"}><p className="whitespace-pre-wrap">{message.text}</p>{message.role === "assistant" && message.caseIds?.map((caseId) => { const item = caseRecords.find((record) => record.id === caseId); return item ? <button key={caseId} onClick={() => { if (message.action === "select-update") { if (assistantUpdateDraft?.paymentIntent) prepareAssistantFullPayment(item); else { setAssistantUpdateDraft({ caseId: item.id }); setAssistantMessages((current) => [...current, { role: "assistant", text: `Elegiste ${item.client} (${item.id}). ¿Qué dato quieres cambiar? Puedo actualizar estado, responsable, tipo, contraparte, celular, correo o registrar un pago total.` }]); } } else { setSelectedCaseId(item.id); setCaseTab("Propiedades"); setAssistantOpen(false); } }} className="mt-2 block w-full border-t border-slate-100 pt-2 text-left text-xs font-medium text-[#315875] hover:underline">{item.client} · {item.id}<span className="block text-[10px] font-normal text-slate-500">{item.type} · {item.status}</span></button> : null; })}{message.action === "task" && <button onClick={() => { setNewTask((current) => ({ ...current, caseId: "", owner: activeUser })); setActiveSection("tareas"); setShowNewTask(true); setAssistantOpen(false); }} className="mt-2 border-t border-slate-100 pt-2 text-left text-xs font-medium text-[#315875] hover:underline">Abrir creación de tarea</button>}{message.action === "deadlines" && <button onClick={() => { setActiveSection("inicio"); setFilter("Inicio: vencimiento"); setQuery(""); setAssistantOpen(false); }} className="mt-2 border-t border-slate-100 pt-2 text-left text-xs font-medium text-[#315875] hover:underline">Ver plazos y alertas</button>}</div></div>)}
            {assistantCaseDraft && <section className="ml-8 border border-slate-200 bg-white p-3 text-xs"><h3 className="font-semibold text-slate-900">Borrador del caso</h3><dl className="mt-2 grid grid-cols-[90px_1fr] gap-y-1 text-[11px]"><dt className="text-slate-500">Cliente</dt><dd>{assistantCaseDraft.client || "Sin indicar"}</dd><dt className="text-slate-500">Cédula</dt><dd>{assistantCaseDraft.nationalId || "Sin indicar"}</dd><dt className="text-slate-500">Celular</dt><dd>{assistantCaseDraft.phone || "Sin indicar"}</dd><dt className="text-slate-500">Proceso</dt><dd>{assistantCaseDraft.type && !assistantCaseDraft.indemnityStage && !/^(pendiente|prospecto|cerrado|en consulta)$/i.test(normalizeAssistantText(assistantCaseDraft.type)) ? assistantCaseDraft.type : "Sin definir"}</dd><dt className="text-slate-500">Contraparte</dt><dd>{assistantCaseDraft.counterparty || "Sin indicar"}</dd><dt className="text-slate-500">Responsable</dt><dd>{assistantCaseDraft.owner || activeUser}</dd><dt className="text-slate-500">Estado</dt><dd>Prospecto</dd></dl><div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-2"><button type="button" onClick={() => setAssistantCaseDraft(null)} className="px-2 py-1 text-xs text-slate-600">Cancelar</button>{!nextMissingCaseField(assistantCaseDraft) && <button type="button" onClick={confirmAssistantCase} className="bg-[#10263C] px-3 py-1.5 text-xs font-medium text-white">Confirmar y crear</button>}</div></section>}
            {assistantUpdateDraft && assistantUpdateCase && <section className="ml-8 border border-slate-200 bg-white p-3 text-xs"><h3 className="font-semibold text-slate-900">Actualizar expediente</h3><p className="mt-1 text-[11px] text-slate-600">{assistantUpdateCase.client} · {assistantUpdateCase.id}</p>{assistantUpdateDraft.field && assistantUpdateDraft.value && <dl className="mt-2 grid grid-cols-[90px_1fr] gap-y-1 border-t border-slate-100 pt-2 text-[11px]"><dt className="text-slate-500">Dato</dt><dd>{assistantUpdateLabels[assistantUpdateDraft.field]}</dd><dt className="text-slate-500">Actual</dt><dd>{assistantUpdateDraft.field === "owner" ? assistantUpdateCase.owners.join(", ") : assistantUpdateDraft.field === "note" ? "Se agregará una nota" : assistantUpdateCase[assistantUpdateDraft.field] || "Vacío"}</dd><dt className="text-slate-500">Nuevo</dt><dd>{assistantUpdateDraft.value}</dd></dl>}<div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-2"><button type="button" onClick={() => { setAssistantUpdateDraft(null); setAssistantMessages((current) => [...current, { role: "assistant", text: "Cancelé el cambio. El expediente no se modificó." }]); }} className="px-2 py-1 text-xs text-slate-600">Cancelar</button>{assistantUpdateDraft.field && assistantUpdateDraft.value && <button type="button" onClick={confirmAssistantUpdate} className="bg-[#10263C] px-3 py-1.5 text-xs font-medium text-white">Confirmar cambio</button>}</div></section>}
            {assistantPaymentDraft && assistantPaymentCase && <section className="ml-8 border border-slate-200 bg-white p-3 text-xs"><h3 className="font-semibold text-slate-900">Confirmar pago total</h3><p className="mt-1 text-[11px] text-slate-600">{assistantPaymentCase.client} · {assistantPaymentCase.id}</p><dl className="mt-2 grid grid-cols-[100px_1fr] gap-y-1 border-t border-slate-100 pt-2 text-[11px]"><dt className="text-slate-500">Honorarios</dt><dd>{formatCOP(amountValue(assistantPaymentCase.fees))}</dd><dt className="text-slate-500">Ya pagado</dt><dd>{formatCOP(amountValue(assistantPaymentCase.paid))}</dd><dt className="text-slate-500">Pago a registrar</dt><dd className="font-semibold">{formatCOP(assistantPaymentBalance)}</dd></dl><label className="mt-2 block text-[11px] text-slate-600">Fecha del pago<input type="date" value={assistantPaymentDraft.date} onChange={(event) => setAssistantPaymentDraft({ ...assistantPaymentDraft, date: event.target.value })} className="mt-1 h-8 w-full border border-slate-300 px-2 text-xs" /></label><div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-2"><button type="button" onClick={() => setAssistantPaymentDraft(null)} className="px-2 py-1 text-xs text-slate-600">Cancelar</button><button type="button" disabled={!assistantPaymentDraft.date || !assistantPaymentBalance} onClick={confirmAssistantPayment} className="bg-[#10263C] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40">Registrar pago</button></div></section>}
            {!assistantMessages.length && <div className="flex flex-wrap gap-1.5 pl-8"><button onClick={() => { setAssistantCaseDraft({ owner: activeUser }); setAssistantMessages([{ role: "assistant", text: fieldQuestions.client }]); }} className="border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-100">Crear caso</button><button onClick={() => { setAssistantUpdateDraft({}); setAssistantMessages([{ role: "assistant", text: "¿Qué expediente quieres actualizar? Escribe el nombre del cliente, la cédula o el número BV." }]); }} className="border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-100">Actualizar caso</button><button onClick={() => setAssistantQuery("Buscar caso de ")} className="border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-100">Buscar caso</button><button onClick={() => setAssistantQuery("Crear tarea")} className="border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-100">Crear tarea</button><button onClick={() => setAssistantQuery("plazos y alertas")} className="border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-600 hover:bg-slate-100">Revisar plazos</button></div>}
            {!assistantMessages.length && <p className="pl-7 text-[9px] leading-3 text-slate-500">Funciona en este navegador. Los mensajes no se envían a un servicio de IA.</p>}
          </div>
          <form ref={assistantEndRef} onSubmit={sendAssistantMessage} className="flex items-center gap-1.5 border-t border-slate-200 bg-white p-2"><label className="sr-only" htmlFor="assistant-case-search">Escribe una solicitud</label><input id="assistant-case-search" autoFocus value={assistantQuery} onChange={(event) => setAssistantQuery(event.target.value)} className="h-8 min-w-0 flex-1 rounded-full border border-slate-300 px-3 text-[11px] outline-none focus:border-[#A1805E]" placeholder="Escribe tu solicitud..." /><button disabled={!assistantQuery.trim()} className="h-8 rounded-full bg-[#10263C] px-3 text-[11px] font-medium text-white disabled:opacity-40">Enviar</button></form>
        </section>}
        <button type="button" onClick={() => setAssistantOpen((open) => !open)} aria-label={assistantOpen ? "Cerrar asistente" : `Abrir asistente de gestión para ${activeUser}`} title={`Asistente de gestión BV · ${activeUser}`} className={cn("fixed bottom-0 left-3 z-[70] flex items-end gap-1.5 bg-transparent p-0 text-left transition hover:-translate-y-0.5 sm:left-5", sidebarCollapsed ? "lg:left-[72px]" : "lg:left-[208px]")}><Image src={activeUser.startsWith("Juan") ? "/images/animado/juan animado.png" : "/images/animado/luis animado.png"} alt="" width={52} height={70} className="h-[70px] w-[52px] shrink-0 object-contain object-bottom drop-shadow-sm" /><span className="mb-3 flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 pr-3 shadow-md"><Image src="/barriosvalencia.png" alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" /><span className="text-[11px] font-semibold text-[#10263C]">Asistente BV</span></span></button>
      </>}
    </div>
  );
}


