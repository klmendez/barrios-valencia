import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AppointmentScheduler } from "../contacto/_components/AppointmentScheduler";

const whatsappPhone = "573005687950";
const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=Hola%20Barrios%20Valencia%20Abogados,%20necesito%20asesor%C3%ADa.`;

const contactItems = [
  { label: "Abogado Luis Hernando", value: "+57 300 568 7950", href: "tel:+573005687950" },
  { label: "Correo Luis Hernando", value: "lhbarrios@gmail.com", href: "mailto:lhbarrios@gmail.com" },
  { label: "Abogado Juan Pablo", value: "+57 300 739 0004", href: "tel:+573007390004" },
  { label: "Correo Juan Pablo", value: "jp@barriosvalencia.com", href: "mailto:jp@barriosvalencia.com" },
  { label: "WhatsApp", value: "+57 300 568 7950", href: whatsappUrl, external: true },
  { label: "Oficina", value: "Cra. 8 #3-52 · Popayán, Cauca", href: undefined },
];

const officeLocations = [
  {
    city: "Popayán",
    address: "Cra. 8 #3-52, Oficina 103 · Edificio Albarracín Ordoñez",
    schedule: ["Lunes a viernes, 8:00 a.m. – 6:00 p.m.", "Sábados con cita previa"],
  },
  {
    city: "Atención nacional",
    address: "Consultas virtuales por videollamada y teléfono",
    schedule: ["Cobertura en Colombia y para residentes en el exterior"],
  },
];

export const metadata: Metadata = {
  title: "Contacto | Barrios Valencia Abogados",
  description:
    "Agenda una cita o envía los detalles de tu caso. Atención presencial en Popayán, videollamada y teléfono.",
};

function SidebarContent({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <div className="space-y-7">
      {/* Contacto directo */}
      <div>
        <p className="text-[11px] font-semibold uppercase text-[#A1805E]">Contacto directo</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#152A42]">Luis Hernando Barrios</p>
            <a href="tel:+573005687950" className="mt-0.5 block text-sm text-[#152A42]/70 hover:text-[#A1805E] transition">+57 300 568 7950</a>
            <a href="mailto:lhbarrios@gmail.com" className="block text-sm text-[#152A42]/70 hover:text-[#A1805E] transition">lhbarrios@gmail.com</a>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#152A42]">Juan Pablo Valencia</p>
            <a href="tel:+573007390004" className="mt-0.5 block text-sm text-[#152A42]/70 hover:text-[#A1805E] transition">+57 300 739 0004</a>
            <a href="mailto:jp@barriosvalencia.com" className="block text-sm text-[#152A42]/70 hover:text-[#A1805E] transition">jp@barriosvalencia.com</a>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#152A42]">WhatsApp</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 block text-sm text-[#152A42]/70 hover:text-[#A1805E] transition">+57 300 568 7950</a>
          </div>
        </div>
      </div>

      {/* Oficinas */}
      <div className="border-t border-[#152A42]/10 pt-6">
        <p className="text-[11px] font-semibold uppercase text-[#A1805E]">Oficinas y cobertura</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#152A42]">Popayán</p>
            <p className="mt-0.5 text-xs text-[#152A42]/65">Cra. 8 #3-52, Oficina 103 · Edificio Albarracín Ordoñez</p>
            <p className="mt-1 text-xs text-[#152A42]/45">Lunes a viernes, 8:00 a.m. – 6:00 p.m.</p>
            <p className="text-xs text-[#152A42]/45">Sábados con cita previa</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#152A42]">Atención nacional</p>
            <p className="mt-0.5 text-xs text-[#152A42]/65">Videollamada y teléfono · Cobertura en Colombia y en el exterior</p>
          </div>
        </div>
      </div>

      {/* Modalidades */}
      <div className="border-t border-[#152A42]/10 pt-6">
        <p className="text-[11px] font-semibold uppercase text-[#A1805E]">Modalidades</p>
        <ul className="mt-3 space-y-2">
          {[
            "Presencial en Popayán, videollamada o llamada telefónica.",
            "Documentos y expedientes digitales para clientes fuera de la ciudad.",
            "Confirmamos detalles y enviamos recordatorio después de agendar.",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-xs leading-5 text-[#152A42]/65">
              <span className="mt-[5px] h-[4px] w-[4px] shrink-0 bg-[#A1805E]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Mapa */}
      <div className="border-t border-[#152A42]/10 pt-6 overflow-hidden">
        <iframe
          src="https://maps.google.com/maps?q=Cra.+8+%233-52,+Popay%C3%A1n,+Cauca,+Colombia&output=embed&hl=es"
          className="h-[200px] w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación oficina Barrios Valencia Abogados"
        />
      </div>
    </div>
  );
}

export default function ConsultaGratuitaPage() {
  return (
    <div className="overflow-x-hidden bg-white text-[#152A42]">
      {/* Hero */}
      <section className="relative -mt-20 overflow-hidden bg-[#152A42] pt-28 pb-8 text-center text-[#F5F4F2] md:pt-32 md:pb-10">
        <Container className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#F5F4F2] md:text-4xl">
            Contáctanos
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#F5F4F2]/65">
            Agenda una cita o cuéntanos tu caso. Te respondemos a la brevedad.
          </p>
        </Container>
      </section>

      {/* Cuerpo: contenido izquierda + sidebar derecha sticky */}
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8 lg:flex lg:items-start lg:gap-0 lg:px-10">

        {/* Columna izquierda: scrollable */}
        <div className="flex-1 min-w-0">
          {/* Agenda una cita */}
          <section id="agendar" className="bg-white py-14 md:py-20">
            <AppointmentScheduler
              whatsappPhone={whatsappPhone}
              officeLocations={officeLocations}
            />
          </section>

        </div>

        {/* Columna derecha: sticky (solo desktop) */}
        <aside className="hidden lg:block w-[340px] shrink-0 border-l border-[#152A42]/10">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] py-10 pl-10 pr-2">
            <SidebarContent whatsappUrl={whatsappUrl} />
          </div>
        </aside>
      </div>

      {/* Mobile: contacto al final */}
      <section className="border-t border-[#152A42]/10 bg-white px-5 py-10 sm:px-8 lg:hidden">
        <SidebarContent whatsappUrl={whatsappUrl} />
      </section>
    </div>
  );
}
