import Reveal from '../../../shared/ui/Reveal';

const ITEMS = [
  {
    idx: '0.1',
    title: 'Финтех-прорыв года',
    desc: 'Награда по версии FINAWARD.',
  },
  {
    idx: '0.2',
    title: 'Продукт года',
    desc: 'Признание Национальной банковской премии.',
  },
  {
    idx: '0.3',
    title: 'Топ-50 технологических компаний',
    desc: 'В числе самых быстрорастущих технологических компаний России.',
  },
  {
    idx: '0.4',
    title: 'Интеграция с Госуслугами',
    desc: 'Интеграция с государственными цифровыми сервисами.',
  },
];

export default function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="scroll-mt-20 w-full bg-brand-soft transition-colors duration-700 py-24 md:py-32 px-5 md:px-14"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-brand-muted text-sm tracking-[0.1em] uppercase mb-10">Наши достижения</p>
        </Reveal>

        <div className="sib-dim">
          {ITEMS.map((item, i) => (
            <Reveal key={item.idx} delay={i * 0.1}>
              <div className="dim-item grid md:grid-cols-[80px_1fr] gap-6 py-10 border-t border-brand-line">
                <div className="w-12 h-8 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-sm inline-flex items-center justify-center">
                  {item.idx}
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-brand-ink">{item.title}</h3>
                  <p className="text-brand-muted text-base mt-2">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
