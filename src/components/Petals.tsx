import { useState, useEffect } from 'react';

interface PetalItem {
  id: number;
  char: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

const PETAL_CHARS = ['🌸', '🌺', '✿', '❁', '💮'];

export function Petals({ enabled = true }: { enabled?: boolean }) {
  const [petals, setPetals] = useState<PetalItem[]>([]);

  useEffect(() => {
    if (!enabled) {
      setPetals([]);
      return;
    }

    const initial = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      char: PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)],
      left: Math.random() * 96 + 2,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 3,
      size: 14 + Math.random() * 12,
    }));
    setPetals(initial);

    const interval = setInterval(() => {
      setPetals((prev) => {
        const next = [
          ...prev.slice(-16),
          {
            id: Date.now() + Math.random(),
            char: PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)],
            left: Math.random() * 96 + 2,
            duration: 8 + Math.random() * 6,
            delay: 0,
            size: 14 + Math.random() * 12,
          },
        ];
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal absolute select-none opacity-80"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
