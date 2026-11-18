import React, {useRef, useState} from 'react';
import {motion, useMotionTemplate, useMotionValue, useSpring} from 'motion/react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  maxTilt = 5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const rotateX = useSpring(rawRotateX, {stiffness: 260, damping: 24});
  const rotateY = useSpring(rawRotateY, {stiffness: 260, damping: 24});

  const sheenBackground = useMotionTemplate`radial-gradient(360px circle at ${glowX}% ${glowY}%, rgba(225, 29, 72, 0.09), transparent 70%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rawRotateY.set((px - 0.5) * 2 * maxTilt);
    rawRotateX.set((0.5 - py) * 2 * maxTilt);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <div style={{perspective: 900}} className="h-full">
      <motion.div
        ref={ref}
        onPointerEnter={() => setHovered(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{rotateX, rotateY, transformStyle: 'preserve-3d'}}
        className={`relative h-full overflow-hidden transition-shadow duration-150 print:transform-none ${className}`}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-200 no-print"
          style={{
            background: sheenBackground,
            opacity: hovered ? 1 : 0,
          }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
};
