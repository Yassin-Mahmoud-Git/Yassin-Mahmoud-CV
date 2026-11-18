import {useCallback, useEffect, useState} from 'react';
import {MotionConfig} from 'motion/react';
import {ArrowUp} from 'lucide-react';
import {CommandPalette} from './components/CommandPalette';
import {ContactSection} from './components/ContactSection';
import {EducationSection} from './components/EducationSection';
import {ExperienceSection} from './components/ExperienceSection';
import {Header} from './components/Header';
import {HeroAbout} from './components/HeroAbout';
import {SpatialSelection} from './components/Interactive3DStage';
import {ProjectsSection} from './components/ProjectsSection';
import {SkillsSection} from './components/SkillsSection';
import {PROFILE} from './data/cvData';

const THEME_STORAGE_KEY = 'yassin_cv_theme_v1';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('experience');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [compactView, setCompactView] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage failures
    }
  }, [darkMode]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const sectionIds = ['about', 'experience', 'education', 'skills', 'projects', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0.05,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const showToast = useCallback((message: string) => {
    setStatusMessage(message);
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const handleSelectSpatialItem = useCallback(
    (item: SpatialSelection | null) => {
      if (!item) return;
      if (item.kind === 'skill' && item.skillId) {
        setSelectedSkillId(item.skillId);
        showToast(`Selected skill: ${item.title}`);
      } else {
        showToast(item.title);
      }
    },
    [showToast]
  );

  const handleCopyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(PROFILE.email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = PROFILE.email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedEmail(true);
      showToast('Email copied to clipboard');
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      showToast(`Email: ${PROFILE.email}`);
    }
  }, [showToast]);

  const handleDownloadVCard = useCallback(() => {
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Mahmoud;Yassin;;;',
      `FN:${PROFILE.name}`,
      `TITLE:${PROFILE.title}`,
      `EMAIL;TYPE=INTERNET:${PROFILE.email}`,
      `ADR;TYPE=HOME:;;Giza;;;Egypt`,
      `URL:${PROFILE.linkedin}`,
      `X-SOCIALPROFILE;TYPE=github:${PROFILE.github}`,
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vcardLines], {type: 'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Yassin_Mahmoud.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Contact card downloaded');
  }, [showToast]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F6F6F3] text-zinc-950 transition-colors dark:bg-[#09090B] dark:text-zinc-100 print:bg-white print:text-zinc-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white no-print"
        >
          Skip to content
        </a>

        <Header activeSection={activeSection} onPrint={handlePrint} />

        <main id="main-content" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <HeroAbout
            copiedEmail={copiedEmail}
            onCopyEmail={handleCopyEmail}
            onDownloadVCard={handleDownloadVCard}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((prev) => !prev)}
            compactView={compactView}
            onToggleCompactView={() => setCompactView((prev) => !prev)}
            onOpenCommandPalette={() => setCommandOpen(true)}
            selectedSkillId={selectedSkillId}
            onSelectSpatialItem={handleSelectSpatialItem}
          />

          <ExperienceSection compactView={compactView} />

          <EducationSection compactView={compactView} />

          <SkillsSection
            compactView={compactView}
            selectedSkillId={selectedSkillId}
            onSelectSkill={setSelectedSkillId}
            onNotify={showToast}
          />

          <ProjectsSection compactView={compactView} />

          <ContactSection
            copiedEmail={copiedEmail}
            onCopyEmail={handleCopyEmail}
            onDownloadVCard={handleDownloadVCard}
            onPrint={handlePrint}
            compactView={compactView}
          />
        </main>

        <footer className="border-t border-zinc-900/10 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/40 no-print">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-zinc-500 sm:px-6 lg:px-8 dark:text-zinc-400">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                {PROFILE.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE.title}</span>
              <span aria-hidden="true">·</span>
              <span>{PROFILE.location}</span>
            </div>

            <a
              href="#about"
              className="inline-flex items-center gap-1 font-medium text-zinc-700 transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-300 dark:hover:text-rose-400 whitespace-nowrap shrink-0"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </footer>

        <CommandPalette
          isOpen={commandOpen}
          onClose={() => setCommandOpen(false)}
          onPrint={handlePrint}
          onCopyEmail={handleCopyEmail}
          onDownloadVCard={handleDownloadVCard}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />

        {/* Accessible status notification */}
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-5 right-5 z-50 no-print"
        >
          {statusMessage && (
            <div className="rounded-lg border border-zinc-900/10 bg-zinc-950 px-4 py-2.5 text-xs font-medium text-white shadow-lg dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-950">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
