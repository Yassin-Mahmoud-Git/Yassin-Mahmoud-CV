import React from 'react';
import {
  ArrowUpRight,
  Check,
  Command,
  Copy,
  Download,
  Mail,
  MapPin,
  Moon,
  Sun,
} from 'lucide-react';
import {PROFILE} from '../data/cvData';
import {Interactive3DStage, SpatialSelection} from './Interactive3DStage';

interface HeroAboutProps {
  copiedEmail: boolean;
  onCopyEmail: () => void;
  onDownloadVCard: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  compactView: boolean;
  onToggleCompactView: () => void;
  onOpenCommandPalette: () => void;
  selectedSkillId: string | null;
  onSelectSpatialItem: (item: SpatialSelection | null) => void;
}

const MARQUEE_ITEMS = [
  'Full-Stack Web Development',
  'Giza, Egypt',
  'Junior Instructor',
  'Cybersecurity',
  'AI-Assisted 3D & Android Workflows',
  'React',
  'TypeScript',
  'Node.js',
];

export const HeroAbout: React.FC<HeroAboutProps> = ({
  copiedEmail,
  onCopyEmail,
  onDownloadVCard,
  darkMode,
  onToggleDarkMode,
  compactView,
  onToggleCompactView,
  onOpenCommandPalette,
  selectedSkillId,
  onSelectSpatialItem,
}) => {
  const nameParts = PROFILE.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <section id="about" aria-labelledby="profile-heading" className="pt-8 sm:pt-12 print:pt-0">
      {/* Split Architectural Hero + Interactive 3D Stage */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Editorial Typography + Bio + Direct Actions */}
        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
              <span className="font-semibold text-rose-600 dark:text-rose-400 print:text-zinc-950">
                {PROFILE.title}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <span>{PROFILE.location}</span>
              </span>
            </div>

            <h1
              id="profile-heading"
              className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50 print:mt-2 print:text-4xl print:text-zinc-950"
              style={{textWrap: 'balance'}}
            >
              {firstName}{' '}
              <span className="italic font-medium text-zinc-700 dark:text-zinc-300 print:text-zinc-950">
                {lastName}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-[1.7] text-zinc-700 sm:text-[17px] dark:text-zinc-300 print:mt-3 print:text-[10.5pt] print:leading-relaxed print:text-zinc-800">
              {PROFILE.introduction}
            </p>
          </div>

          <div className="mt-8 space-y-4 print:mt-4 print:space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-rose-500 dark:hover:text-white print:bg-transparent print:p-0 print:text-xs print:text-zinc-900"
              >
                <Mail className="h-4 w-4 shrink-0 print:hidden" aria-hidden="true" />
                <span>{PROFILE.email}</span>
              </a>

              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-zinc-900/15 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-900/30 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 no-print"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onDownloadVCard}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-zinc-900/15 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-900/30 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 whitespace-nowrap shrink-0 no-print"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Save Contact (.vcf)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400 print:text-xs">
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-rose-600 hover:decoration-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-200 dark:decoration-zinc-700 dark:hover:text-rose-400 print:no-underline"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5 print:hidden" aria-hidden="true" />
              </a>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
                /
              </span>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-rose-600 hover:decoration-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-200 dark:decoration-zinc-700 dark:hover:text-rose-400 print:no-underline"
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 print:hidden" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Three.js Sculpture Viewport */}
        <div className="lg:col-span-6">
          <Interactive3DStage
            darkMode={darkMode}
            selectedSkillId={selectedSkillId}
            onSelectSpatialItem={onSelectSpatialItem}
          />
        </div>
      </div>

      {/* Interactive Workspace Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-900/10 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleCompactView}
            aria-pressed={compactView}
            className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
              compactView
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            <span>{compactView ? 'Compact Layout' : 'Editorial Layout'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 whitespace-nowrap shrink-0"
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Quick Actions (⌘K)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 whitespace-nowrap shrink-0"
        >
          {darkMode ? (
            <>
              <Sun className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle Editorial Marquee Ribbon Divider */}
      <div
        aria-hidden="true"
        className="marquee-container mt-8 overflow-hidden border-y border-zinc-900/10 py-3 dark:border-zinc-800 no-print"
      >
        <div className="animate-marquee flex w-max items-center gap-8 text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
              <span>{item}</span>
              <span className="text-rose-600 dark:text-rose-400">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
