import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {PROJECTS} from '../data/cvData';
import {TiltCard3D} from './TiltCard3D';

interface ProjectsSectionProps {
  compactView: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({compactView}) => {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className={`border-b border-zinc-900/10 dark:border-zinc-800 print:border-zinc-300 ${
        compactView ? 'py-8 print:py-4' : 'py-14 print:py-5'
      }`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <span className="font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400">
            04
          </span>
          <h2
            id="projects-heading"
            className="mt-1 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 print:text-lg print:text-zinc-950"
          >
            Projects
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 no-print">
            Selected links. Click any project title to open it in a new tab.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-1 print:gap-2">
            {PROJECTS.map((project, idx) => (
              <article key={project.id} className="h-full">
                <TiltCard3D
                  maxTilt={5}
                  className={`group flex flex-col justify-between rounded-2xl border border-zinc-900/12 bg-white hover:border-rose-600/45 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-rose-500/45 ${
                    compactView ? 'p-5' : 'p-6'
                  } print:border-0 print:border-b print:border-zinc-200 print:bg-transparent print:p-0 print:pb-2.5 print:rounded-none`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-2xl font-medium tabular-nums text-zinc-300 transition-colors group-hover:text-rose-600 dark:text-zinc-700 dark:group-hover:text-rose-400 print:text-xs print:text-zinc-500">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900/10 text-zinc-500 transition-colors group-hover:border-rose-600 group-hover:bg-rose-600 group-hover:text-white dark:border-zinc-800 dark:text-zinc-400 print:hidden"
                        >
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>

                      <h3 className="mt-4 print:mt-1">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-display text-xl font-semibold leading-snug text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-rose-600 hover:decoration-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-50 dark:decoration-zinc-700 dark:hover:text-rose-400 dark:hover:decoration-rose-400 print:text-base print:no-underline"
                        >
                          {project.title}
                        </a>
                      </h3>
                    </div>

                    <div className="mt-5 border-t border-zinc-900/8 pt-3 dark:border-zinc-800 print:mt-1 print:border-none print:pt-0">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate font-mono text-xs text-zinc-500 transition-colors hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 print:text-zinc-700"
                      >
                        {project.url}
                      </a>
                    </div>
                  </div>
                </TiltCard3D>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
