import { HeroSection } from '../../features/hero';
import { Screensaver } from '../../features/screensaver';
import { SectionNavigation } from '../../features/section-navigation';
import AboutSection from './sections/AboutSection';
import AchievementsSection from './sections/AchievementsSection';
import ServicesSection from './sections/ServicesSection';
import PricingSection from './sections/PricingSection';
import ContactsSection from './sections/ContactsSection';
import LandingFooter from './sections/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-page text-brand-ink tracking-[-0.02em]">
      <main>
        <HeroSection />
        <AboutSection />
        <AchievementsSection />
        <ServicesSection />
        <PricingSection />
        <ContactsSection />
      </main>
      <LandingFooter />
      <SectionNavigation />
      <Screensaver />
    </div>
  );
}
