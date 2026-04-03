import { BgSlideshow } from '@/components/ui/bg-slideshow';
import { Hero } from '@/sections/Hero';
import { Playground } from '@/sections/Playground';
import { HowItWorks } from '@/sections/HowItWorks';
import { Features } from '@/sections/Features';
import { CodeExample } from '@/sections/CodeExample';
import { Comparison } from '@/sections/Comparison';
import { Footer } from '@/sections/Footer';

export function App() {
  return (
    <div className="relative min-h-screen">
      <BgSlideshow />
      <div className="relative z-10">
        <Hero />
        <Playground />
        <HowItWorks />
        <Features />
        <CodeExample />
        <Comparison />
        <Footer />
      </div>
    </div>
  );
}
