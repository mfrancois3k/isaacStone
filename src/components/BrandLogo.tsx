import { BUSINESS } from '../data/site';

interface BrandLogoProps {
  /** `light` = light text, for ink surfaces. `dark` = dark text, for paper surfaces. */
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}

const NAME_SIZE = {
  sm: 'text-[17px]',
  md: 'text-[22px]',
} as const;

/**
 * The wordmark lockup: the name in Instrument Serif over a thin rule, with the
 * trade line in mono beneath. Pure — the caller supplies the link or button.
 */
export function BrandLogo({
  variant = 'dark',
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const onInk = variant === 'light';

  return (
    <span
      className={`inline-flex flex-col leading-none select-none ${
        onInk ? 'text-paper' : 'text-ink'
      } ${className}`}
    >
      <span className={`font-display font-normal leading-none ${NAME_SIZE[size]}`}>
        {BUSINESS.name}
      </span>
      <span
        aria-hidden="true"
        className={`mt-[6px] block h-px w-full ${onInk ? 'bg-paper/35' : 'bg-ink/25'}`}
      />
      <span
        className={`mt-[6px] font-mono text-[9px] uppercase leading-none tracking-[0.22em] ${
          onInk ? 'text-paper/70' : 'text-mute-2'
        }`}
      >
        {BUSINESS.tagline}
      </span>
    </span>
  );
}
