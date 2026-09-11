import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  overlay?: React.ReactNode;
  showCrosshairs?: boolean;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-[16/10]',
  overlay,
  showCrosshairs = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.04, 1.1]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black ${aspectRatio} ${containerClassName}`}
    >
      <motion.img
        style={{ y, scale }}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 ${className}`}
      />

      {/* Brutalist Corner Registration L-Brackets */}
      {showCrosshairs && (
        <>
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#bf1d1a] pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#bf1d1a] pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#bf1d1a] pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#bf1d1a] pointer-events-none" />
        </>
      )}

      {overlay}
    </div>
  );
};
