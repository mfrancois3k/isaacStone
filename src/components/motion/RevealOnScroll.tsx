import React from 'react';
import { motion, Variants } from 'motion/react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  amount?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 40,
  once = true,
  amount = 0.15,
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  };

  const variants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Signature Awwwards cubic bezier
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Masked text split reveal (Awwwards typography signature)
interface TextMaskRevealProps {
  text: string;
  className?: string;
  textClassName?: string;
  delay?: number;
  duration?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const TextMaskReveal: React.FC<TextMaskRevealProps> = ({
  text,
  className = '',
  textClassName = '',
  delay = 0,
  duration = 0.85,
  tag = 'div',
}) => {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      y: '110%',
      opacity: 0,
      rotateX: 15,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const Tag = tag;

  return (
    <Tag className={`overflow-hidden inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="inline-flex flex-wrap gap-x-[0.3em]"
      >
        {words.map((word, index) => (
          <span key={index} className="overflow-hidden inline-block py-0.5">
            <motion.span
              variants={child}
              className={`inline-block ${textClassName}`}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
};

// Architectural Section Header with animated brutalist red guide line
interface SectionHeaderProps {
  code: string;
  titlePart1: string;
  titleHighlight: string;
  titlePart2?: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  code,
  titlePart1,
  titleHighlight,
  titlePart2 = '',
  description,
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-white/20 pb-6 mb-12 gap-6 font-mono">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs text-[#D32F2F] font-bold tracking-widest uppercase mb-2 flex items-center gap-2"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-[2px] bg-[#D32F2F] origin-left inline-block"
          />
          <span>{code}</span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase"
          >
            {titlePart1} <span className="text-[#D32F2F]">{titleHighlight}</span> {titlePart2}
          </motion.h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm text-[#A0A6B2] max-w-md font-sans leading-relaxed"
          >
            {description}
          </motion.p>
        )}
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </div>
  );
};
