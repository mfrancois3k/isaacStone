import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { BUSINESS, NAV_LINKS } from '../data/site';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  /** Optional easter egg — double-click the wordmark to replay the intro. */
  onReplayLoader?: () => void;
}

export function Navbar({ onReplayLoader }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The bar sits over the ink hero panel, so it starts transparent with light
  // text and only takes a paper background once the hero has passed.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const linkColor = scrolled ? 'text-ink' : 'text-paper';
  const pillBorder = scrolled ? 'border-ink' : 'border-paper';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-colors duration-500 ${
          scrolled ? 'bg-paper border-b border-sand' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-7">
          <a
            href="#hero"
            onDoubleClick={onReplayLoader}
            className={`border-l-[3px] pl-3 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
              scrolled ? 'border-ink' : 'border-paper'
            }`}
          >
            <BrandLogo variant={scrolled ? 'dark' : 'light'} size="md" />
          </a>

          <nav
            aria-label="Main"
            className="hidden items-center gap-6 font-mono text-[10px] tracking-[0.16em] md:flex lg:gap-7"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`no-underline transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${linkColor}`}
              >
                {link.index} {link.label}
              </a>
            ))}
          </nav>

          <a
            href={BUSINESS.phoneHref}
            className={`hidden min-h-[44px] items-center whitespace-nowrap border px-4 py-[11px] font-mono text-[11px] tracking-[0.14em] no-underline transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand md:flex ${pillBorder} ${linkColor}`}
          >
            {BUSINESS.phone}
          </a>
        </div>
      </header>

      {/* Mobile: a bottom bar with a call button and a menu toggle. */}
      {menuOpen && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 bottom-14 z-40 border-t border-ink-line bg-ink md:hidden"
        >
          <nav aria-label="Main" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-ink-line px-6 py-4 font-mono text-[11px] tracking-[0.16em] text-paper no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {link.index} {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-[45] flex gap-px border-t border-ink-line bg-ink-line md:hidden">
        <a
          href={BUSINESS.phoneHref}
          className="flex min-h-[56px] flex-1 items-center justify-center gap-2 bg-ink-deep px-3 py-3.5 font-sans text-[15px] font-bold text-paper no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {BUSINESS.phone}
        </a>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          className="flex min-h-[56px] flex-1 items-center justify-center gap-2 bg-brand px-3 py-3.5 font-sans text-[15px] font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          {menuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </>
  );
}
