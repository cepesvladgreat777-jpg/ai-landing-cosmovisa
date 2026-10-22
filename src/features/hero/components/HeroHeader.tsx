import { ArrowUpRight } from 'lucide-react';
import SiteNavigation from '../../../shared/ui/SiteNavigation';

export function HeroHeader() {
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      <SiteNavigation />
      <a
        href="#services"
        className="anim fade inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-brand-line/70 bg-brand-soft/85 backdrop-blur-md px-4 py-2 text-xs text-brand-ink hover:bg-brand-soft transition-colors"
        style={{ animationDelay: '0.35s' }}
      >
        Цифровые сервисы Cosmovisa <ArrowUpRight className="w-3.5 h-3.5 text-brand-accent" />
      </a>
    </div>
  );
}
