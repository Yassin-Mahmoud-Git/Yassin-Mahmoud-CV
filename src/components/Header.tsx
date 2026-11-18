import React, {useState} from 'react';
import {Menu, Printer, X} from 'lucide-react';
import {PROFILE} from '../data/cvData';

interface HeaderProps {
  activeSection: string;
  onPrint: () => void;
}

const NAV_ITEMS = [
  {id: 'experience', label: 'Experience'},
  {id: 'education', label: 'Education'},
  {id: 'skills', label: 'Skills'},
  {id: 'projects', label: 'Projects'},
  {id: 'contact', label: 'Contact'},
];

export const Header: React.FC<HeaderProps> = ({activeSection, onPrint}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/10 bg-[#F6F6F3]/90 backdrop-blur-md dark:border-zinc-800 dark:bg-[#09090B]/90 no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#about"
          className="font-display text-xl font-semibold tracking-tight text-zinc-950 transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-50 dark:hover:text-rose-400 whitespace-nowrap shrink-0"
        >
          {PROFILE.name}
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                  isActive
                    ? 'text-zinc-950 dark:text-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 bg-rose-600 transition-transform duration-150 dark:bg-rose-400 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-rose-500 dark:hover:text-white dark:focus-visible:ring-offset-zinc-950 whitespace-nowrap shrink-0"
          >
            <Printer className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-900/15 bg-white text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 md:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-zinc-900/10 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-900"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                About
              </a>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
