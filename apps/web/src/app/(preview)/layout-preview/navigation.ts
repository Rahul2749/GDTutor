import type { Route } from 'next';
import type {
  NavigationGroup,
  NavigationItem,
} from '@/components/layout/workspace-shell';

export const areas = ['public', 'student', 'staff', 'admin'] as const;
export type PreviewArea = (typeof areas)[number];
export const labels: Record<PreviewArea, string> = {
  public: 'Discover',
  student: 'My learning',
  staff: 'Instructor workspace',
  admin: 'Administrator workspace',
};
const entries: Record<PreviewArea, [string, string][]> = {
  public: [
    ['home', 'Home'],
    ['courses', 'Courses'],
    ['classes', 'Classes & batches'],
    ['about', 'About GD Tutor'],
    ['blog', 'Blog'],
    ['help', 'Help & FAQ'],
    ['contact', 'Contact & counselling'],
    ['privacy', 'Privacy'],
    ['terms', 'Terms & refunds'],
  ],
  student: [
    ['overview', 'Overview'],
    ['courses', 'My courses'],
    ['classes', 'My classes'],
    ['attempts', 'Quiz history'],
    ['notes', 'Private notes'],
    ['wishlist', 'Wishlist'],
    ['certificates', 'Certificates'],
    ['account', 'Account & billing'],
  ],
  staff: [
    ['courses', 'Courses'],
    ['questions', 'Question bank'],
    ['reviews', 'Reviews & approvals'],
    ['attempts', 'Learner attempts'],
    ['classes', 'Classes & batches'],
    ['resources', 'Media & resources'],
    ['discussions', 'Discussions'],
  ],
  admin: [
    ['courses', 'Courses'],
    ['questions', 'Question bank'],
    ['reviews', 'Reviews & approvals'],
    ['attempts', 'Learner attempts'],
    ['classes', 'Classes & batches'],
    ['resources', 'Media & resources'],
    ['discussions', 'Discussions'],
    ['learners', 'Learners & access'],
    ['orders', 'Orders & refunds'],
    ['settings', 'Site & permissions'],
  ],
};
export function previewHref(area: PreviewArea, section: string): Route {
  return `/layout-preview/${area}/${section}` as Route;
}
export function itemsFor(area: PreviewArea): NavigationItem[] {
  return entries[area].map(([section, label]) => ({
    label,
    href: previewHref(area, section),
  }));
}
export function titleFor(area: PreviewArea, section: string) {
  return entries[area].find(([key]) => key === section)?.[1];
}
export function sectionsFor(area: PreviewArea) {
  return entries[area].map(([section]) => section);
}
export function firstSection(area: PreviewArea) {
  return entries[area][0]![0];
}
export function navigationFor(area: PreviewArea): NavigationGroup[] {
  const items = itemsFor(area);
  if (area === 'public')
    return [
      { label: 'Discover', items: items.slice(2, 5) },
      { label: 'Support', items: items.slice(5, 7) },
    ];
  if (area === 'student')
    return [
      { label: 'Learning', items: items.slice(0, 3) },
      { label: 'More tools', items: items.slice(3, 7) },
      { label: 'Account', items: items.slice(7) },
    ];
  return [
    { label: 'Teaching', items: items.slice(0, 5) },
    { label: 'More tools', items: items.slice(5, 7) },
    ...(area === 'admin'
      ? [{ label: 'Administration', items: items.slice(7) }]
      : []),
    {
      label: 'Switch workspace',
      items: [
        { label: 'My learning', href: previewHref('student', 'overview') },
      ],
    },
  ];
}
export const primary: NavigationItem[] = [
  { label: 'Home', href: previewHref('public', 'home') },
  { label: 'Courses', href: previewHref('public', 'courses') },
  { label: 'My learning', href: previewHref('student', 'overview') },
];
export const footer = itemsFor('public').filter((item) =>
  ['Help & FAQ', 'Privacy', 'Terms & refunds'].includes(item.label),
);
