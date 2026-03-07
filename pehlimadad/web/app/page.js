import Hero from '../components/Hero';
import ImpactStrip from '../components/ImpactStrip';
import Problem from '../components/Problem';
import HowItWorks from '../components/HowItWorks';
import Screenshots from '../components/Screenshots';
import Languages from '../components/Languages';
import WhyAI from '../components/WhyAI';
import Architecture from '../components/Architecture';
import TryItNow from '../components/TryItNow';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <ImpactStrip />
      <Problem />
      <HowItWorks />
      <Screenshots />
      <Languages />
      <WhyAI />
      <Architecture />
      <TryItNow />
      <Footer />
    </main>
  );
}
