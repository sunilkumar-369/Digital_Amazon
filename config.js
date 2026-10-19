import {
  Code2, BookOpen, GraduationCap, Palette, Music, Video, LayoutTemplate, Package,
} from 'lucide-react';

export const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';
export const SHOW_SAMPLES = (import.meta.env.VITE_SHOW_SAMPLES ?? 'true') !== 'false';
// Sample listings are shown only while fewer than this many real products exist
export const SAMPLE_THRESHOLD = 8;

export const CATEGORIES = [
  { name: 'Templates', icon: LayoutTemplate, tint: 'bg-orange-50 text-accent' },
  { name: 'Source Code', icon: Code2, tint: 'bg-blue-50 text-navy' },
  { name: 'E-Books', icon: BookOpen, tint: 'bg-teal/10 text-teal' },
  { name: 'Courses', icon: GraduationCap, tint: 'bg-purple-50 text-purple-600' },
  { name: 'Graphics', icon: Palette, tint: 'bg-pink-50 text-pink-600' },
  { name: 'Audio', icon: Music, tint: 'bg-amber-50 text-amber-600' },
  { name: 'Video Assets', icon: Video, tint: 'bg-red-50 text-red-600' },
  { name: 'Other', icon: Package, tint: 'bg-slate-100 text-slate-600' },
];

export const categoryMeta = (name) => CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];

const formatter = new Intl.NumberFormat('en', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 2 });
export const fmt = (n) => (Number(n) === 0 ? 'Free' : formatter.format(Number(n) || 0));
