import { useState } from 'react';
import { Asterisk, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../config/sections';

export default function SiteNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Главная навигация"
      className="anim fade relative flex items-center gap-2"
      style={{ animationDelay: '0.2s' }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      <a
        href="#top"
        aria-label="Cosmovisa — на главную"
        onClick={() => setOpen(false)}
        className="w-10 h-10 rounded-full border border-brand-line bg-brand-soft/85 backdrop-blur-md flex items-center justify-center text-brand-accent hover:bg-brand-soft transition-colors shrink-0"
      >
        <Asterisk className="w-4 h-4" strokeWidth={2} />
      </a>

      <div className="hidden md:flex border border-brand-line bg-brand-soft/85 backdrop-blur-md rounded-full px-2 py-2 items-center gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-4 py-1.5 rounded-full text-sm text-brand-ink hover:bg-white/10 transition-colors"
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          disabled
          title="Тут должна быть ссылка на вход"
          className="px-4 py-1.5 rounded-full bg-brand-accent text-brand-contrast text-sm font-medium hover:bg-brand-accent-hover transition-colors"
        >
          Войти
        </button>
      </div>

      <button
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
        className="md:hidden w-10 h-10 rounded-full border border-brand-line bg-brand-soft/85 text-brand-ink backdrop-blur-md flex items-center justify-center hover:bg-brand-soft transition-colors"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <div
          id="mobile-navigation"
          className="md:hidden absolute top-24 left-1/2 -translate-x-1/2 z-[60] w-64 rounded-2xl border border-brand-line bg-brand-soft/95 text-brand-ink backdrop-blur-xl p-2 shadow-xl"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            disabled
            title="Тут должна быть ссылка на вход"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm font-medium bg-brand-accent text-brand-contrast"
          >
            Вход для клиентов
          </button>
        </div>
      )}
    </nav>
  );
}
