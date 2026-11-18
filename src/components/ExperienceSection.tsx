import React, {useState} from 'react';
import {EXPERIENCES} from '../data/cvData';
import {TiltCard3D} from './TiltCard3D';

interface ExperienceSectionProps {
  compactView: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({compactView}) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className={`border-b border-zinc-900/10 dark:border-zinc-800 print:border-zinc-300 ${
        compactView ? 'py-8 print:py-4' : 'py-14 print:py-5'
      }`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <span className="font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400">
            01
          </span>
          <h2
            id="experience-heading"
            className="mt-1 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 print:text-lg print:text-zinc-950"
          >
            Experience
          </h2>

          {/* Interactive Focus Selector */}
          <div className="mt-5 hidden lg:flex flex-col gap-1 no-print">
            {EXPERIENCES.map((item, idx) => {
              const isSelected = focusedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFocusedId(isSelected ? null : item.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                    isSelected
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`}
                >
                  <span className="font-mono tabular-nums opacity-60">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{item.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="space-y-4 print:space-y-2.5">
            {EXPERIENCES.map((item, idx) => {
              const isFocused = focusedId === item.id;

              return (
                <li
                  key={item.id}
                  onMouseEnter={() => setFocusedId(item.id)}
                  onMouseLeave={() => setFocusedId(null)}
                >
                  <TiltCard3D
                    maxTilt={3.5}
                    className={`rounded-xl border transition-colors ${
                      compactView ? 'p-4' : 'p-6'
                    } ${
                      isFocused
                        ? 'border-rose-600/45 bg-white shadow-sm dark:border-rose-500/45 dark:bg-zinc-900'
                        : 'border-zinc-900/10 bg-white/85 dark:border-zinc-800 dark:bg-zinc-900/60'
                    } print:border-0 print:border-b print:border-zinc-200 print:bg-transparent print:p-0 print:pb-2.5 print:rounded-none`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`font-mono text-xs tabular-nums transition-colors ${
                          isFocused
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50 print:text-base">
                        {item.role}
                      </h3>
                    </div>
                  </TiltCard3D>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
