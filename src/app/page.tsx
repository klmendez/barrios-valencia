import { HeroSection } from "@/app/(home)/sections/Hero";
import { ServicesSection } from "@/app/(home)/sections/Services";
import { CaseTickerSection } from "@/app/(home)/sections/CaseTicker";
import { SignalMatrixSection } from "@/app/(home)/sections/SignalMatrix";
import { InstagramSection } from "@/app/(home)/sections/Instagram";
import { WhyChooseUsSection } from "@/app/(home)/sections/WhyChooseUs";
import { CallToActionSection } from "@/app/(home)/sections/CallToAction";

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <SignalMatrixSection />
      <CaseTickerSection />
      <InstagramSection />
            <CallToActionSection />

    </div>
  );
}
