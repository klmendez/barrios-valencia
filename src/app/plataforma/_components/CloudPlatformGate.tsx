"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { initialPlatformSnapshot } from "@/lib/platform-defaults";
import { readPlatformSnapshot } from "@/lib/platform-storage";
import { mergeConcurrentSnapshots } from "@/lib/platform-concurrent-merge";
import type { PlatformSnapshot } from "@/lib/platform-types";
import { PlatformWorkspace } from "./PlatformWorkspace";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
type Member = { userId: string; name: string };
type Pending = { snapshot: PlatformSnapshot; serialized: string };
type Rebase = { before: PlatformSnapshot; merged: PlatformSnapshot };

function downloadSnapshot(snapshot: PlatformSnapshot) {
  const file = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const href = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = href;
  link.download = `barrios-valencia-pendiente-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export function CloudPlatformGate() {
  const [phase, setPhase] = useState<"loading" | "login" | "ready" | "denied" | "error">("loading");
  const [member, setMember] = useState<Member | null>(null);
  const [snapshot, setSnapshot] = useState<PlatformSnapshot | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [workspaceEpoch, setWorkspaceEpoch] = useState(0);
  const revisionRef = useRef(0);
  const savedRef = useRef("");
  const baseRef = useRef<PlatformSnapshot>(initialPlatformSnapshot);
  const pendingRef = useRef<Pending | null>(null);
  const rebaseRef = useRef<Rebase | null>(null);
  const busyRef = useRef(false);
  const stoppedRef = useRef(false);
  const latestPending = () => pendingRef.current as Pending | null;

  const openWorkspace = useCallback((data: PlatformSnapshot, revision: number) => {
    revisionRef.current = revision;
    savedRef.current = JSON.stringify(data);
    baseRef.current = data;
    pendingRef.current = null;
    rebaseRef.current = null;
    stoppedRef.current = false;
    setSaveError("");
    setSnapshot(data);
    setWorkspaceEpoch((value) => value + 1);
    setPhase("ready");
  }, []);

  const loadForUser = useCallback(async (user: User) => {
    if (!supabase) return;
    setPhase("loading");
    const membership = await supabase.from("platform_members").select("display_name").eq("user_id", user.id).maybeSingle();
    if (membership.error) { setMessage(membership.error.message); setPhase("error"); return; }
    if (!membership.data) { setPhase("denied"); return; }
    setMember({ userId: user.id, name: membership.data.display_name as string });
    const state = await supabase.from("platform_state").select("revision,data").eq("id", 1).single();
    if (state.error) { setMessage(state.error.message); setPhase("error"); return; }
    try {
      openWorkspace(readPlatformSnapshot(state.data.data, initialPlatformSnapshot), Number(state.data.revision));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron leer los datos.");
      setPhase("error");
    }
  }, [openWorkspace]);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (error || !data.user) setPhase("login");
      else void loadForUser(data.user);
    });
    return () => { mounted = false; };
  }, [loadForUser]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || isSubmitting) return;
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error || !result.data.user) { setMessage("No se pudo iniciar sesión. Revisa el correo y la contraseña."); return; }
      setPassword("");
      await loadForUser(result.data.user);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMember(null);
    setSnapshot(null);
    setSaveError("");
    pendingRef.current = null;
    rebaseRef.current = null;
    setPhase("login");
  };

  const flush = useCallback(async () => {
    if (!supabase || busyRef.current || stoppedRef.current) return;
    busyRef.current = true;
    while (pendingRef.current) {
      const next = pendingRef.current;
      pendingRef.current = null;
      if (next.serialized === savedRef.current) continue;
      const result = await supabase.rpc("save_platform_state", { expected_revision: revisionRef.current, next_data: next.snapshot });
      if (result.error) {
        const conflict = result.error.message.includes("revision_conflict");
        if (conflict) {
          const state = await supabase.from("platform_state").select("revision,data").eq("id", 1).single();
          if (!state.error) {
            try {
              const remote = readPlatformSnapshot(state.data.data, initialPlatformSnapshot);
              const local = latestPending()?.snapshot ?? next.snapshot;
              const merged = mergeConcurrentSnapshots(baseRef.current, local, remote, "local");
              revisionRef.current = Number(state.data.revision);
              baseRef.current = remote;
              savedRef.current = JSON.stringify(remote);
              rebaseRef.current = { before: local, merged: merged.snapshot };
              pendingRef.current = { snapshot: merged.snapshot, serialized: JSON.stringify(merged.snapshot) };
              setSnapshot(merged.snapshot);
              setWorkspaceEpoch((value) => value + 1);
              continue;
            } catch { /* Keep the local copy and offer a retry below. */ }
          }
        }
        pendingRef.current = pendingRef.current ?? next;
        stoppedRef.current = true;
        setSaveError("No se pudo guardar en Supabase. Tus cambios siguen aquí; vuelve a intentarlo.");
        break;
      }
      revisionRef.current = Number(result.data);
      savedRef.current = next.serialized;
      baseRef.current = next.snapshot;
      setSaveError("");
    }
    busyRef.current = false;
  }, []);

  const save = useCallback((data: PlatformSnapshot) => {
    const rebase = rebaseRef.current;
    const current = rebase && JSON.stringify(data) !== JSON.stringify(rebase.merged)
      ? mergeConcurrentSnapshots(rebase.before, data, rebase.merged, "local").snapshot
      : data;
    if (rebase && JSON.stringify(data) === JSON.stringify(rebase.merged)) rebaseRef.current = null;
    const serialized = JSON.stringify(current);
    if (serialized === pendingRef.current?.serialized) return;
    if (serialized === savedRef.current && !busyRef.current) {
      pendingRef.current = null;
      return;
    }
    pendingRef.current = { snapshot: current, serialized };
    void flush();
  }, [flush]);

  useEffect(() => {
    if (phase !== "ready" || !supabase) return;
    const timer = window.setInterval(async () => {
      if (!supabase || busyRef.current || pendingRef.current || stoppedRef.current) return;
      const result = await supabase.from("platform_state").select("revision,data").eq("id", 1).single();
      if (busyRef.current || pendingRef.current || stoppedRef.current) return;
      if (result.error || Number(result.data.revision) <= revisionRef.current) return;
      try { openWorkspace(readPlatformSnapshot(result.data.data, initialPlatformSnapshot), Number(result.data.revision)); }
      catch { setSaveError("No se pudieron leer los últimos cambios. La plataforma volverá a intentarlo."); }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [phase, openWorkspace]);

  if (!supabase) return <div className="flex min-h-[100dvh] items-center justify-center bg-[#10263C] px-4"><div className="w-full max-w-md rounded-2xl bg-white p-8 text-sm"><Image src="/brand/icono_fondoclaro.PNG" alt="Barrios Valencia Abogados" width={260} height={96} className="h-auto w-[210px]" /><h1 className="mt-8 text-lg font-semibold text-[#10263C]">Plataforma pendiente de configuración</h1><p className="mt-2 text-slate-600">Configura la conexión de datos antes de usar la plataforma.</p></div></div>;
  if (phase === "ready" && member && snapshot) return <>
    {saveError && <div role="alert" className="fixed right-3 top-3 z-[100] max-w-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 shadow-lg"><p>{saveError}</p>{pendingRef.current && <div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => { stoppedRef.current = false; void flush(); }} className="border border-amber-500 px-2 py-1">Reintentar</button><button type="button" onClick={() => downloadSnapshot(pendingRef.current?.snapshot ?? snapshot)} className="border border-amber-500 px-2 py-1">Descargar copia</button></div>}</div>}
    <PlatformWorkspace key={`${member.userId}-${workspaceEpoch}`} cloudSnapshot={snapshot} onCloudSave={save} signedInUser={member.name} onSignOut={signOut} />
  </>;
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#10263C] px-4 py-8 sm:px-6">
      <div className="w-full max-w-[430px] rounded-2xl bg-white px-7 py-8 shadow-[0_22px_60px_rgba(4,19,34,0.28)] sm:px-9 sm:py-10">
        <Image src="/brand/icono_fondoclaro.PNG" alt="Barrios Valencia Abogados" width={260} height={96} priority className="h-auto w-[210px]" />
        <div className="mt-8 border-t border-slate-200 pt-7">
          {phase === "login" ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9C7759]">Plataforma de gestión</p>
              <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-[#10263C]">Bienvenido de nuevo</h1>
              <p className="mt-1 text-sm text-slate-500">Ingresa con tu correo y contraseña.</p>
              <form onSubmit={login} className="mt-7 space-y-5">
                <label className="block text-sm font-medium text-[#23374A]">
                  Correo electrónico
                  <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correo.com" className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-normal text-[#10263C] outline-none transition placeholder:text-slate-400 focus:border-[#315F86] focus:ring-2 focus:ring-[#315F86]/15" />
                </label>
                <label className="block text-sm font-medium text-[#23374A]">
                  Contraseña
                  <span className="relative mt-2 block">
                    <input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Escribe tu contraseña" className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 pr-20 text-sm font-normal text-[#10263C] outline-none transition placeholder:text-slate-400 focus:border-[#315F86] focus:ring-2 focus:ring-[#315F86]/15" />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute inset-y-0 right-3 text-xs font-semibold text-[#315F86] hover:text-[#10263C]">{showPassword ? "Ocultar" : "Mostrar"}</button>
                  </span>
                </label>
                {message && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
                <button type="submit" disabled={isSubmitting} className="flex h-11 w-full items-center justify-center rounded-lg bg-[#10263C] px-4 text-sm font-semibold text-white transition hover:bg-[#1B4768] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315F86] disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Ingresando…" : "Iniciar sesión"}</button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[#10263C]">{phase === "denied" ? "Acceso no autorizado" : phase === "loading" ? "Cargando plataforma…" : "No se pudieron cargar los datos"}</h1>
              {phase === "denied" && <p className="mt-2 text-sm text-slate-600">Tu cuenta no tiene acceso a esta plataforma.</p>}
              {message && <p role="alert" className="mt-2 text-sm text-red-700">{message}</p>}
              {phase !== "loading" && <button type="button" onClick={signOut} className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-[#10263C] hover:bg-slate-50">Cambiar cuenta</button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
