"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CallToActionSection() {
  return (
    <section className="bg-[#152A42] py-20 text-[#F5F4F2] md:py-24">
      <Container>
        <div className="border-t border-b border-[#A1805E]/35 py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* TEXTO */}
            <div className="max-w-3xl">
              <p className="font-[Montserrat] text-[11px] font-semibold uppercase tracking-[0.32em] text-[#A1805E]">
                Contacto
              </p>

              <h2 className="mt-5 font-[Montserrat] text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#F5F4F2] md:text-6xl">
                ¿Necesita asesoría jurídica en pensiones o derecho laboral?
              </h2>

              <p className="mt-6 max-w-2xl font-[Montserrat] text-sm leading-7 text-[#F5F4F2]/72 md:text-base">
                Estudiamos su caso, evaluamos la viabilidad jurídica y le indicamos
                con claridad la ruta más adecuada para avanzar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 min-w-[190px] border border-[#F5F4F2] bg-[#F5F4F2] px-6 font-[Montserrat] text-sm font-semibold text-[#152A42] transition hover:bg-transparent hover:text-[#F5F4F2]"
                >
                  <Link href="/contacto">Consultar mi caso</Link>
                </Button>

                <Button
                  asChild
                  className="h-12 min-w-[190px] border border-[#A1805E] bg-transparent px-6 font-[Montserrat] text-sm font-semibold text-[#F5F4F2] transition hover:bg-[#A1805E] hover:text-[#152A42]"
                >
                  <Link
                    href="https://wa.me/573008000000"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </Link>
                </Button>
              </div>
            </div>

            {/* FORMULARIO */}
            <div className="rounded-2xl border border-[#A1805E]/30 bg-[#1B3554] p-8 shadow-xl">
              <form
                action="https://formsubmit.co/abpsegurosltda@gmail.com"
                method="POST"
                className="space-y-4"
              >
                {/* Opciones de FormSubmit */}
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="hidden"
                  name="_subject"
                  value="Nuevo contacto desde la página web"
                />

                <div>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo"
                    required
                    className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-[#A1805E] focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    required
                    className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-[#A1805E] focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-[#A1805E] focus:outline-none"
                  />
                </div>

                <div>
                  <textarea
                    name="mensaje"
                    placeholder="Cuéntenos brevemente su caso"
                    rows={4}
                    required
                    className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-[#A1805E] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#A1805E] py-3 font-[Montserrat] text-sm font-semibold text-[#152A42] transition hover:bg-[#c9a37d]"
                >
                  Enviar consulta
                </button>
              </form>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}