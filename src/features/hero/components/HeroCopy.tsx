import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../../../shared/content/services';

export function HeroCopy() {
  return (
    <div className="absolute bottom-16 left-5 right-5 md:left-14 md:right-auto max-w-2xl z-50">
      <p className="text-sm font-medium text-brand-ink mb-3">Cosmovisa</p>

      <h1 className="text-brand-ink leading-[1.08]">
        <span
          className="anim reveal block font-display text-3xl min-[390px]:text-4xl sm:text-5xl md:text-6xl"
          style={{ animationDelay: '0.4s' }}
        >
          Цифровые сервисы
        </span>
        <span
          className="anim reveal block text-3xl min-[390px]:text-4xl sm:text-5xl md:text-6xl"
          style={{ animationDelay: '0.55s', letterSpacing: '-0.04em' }}
        >
          для ваших финансов.
        </span>
      </h1>

      <a
        href="#contacts"
        className="anim fade mt-5 inline-flex items-center gap-8 rounded-full bg-brand-accent text-brand-contrast px-5 py-3 text-sm font-medium hover:bg-brand-accent-hover transition-colors"
        style={{ animationDelay: '0.65s' }}
      >
        Обсудить сотрудничество <ArrowUpRight className="w-4 h-4 shrink-0" />
      </a>

      <div
        className="anim fade mt-6 flex items-center gap-2 text-sm flex-wrap"
        style={{ animationDelay: '0.75s' }}
      >
        <span className="text-brand-muted">Сервисы</span>
        {SERVICES.map((service) => (
          <a
            key={service.id}
            href={`#${service.id}`}
            className="px-3 py-1 rounded-full border border-brand-line bg-brand-soft/80 text-brand-ink text-xs hover:bg-brand-accent transition-colors"
          >
            {service.name === 'Чарджбэк (Cosmovisa)' ? 'Чарджбэк' : service.name}
          </a>
        ))}
      </div>
    </div>
  );
}
