import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ArrowRight,
  Copy,
  Download,
  ExternalLink,
  Moon,
  Printer,
  Search,
  Sun,
  X,
} from 'lucide-react';
import {PROFILE} from '../data/cvData';

interface CommandAction {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions' | 'External';
  icon: React.ReactNode;
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  onCopyEmail: () => void;
  onDownloadVCard: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onPrint,
  onCopyEmail,
  onDownloadVCard,
  darkMode,
  onToggleDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<CommandAction[]>(() => {
    const jumpTo = (id: string) => {
      onClose();
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({behavior: 'smooth'});
      }
    };

    const openExternal = (url: string) => {
      onClose();
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    };

    return [
      {
        id: 'print',
        label: 'Print / Save CV as PDF',
        group: 'Actions',
        icon: <Printer className="h-4 w-4" aria-hidden="true" />,
        run: () => {
          onClose();
          window.setTimeout(() => onPrint(), 120);
        },
      },
      {
        id: 'copy-email',
        label: `Copy Email (${PROFILE.email})`,
        group: 'Actions',
        icon: <Copy className="h-4 w-4" aria-hidden="true" />,
        run: () => {
          onCopyEmail();
          onClose();
        },
      },
      {
        id: 'download-vcf',
        label: 'Download Contact Card (.vcf)',
        group: 'Actions',
        icon: <Download className="h-4 w-4" aria-hidden="true" />,
        run: () => {
          onDownloadVCard();
          onClose();
        },
      },
      {
        id: 'toggle-theme',
        label: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        group: 'Actions',
        icon: darkMode ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        ),
        run: () => {
          onToggleDarkMode();
          onClose();
        },
      },
      {
        id: 'nav-about',
        label: 'Go to About & 3D Stage',
        group: 'Navigate',
        icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
        run: () => jumpTo('about'),
      },
      {
        id: 'nav-experience',
        label: 'Go to Experience',
        group: 'Navigate',
        icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
        run: () => jumpTo('experience'),
      },
      {
        id: 'nav-education',
        label: 'Go to Education',
        group: 'Navigate',
        icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
        run: () => jumpTo('education'),
      },
      {
        id: 'nav-skills',
        label: 'Go to Skills',
        group: 'Navigate',
        icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
        run: () => jumpTo('skills'),
      },
      {
        id: 'nav-projects',
        label: 'Go to Projects',
        group: 'Navigate',
        icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
        run: () => jumpTo('projects'),
      },
      {
        id: 'nav-contact',
        label: 'Go to Contact',
        group: 'Navigate',
        icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
        run: () => jumpTo('contact'),
      },
      {
        id: 'ext-linkedin',
        label: 'Open LinkedIn Profile',
        group: 'External',
        icon: <ExternalLink className="h-4 w-4" aria-hidden="true" />,
        run: () => openExternal(PROFILE.linkedin),
      },
      {
        id: 'ext-github',
        label: 'Open GitHub Profile',
        group: 'External',
        icon: <ExternalLink className="h-4 w-4" aria-hidden="true" />,
        run: () => openExternal(PROFILE.github),
      },
    ];
  }, [
    darkMode,
    onClose,
    onCopyEmail,
    onDownloadVCard,
    onPrint,
    onToggleDarkMode,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
      );
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].run();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick Actions Palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/50 px-4 pt-20 backdrop-blur-xs no-print"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections or quick actions..."
            aria-label="Search quick actions"
            className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick actions"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No matching actions found.
            </li>
          ) : (
            filtered.map((action, index) => {
              const active = index === selectedIndex;
              return (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={action.run}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      active
                        ? 'bg-zinc-950 text-white dark:bg-rose-600 dark:text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className={active ? 'text-white' : 'text-zinc-400'}>
                        {action.icon}
                      </span>
                      <span className="truncate font-medium">{action.label}</span>
                    </span>
                    <span
                      className={`text-xs whitespace-nowrap shrink-0 ${
                        active ? 'text-zinc-300 dark:text-rose-100' : 'text-zinc-400'
                      }`}
                    >
                      {action.group}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
