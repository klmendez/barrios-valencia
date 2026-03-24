import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const partners = [
  {
    name: "Luis Hernando Barrios Hernández",
    title: "Socio director | Derecho pensional y litigios estratégicos",
    bio: "Más de 20 años acompañando reclamaciones pensionales complejas.",
    email: "lbarrios@barriosvalencia.com",
    image: "/team/luis1.jpg",
  },
  {
    name: "Juan Pablo Valencia Giraldo",
    title: "Socio | Seguridad social y asesoría corporativa",
    bio: "Integra la investigación jurídica con la planeación financiera.",
    email: "jvalencia@barriosvalencia.com",
    image: "/team/juan.jpg",
  },
];

const paralegals = [
  {
    name: "Juliana Valencia Giraldo",
    role: "Paralegal",
    focus: "Apoya investigación normativa y gestión con entidades.",
    email: "juliana@barriosvalencia.com",
    image: "/team/juliana.jpg",
  },
];

function TeamCard({ name, title, description, email, image }: any) {
  return (
    <article
      className={cn(
        "group flex h-[480px] w-full flex-col justify-between border border-[#F5F4F2]/10 bg-[#152A42] p-6 text-[#F5F4F2] transition-all duration-300",
        "hover:bg-[#F5F4F2] hover:text-[#152A42]"
      )}
    >
      <div>
        <div className="relative mb-6 h-[170px] w-[130px] overflow-hidden">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <h3 className="max-w-[14ch] text-[26px] font-light leading-tight">
          {name}
        </h3>

        <p className="mt-3 text-[13px] font-medium">{title}</p>

        <p className="mt-2 text-[12px] opacity-80">{description}</p>

        <a href={`mailto:${email}`} className="mt-3 block text-[12px] opacity-70">
          {email}
        </a>
      </div>

      <Link href="#" className="text-[13px] font-medium group-hover:translate-x-1 transition">
        Ver perfil →
      </Link>
    </article>
  );
}

export default function AboutPage() {
  return (
    <main className={cn(montserrat.className, "bg-[#F5F4F2] text-[#152A42]")}>

      {/* HERO */}
      <section className="bg-[#F5F4F2] text-[#152A42] py-20 border-b border-[#152A42]/10">
  <Container className="grid gap-10 lg:grid-cols-2 items-end">

    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#152A42]/50">
        Nuestro equipo
      </p>

      <h1 className="mt-4 text-3xl md:text-5xl font-light leading-tight tracking-[-0.04em]">
        Equipo con amplia experiencia en la resolución de asuntos complejos
      </h1>
    </div>

    <div>
      <Image
        src="/brand/b.png"
        alt="icono"
        width={80}
        height={60}
        className="mb-4 opacity-100"
      />

      <p className="text-[14px] leading-7 text-[#152A42]/70 max-w-md">
        Hemos construido un equipo que combina estrategia jurídica,
        rigurosidad técnica y cercanía con el cliente, para acompañar
        procesos sensibles y litigios de alto impacto con claridad en cada etapa.
      </p>
    </div>

  </Container>
</section>

      {/* SOCIOS */}
      <section className="bg-[#152A42] py-16 text-[#F5F4F2]">
        <Container className="grid lg:grid-cols-[120px_1fr] gap-6">

          <h2 className="text-3xl font-light">Socios</h2>

          <div className="flex justify-end">
            <div className="grid grid-cols-2 gap-[1px] max-w-[800px] w-full">
              {partners.map((p) => (
                <TeamCard
                  key={p.email}
                  name={p.name}
                  title={p.title}
                  description={p.bio}
                  email={p.email}
                  image={p.image}
                />
              ))}
            </div>
          </div>

        </Container>
      </section>

      {/* PARALEGALES */}
      <section className="bg-[#152A42] py-16 text-[#F5F4F2]">
        <Container className="grid lg:grid-cols-[120px_1fr] gap-6">

          <h2 className="text-3xl font-light">Paralegales</h2>

          <div className="flex justify-end">
            <div className="w-full max-w-[400px]">
              {paralegals.map((p) => (
                <TeamCard
                  key={p.email}
                  name={p.name}
                  title={p.role}
                  description={p.focus}
                  email={p.email}
                  image={p.image}
                />
              ))}
            </div>
          </div>

        </Container>
      </section>

    </main>
  );
}