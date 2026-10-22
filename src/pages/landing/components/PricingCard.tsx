import { ArrowUpRight } from 'lucide-react';
import type { Service } from '../../../shared/types/content';

export function PricingCard({ service }: { service: Service }) {
  return (
    <article className="surface-card h-full rounded-2xl bg-brand-page p-7 flex flex-col">
      <p className="text-brand-muted text-xs tracking-widest mb-8">{service.code}</p>
      <h3 className="text-xl text-brand-ink">{service.name}</h3>
      <p className="text-sm text-brand-muted leading-relaxed mt-3 mb-10">{service.summary}</p>
      <p className="text-4xl tracking-[-0.04em] text-brand-ink mt-auto mb-8 whitespace-nowrap">
        {service.price}
      </p>
      <a
        href="#contacts"
        className="inline-flex items-center justify-between gap-3 rounded-full bg-brand-accent text-brand-contrast px-5 py-3 text-sm font-medium hover:bg-brand-accent-hover transition-colors"
      >
        Обсудить подключение <ArrowUpRight className="w-4 h-4 shrink-0" />
      </a>
    </article>
  );
}
