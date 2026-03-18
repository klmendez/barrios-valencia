import { Container } from "@/components/ui/Container";

const INSTAGRAM_EMBED_URL = "https://www.instagram.com/p/DVRNEEjEZZG/embed";

export function InstagramSection() {
  return (
    <section className="bg-[#F5F4F2] py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <h2 className="section-title text-[#152A42]">Voz de la firma</h2>
          <p className="section-subtitle text-base text-[#A1805E]">Lo que estamos compartiendo en Instagram</p>
          <p className="section-lead text-[#152A42]/70">
            Este clip resume cómo enfrentamos los casos pensionales y laborales: claridad, cercanía y estrategia. Mira el video y
            siente el tono humano con el que acompañamos cada proceso.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#A1805E]/30 bg-white shadow-menu">
          <div className="aspect-[4/5] w-full">
            <iframe
              src={INSTAGRAM_EMBED_URL}
              className="h-full w-full"
              allowFullScreen
              loading="lazy"
              title="Publicación de Instagram Barrios Valencia"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
