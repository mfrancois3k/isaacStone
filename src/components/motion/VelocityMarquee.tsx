import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue
} from 'motion/react';

interface VelocityMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  children,
  baseVelocity = 0.4,
  className = '',
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 70,
    stiffness: 200,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 0.8], {
    clamp: false,
  });

  // Calm, steady architectural drift
  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000);

    // Mild scroll influence without wild acceleration
    const factor = velocityFactor.get();
    moveBy += Math.min(Math.max(factor * 0.2, -0.3), 0.3) * moveBy;

    baseX.set(baseX.get() - moveBy * 3.5);

    // wrap around
    if (baseX.get() <= -50) {
      baseX.set(0);
    } else if (baseX.get() > 0) {
      baseX.set(-50);
    }
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div className={`overflow-hidden whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div className="flex flex-nowrap shrink-0" style={{ x }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </motion.div>
    </div>
  );
};
