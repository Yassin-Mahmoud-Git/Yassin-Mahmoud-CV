import React, {useState} from 'react';
import {Check, Copy} from 'lucide-react';
import {SKILL_CATEGORIES, SKILLS, SkillCategory} from '../data/cvData';

interface SkillsSectionProps {
  compactView: boolean;
  selectedSkillId: string | null;
  onSelectSkill: (skillId: string | null) => void;
  onNotify: (message: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  compactView,
  selectedSkillId,
  onSelectSkill,
  onNotify,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All');
  const [copiedSkills, setCopiedSkills] = useState(false);

  const visibleSkills =
    selectedCategory === 'All'
      ? SKILLS
      : SKILLS.filter((skill) => skill.category === selectedCategory);

  const selectedSkill = SKILLS.find((s) => s.id === selectedSkillId) ?? null;

  const handleCopySkills = async () => {
    const text = visibleSkills.map((s) => s.name).join(', ');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedSkills(true);
      onNotify(`Copied ${visibleSkills.length} skills`);
      window.setTimeout(() => setCopiedSkills(false), 1800);
    } catch {
      onNotify(text);
    }
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className={`border-b border-zinc-900/10 dark:border-zinc-800 print:border-zinc-300 ${
        compactView ? 'py-8 print:py-4' : 'py-14 print:py-5'
      }`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <span className="font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400">
            03
          </span>
          <h2
            id="skills-heading"
            className="mt-1 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 print:text-lg print:text-zinc-950"
          >
            Skills
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 no-print">
            Filter by category or select a skill to highlight its prism in the 3D sculpture.
          </p>

          <button
            type="button"
            onClick={handleCopySkills}
            className="mt-4 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-zinc-900/15 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-900/30 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 no-print"
          >
            {copiedSkills ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Skills Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy Visible Skills</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-8">
          {/* Interactive Category Filter */}
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="mb-5 inline-flex flex-wrap items-center gap-1 rounded-lg border border-zinc-900/10 bg-zinc-900/5 p-1 dark:border-zinc-800 dark:bg-zinc-900 no-print"
          >
            {SKILL_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedCategory(category);
                    onSelectSkill(null);
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                    isSelected
                      ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-4 print:gap-2">
            {SKILLS.map((skill, idx) => {
              const matches =
                selectedCategory === 'All' || skill.category === selectedCategory;
              const isFocused = selectedSkillId === skill.id;

              return (
                <li
                  key={skill.id}
                  className={matches ? 'block' : 'hidden print:block'}
                >
                  <button
                    type="button"
                    onClick={() => onSelectSkill(isFocused ? null : skill.id)}
                    aria-pressed={isFocused}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 ${
                      isFocused
                        ? 'border-rose-600 bg-white shadow-sm dark:border-rose-500 dark:bg-zinc-900'
                        : 'border-zinc-900/10 bg-white hover:-translate-y-0.5 hover:border-zinc-900/25 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                    } print:border-zinc-300 print:bg-transparent print:px-2.5 print:py-1.5 print:rounded-md`}
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span
                        className={`font-mono text-xs tabular-nums transition-colors ${
                          isFocused
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-zinc-400 dark:text-zinc-500'
                        } print:hidden`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-100 print:text-xs print:font-medium">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap shrink-0 print:hidden">
                      {skill.category}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selectedSkill && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-zinc-900/10 bg-white px-4 py-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 no-print">
              <span>
                Highlighted in 3D &amp; CV:{' '}
                <strong className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {selectedSkill.name}
                </strong>
                <span aria-hidden="true"> · </span>
                <span>{selectedSkill.category}</span>
              </span>
              <button
                type="button"
                onClick={() => onSelectSkill(null)}
                className="font-medium text-rose-600 hover:underline dark:text-rose-400"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
