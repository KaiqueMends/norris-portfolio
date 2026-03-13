import { Hero } from "./_components/hero/Hero";
import { WorkSection } from "./_components/work/WorkSection";
import { Footer } from "./_components/footer/Footer";
import Socials from "./_components/socials/Socials";
import { AnimatedWave } from "./_components/wave/AnimatedWave"; // Importe a onda!

export default function Page() {
  return (
    <main className="relative w-full overflow-x-clip">
      <Hero />
      
      <div className="relative z-10 bg-[#050505] w-full -mt-0.5">
      
        <AnimatedWave />
        
        <WorkSection />
        <Socials />
        <Footer />
      </div>
    </main>
  );
}