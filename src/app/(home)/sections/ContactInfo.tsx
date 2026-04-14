import { Container } from "@/components/ui/Container";

const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20necesito%20asesor%C3%ADa.";

const contactItems = [
  { label: "Abogado Luis Hernando", value: "+57 300 568 7950", href: "tel:+573005687950" },
  { label: "Correo Luis Hernando", value: "lhbarrios@gmail.com", href: "mailto:lhbarrios@gmail.com" },
  { label: "Abogado Juan Pablo", value: "+57 300 739 0004", href: "tel:+573007390004" },
  { label: "Correo Juan Pablo", value: "jp@barriosvalencia.com", href: "mailto:jp@barriosvalencia.com" },
  { label: "WhatsApp", value: "+57 300 568 7950", href: whatsappUrl, external: true },
  { label: "Oficina", value: "Cra. 8 #3-52 · Popayán, Cauca", href: undefined },
];

export function ContactInfoSection() {
  return (
    <section className="border-t border-[#152A42]/10 bg-white overflow-hidden">
      <Container className="grid lg:grid-cols-2">
        {/* Izquierda: datos */}
        <div className="py-10 pr-0 lg:pr-12">
          <p className="text-[11px] font-semibold uppercase text-[#A1805E]">
            Información de contacto
          </p>
          <div className="mt-6 divide-y divide-[#152A42]/8">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-4 py-3">
                <span className="shrink-0 text-xs font-semibold uppercase text-[#152A42]/45">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-right text-sm font-medium text-[#152A42] transition hover:text-[#A1805E]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-right text-sm font-medium text-[#152A42]">{item.value}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-[#152A42]/10 pt-5">
            <p className="text-xs text-[#152A42]/45">Lunes a viernes · 8:00 a.m. – 6:00 p.m.</p>
            <p className="text-xs text-[#152A42]/45">Sábados con cita previa</p>
          </div>
        </div>

        {/* Derecha: mapa */}
        <div className="overflow-hidden border-[#152A42]/10 lg:border-l">
          <iframe
            src="https://maps.google.com/maps?q=Cra.+8+%233-52,+Popay%C3%A1n,+Cauca,+Colombia&output=embed&hl=es"
            className="h-[280px] w-full border-0 lg:h-full lg:min-h-[380px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación oficina Barrios Valencia Abogados"
          />
        </div>
      </Container>
    </section>
  );
}
