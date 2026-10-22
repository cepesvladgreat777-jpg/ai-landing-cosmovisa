import { PricingCard } from '../components/PricingCard';
import Reveal from '../../../shared/ui/Reveal';
import { CONTACTS } from '../../../shared/content/contacts';
import { SERVICES } from '../../../shared/content/services';

export default function PricingSection() {
  return (
    <section id="tariffs" className="scroll-mt-20 bg-brand-soft py-24 md:py-32 px-5 md:px-14">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-brand-muted text-sm tracking-[0.1em] uppercase mb-6">Тарифы</p>
          <h2 className="font-display text-4xl sm:text-5xl text-brand-ink">Прозрачные условия.</h2>
          <p className="text-brand-muted mt-5 max-w-xl leading-relaxed">
            Индивидуальный подход к каждому клиенту.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {SERVICES.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.1}>
              <PricingCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="max-w-2xl text-brand-muted text-sm leading-relaxed mt-10">
            Каждый проект уникален, поэтому стоимость рассчитывается индивидуально. Для расчёта напишите на{' '}
            <span className="text-brand-ink">{CONTACTS.partners}</span>. Обсудим ваш запрос и предложим
            решение.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
