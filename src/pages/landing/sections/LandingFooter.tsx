import { CONTACTS } from '../../../shared/content/contacts';
import { LEGAL_LINKS } from '../../../shared/content/legal';
import { NAV_LINKS } from '../../../shared/config/sections';

// FOOTER — dark. Wordmark + sibling-dim links, fine print, and an oversized
// low-opacity decorative wordmark.
export default function LandingFooter() {
  return (
    <footer
      id="footer"
      className="relative w-full bg-brand-deep text-brand-ink overflow-hidden px-5 md:px-14 pt-20 md:pt-24 pb-8 md:pb-10"
    >
      {/* Oversized decorative wordmark, very low opacity. Sits behind content
          (z-0); kept well below the fine print so it never overlaps it. */}
      <div
        className="pointer-events-none select-none absolute -bottom-2 md:-bottom-6 left-0 right-0 text-center font-display text-white/[0.04] leading-none z-0"
        style={{ fontSize: 'clamp(3.5rem, 20vw, 18rem)' }}
      >
        Cosmovisa
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10">
          <div>
            <a href="#top" className="text-brand-ink text-xl tracking-[-0.04em]">
              Cosmovisa
            </a>
            <p className="text-brand-muted text-sm mt-3 max-w-xs leading-relaxed">
              Экосистема цифровых финансовых сервисов.
            </p>
            <div className="flex flex-wrap gap-5 mt-6 text-sm text-brand-muted">
              <span>ВКонтакте — тут должна быть ссылка</span>
              <span>Telegram — тут должна быть ссылка</span>
            </div>
          </div>

          <nav
            aria-label="Навигация в подвале"
            className="sib-dim flex flex-col items-start gap-1.5 md:gap-3 md:items-end"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="dim-item text-brand-ink text-sm hover:text-brand-accent"
              >
                {link.label}
              </a>
            ))}
            <span className="text-brand-muted text-sm">Пресс-релизы — тут должна быть ссылка</span>
            <span className="text-brand-muted text-sm">Вход для клиентов — тут должна быть ссылка</span>
          </nav>
        </div>

        <div className="mt-16 pt-8 border-t border-brand-line text-xs leading-relaxed text-brand-muted">
          <p>Тут должно быть название компании · Тут должен быть ИНН · Тут должен быть ОГРН</p>
          <address className="not-italic mt-2 max-w-3xl">Тут должен быть адрес компании.</address>
          <p className="mt-5">Тут должны быть реквизиты и сведения о программном обеспечении.</p>
          <nav aria-label="Правовая информация" className="flex flex-wrap gap-x-5 gap-y-3 mt-8">
            {LEGAL_LINKS.map((link) => (
              <span key={link.label} className="text-brand-muted">
                {link.label} — тут должна быть ссылка
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-10 mb-10 sm:mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-brand-muted">
          <p>© 2026 · Тут должно быть название компании</p>
          <span className="text-brand-muted">{CONTACTS.phone}</span>
        </div>
      </div>
    </footer>
  );
}
