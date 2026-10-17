import type { Metadata } from 'next';
import { UIPlayground } from './preview';

export const metadata: Metadata = { title: 'Shared UI preview | GD Tutor' };

export default function UIPreviewPage() {
  return <UIPlayground />;
}
