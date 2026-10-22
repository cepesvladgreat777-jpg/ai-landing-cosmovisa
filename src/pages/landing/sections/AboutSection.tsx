import Reveal from '../../../shared/ui/Reveal';

const STATS = [
  { value: '5+ млн', label: 'клиентов' },
  { value: '2019', label: 'на рынке цифровых сервисов' },
  { value: '10+', label: 'уникальных IT-продуктов' },
  { value: 'Реестр ПО', label: 'российское программное обеспечение' },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 w-full bg-brand-page transition-colors duration-700 py-24 md:py-40 px-5 md:px-14"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-brand-muted text-sm tracking-[0.1em] uppercase mb-8">О Cosmovisa</p>
        </Reveal>

        <h2 className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-[-0.03em] text-brand-ink">
          <Reveal as="span" inline delay={0}>
            Разрабатываем и внедряем{' '}
          </Reveal>
          <Reveal as="span" inline delay={0.1}>
            цифровые финансовые сервисы{' '}
          </Reveal>
          <Reveal as="span" inline delay={0.2} className="font-display font-normal">
            с 2019 года.
          </Reveal>
        </h2>

        <Reveal delay={0.15}>
          <p className="max-w-2xl mt-10 text-brand-muted text-lg leading-relaxed">
            Cosmovisa — экосистема цифровых финансовых сервисов: от работы с кредитной историей и возврата
            платежей до поиска выгодных покупок по всему миру.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="surface-card relative overflow-hidden h-full rounded-2xl bg-brand-soft p-5 md:p-6">
                <div
                  aria-hidden="true"
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full border-[16px] border-brand-accent/10 pointer-events-none"
                />
                <p className="relative text-2xl sm:text-3xl lg:text-4xl tracking-[-0.04em] text-brand-ink">
                  {stat.value}
                </p>
                <p className="relative text-brand-muted text-sm mt-3 leading-relaxed">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mt-12 text-xs text-brand-muted">
            {['Сильная IT', 'Международные проекты', 'Надёжный партнёр', 'Новые технологии'].map((item) => (
              <span key={item} className="rounded-full border border-brand-line px-4 py-2">
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
