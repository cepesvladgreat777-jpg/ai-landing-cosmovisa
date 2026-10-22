import Reveal from '../../../shared/ui/Reveal';
import { ServiceCard } from '../components/ServiceCard';
import { RELATED_SERVICES, SERVICES } from '../../../shared/content/services';

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-20 w-full bg-brand-page transition-colors duration-700 py-24 md:py-32 px-5 md:px-14"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-brand-muted text-sm tracking-[0.1em] uppercase mb-6">Наши сервисы</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl sm:text-5xl text-brand-ink tracking-[-0.02em]">
            Три сервиса. Больше возможностей.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {SERVICES.map((card, i) => (
            <Reveal key={card.name} delay={i * 0.1}>
              <ServiceCard service={card} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 pt-10 border-t border-brand-line">
            <p className="text-brand-muted text-sm mb-5">Также в экосистеме Cosmovisa</p>
            <div className="flex flex-wrap gap-3">
              {RELATED_SERVICES.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-brand-line bg-brand-soft/50 text-sm text-brand-muted px-4 py-2"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
