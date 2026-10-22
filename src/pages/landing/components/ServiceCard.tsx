import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Service } from '../../../shared/types/content';
import { publicAsset } from '../../../shared/lib/publicAsset';

export function ServiceCard({ service: card }: { service: Service }) {
  return (
    <article
      id={card.id}
      className="surface-card group scroll-mt-24 h-full rounded-2xl bg-brand-soft p-4 flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] hover:border-brand-accent/50"
    >
      {/* image panel */}
      <div className="service-art relative aspect-[4/3] shrink-0 rounded-xl overflow-hidden border border-brand-line">
        <img
          src={publicAsset(card.image)}
          alt={card.alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain px-5 pt-6 pb-9 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        {/* soft top fade so labels stay legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-brand-accent text-brand-contrast inline-flex items-center justify-center text-sm font-medium">
          {card.code}
        </span>
        <span className="absolute bottom-3 right-3 text-[10px] tracking-[0.18em] text-brand-contrast">
          {card.tag}
        </span>
      </div>

      {/* text */}
      <div className="px-2 pt-5 pb-2 flex-1 flex flex-col">
        <h3 className="text-xl text-brand-ink">{card.name}</h3>
        <p className="text-brand-muted text-sm mt-3 leading-relaxed">{card.summary}</p>
        <details className="group/details mt-5">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm text-brand-ink py-2">
            Подробнее о сервисе
            <ArrowDown className="w-4 h-4 shrink-0 transition-transform group-open/details:rotate-180" />
          </summary>
          <ul className="list-disc pl-4 space-y-3 text-sm leading-relaxed text-brand-muted mt-3 pb-4">
            {card.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </details>
        <a
          href="#tariffs"
          className="inline-flex items-center justify-between gap-3 mt-auto pt-6 text-sm text-brand-accent hover:text-brand-accent-hover"
        >
          Посмотреть тариф <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}
