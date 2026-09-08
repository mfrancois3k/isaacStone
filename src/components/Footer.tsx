import { BUSINESS } from '../data/site';

interface FooterProps {
  onOpenPrivacy: () => void;
  /** Kept for the App's existing wiring; the footer itself has no replay control. */
  onReplayLoader?: () => void;
}

const LINK_CLASS =
  'label text-paper no-underline transition-colors hover:text-brand-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand';

export function Footer({ onOpenPrivacy }: FooterProps) {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden border-t-2 border-brand bg-ink-deep text-paper">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-[clamp(30px,4vw,60px)] px-7 pb-10 pt-[clamp(56px,7vw,110px)]">
        {/* Wordmark */}
        <p className="display m-0 text-[clamp(48px,12.4vw,190px)] leading-[0.84] tracking-[-0.05em] text-paper">
          <span className="block">Isaac Stone</span>
          <span className="block">
            <em className="italic text-brand-soft">and</em> Tile
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-t border-ink-line pt-6">
          <p className="m-0 font-sans text-[14px] leading-[1.5] text-mute">
            © {new Date().getFullYear()} {BUSINESS.legalName}
            <br />
            {BUSINESS.city}, {BUSINESS.state}
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-[26px]">
            <a href={BUSINESS.phoneHref} className={LINK_CLASS}>
              {BUSINESS.phone}
            </a>
            <a href={`mailto:${BUSINESS.email}`} className={LINK_CLASS}>
              EMAIL
            </a>
            <a
              href={BUSINESS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              INSTAGRAM
            </a>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className={`${LINK_CLASS} cursor-pointer border-none bg-transparent p-0 text-mute`}
            >
              PRIVACY
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className={`${LINK_CLASS} cursor-pointer border-none bg-transparent p-0 text-mute`}
            >
              TOP ↑
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
