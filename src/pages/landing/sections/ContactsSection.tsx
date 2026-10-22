import Reveal from '../../../shared/ui/Reveal';
import { ArrowUpRight } from 'lucide-react';
import { CONTACTS } from '../../../shared/content/contacts';

const PAIRS = [
  { label: 'Горячая линия', value: CONTACTS.phone, note: 'Тут должно быть время работы.' },
  { label: 'Работа с партнёрами', value: CONTACTS.partners, note: CONTACTS.name },
  { label: 'Работа со СМИ', value: CONTACTS.press, note: 'Запросы для прессы' },
  { label: 'Общие вопросы', value: CONTACTS.general, note: 'Свяжитесь с Cosmovisa' },
];

export default function ContactsSection() {
  return (
    <section
      id="contacts"
      className="scroll-mt-20 w-full bg-brand-deep text-brand-ink transition-colors duration-700 px-5 md:px-14 py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-brand-muted text-sm tracking-[0.1em] uppercase mb-6">Свяжитесь с нами</p>
          <h2 className="font-display text-4xl sm:text-5xl leading-tight max-w-2xl">
            Обсудим сотрудничество.
          </h2>
          <p className="text-brand-muted mt-6 max-w-xl text-base leading-relaxed">
            Напишите нам — обсудим ваш запрос и предложим решение.
          </p>
          <button
            type="button"
            disabled
            title="Тут должен быть email"
            className="inline-flex items-center gap-8 rounded-full bg-brand-accent text-brand-contrast text-sm font-medium px-6 py-3.5 mt-8 hover:bg-brand-accent-hover transition-colors"
          >
            Тут должен быть email <ArrowUpRight className="w-4 h-4" />
          </button>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 mt-20 pt-10 border-t border-brand-line">
          {PAIRS.map((pair, i) => (
            <Reveal key={pair.label} delay={i * 0.1}>
              <div>
                <p className="text-brand-muted text-sm mb-2">{pair.label}</p>
                <p className="text-brand-ink text-base tracking-[-0.02em] break-words hover:text-brand-accent transition-colors">
                  {pair.value}
                </p>
                <p className="text-brand-muted text-xs leading-relaxed mt-3 max-w-xs">{pair.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
