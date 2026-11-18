import React from 'react';
import {EDUCATION} from '../data/cvData';
import {TiltCard3D} from './TiltCard3D';

interface EducationSectionProps {
  compactView: boolean;
}

export const EducationSection: React.FC<EducationSectionProps> = ({compactView}) => {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className={`border-b border-zinc-900/10 dark:border-zinc-800 print:border-zinc-300 ${
        compactView ? 'py-8 print:py-4' : 'py-14 print:py-5'
      }`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <span className="font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400">
            02
          </span>
          <h2
            id="education-heading"
            className="mt-1 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 print:text-lg print:text-zinc-950"
          >
            Education
          </h2>
        </div>

        <div className="lg:col-span-8">
          {EDUCATION.map((edu) => (
            <TiltCard3D
              key={edu.id}
              maxTilt={3.5}
              className={`rounded-xl border border-zinc-900/10 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${
                compactView ? 'p-4' : 'p-6'
              } print:border-0 print:bg-transparent print:p-0`}
            >
              <h3 className="font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50 print:text-base">
                {edu.program}
              </h3>
            </TiltCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};
