export interface ExperienceEntry {
  id: string;
  role: string;
}

export interface EducationEntry {
  id: string;
  program: string;
}

export type SkillCategory = 'All' | 'Frontend' | 'Languages & Runtime' | 'AI & Workflow';

export interface SkillItem {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'All'>;
}

export interface ProjectItem {
  id: string;
  title: string;
  url: string;
}

export const PROFILE = {
  name: 'Yassin Mahmoud',
  title: 'Full-Stack Web Developer',
  location: 'Giza, Egypt',
  introduction:
    'I have over four years of experience in web development. I use AI professionally to help create websites, 3D models, and Android apps. I also work as a junior instructor at multiple academies and am continuing to develop my knowledge of cybersecurity.',
  email: 'yassin.mahmoud.ln@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yassin-mahmoud-691b9a2b8',
  github: 'https://github.com/Yassin-Mahmoud-Git',
} as const;

export const EXPERIENCES: ExperienceEntry[] = [
  {
    id: 'exp-web-dev',
    role: 'Over four years of web development experience',
  },
  {
    id: 'exp-instructor',
    role: 'Junior instructor at multiple academies',
  },
  {
    id: 'exp-cybersecurity',
    role: 'Continuing to build knowledge in cybersecurity',
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    id: 'edu-ib',
    program: 'International Baccalaureate (IB) student',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  'All',
  'Frontend',
  'Languages & Runtime',
  'AI & Workflow',
];

export const SKILLS: SkillItem[] = [
  {id: 'html', name: 'HTML', category: 'Frontend'},
  {id: 'css', name: 'CSS', category: 'Frontend'},
  {id: 'react', name: 'React', category: 'Frontend'},
  {id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend'},
  {id: 'javascript', name: 'JavaScript', category: 'Languages & Runtime'},
  {id: 'typescript', name: 'TypeScript', category: 'Languages & Runtime'},
  {id: 'nodejs', name: 'Node.js', category: 'Languages & Runtime'},
  {id: 'ai-tools', name: 'Professional use of AI tools', category: 'AI & Workflow'},
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'cyber-simulator',
    title: 'Cyber Attacks Simulator Prototype',
    url: 'https://lnkd.in/eVzipr_A',
  },
  {
    id: 'arabic-cyber-info',
    title: 'Arabic-Language Cyber Attacks Information Website',
    url: 'https://lnkd.in/e4z_PXrT',
  },
];
