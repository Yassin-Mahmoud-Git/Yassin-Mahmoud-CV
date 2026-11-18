import React from 'react';
import {ArrowUpRight, Check, Copy, Download, Mail, Printer} from 'lucide-react';
import {PROFILE} from '../data/cvData';

interface ContactSectionProps {
  copiedEmail: boolean;
  onCopyEmail: () => void;
  onDownloadVCard: () => void;
  onPrint: () => void;
  compactView: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  copiedEmail,
  onCopyEmail,
  onDownloadVCard,
  onPrint,
  compactView,
}) => {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={`${compactView ? 'py-8' : 'py-14'} no-print`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <span className="font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400">
            05
          </span>
          <h2
            id="contact-heading"
            className="mt-1 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            Contact
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Based in {PROFILE.location}. Reach out directly via email or external profiles.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-zinc-900/12 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Direct Email
                </h3>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="mt-2 inline-flex items-center gap-2 font-display text-lg font-semibold text-zinc-950 transition-colors hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-50 dark:hover:text-rose-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span className="break-all">{PROFILE.email}</span>
                </a>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onCopyEmail}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-zinc-900/15 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 whitespace-nowrap shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>Email Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Online Profiles
                </h3>
                <ul className="mt-2 space-y-2.5">
                  <li>
                    <a
                      href={PROFILE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-rose-600 hover:decoration-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:text-rose-400"
                    >
                      <span>LinkedIn Profile</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-rose-600 hover:decoration-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:text-rose-400"
                    >
                      <span>GitHub Repositories</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-zinc-900/10 pt-5 dark:border-zinc-800">
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-rose-500 dark:hover:text-white whitespace-nowrap shrink-0"
              >
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                type="button"
                onClick={onDownloadVCard}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-zinc-900/15 bg-white px-4 py-2 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 whitespace-nowrap shrink-0"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download vCard (.vcf)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
