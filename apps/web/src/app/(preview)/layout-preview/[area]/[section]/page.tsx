import { notFound } from 'next/navigation';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/layout/workspace-shell';
import { Badge, Card, Notice } from '@/components/ui';
import {
  areas,
  firstSection,
  footer,
  labels,
  navigationFor,
  previewHref,
  primary,
  sectionsFor,
  titleFor,
} from '../../navigation';
import type { PreviewArea } from '../../navigation';
import styles from '../../preview.module.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return areas.flatMap((area) =>
    sectionsFor(area).map((section) => ({ area, section })),
  );
}

const samples = [
  {
    title: 'Physics foundations',
    subject: 'Physics',
    detail: 'Motion, energy and a stronger understanding of everyday science.',
    status: 'Course placeholder',
  },
  {
    title:
      'Mathematics: from core concepts to multi-step problem solving for entrance examinations',
    subject: 'Mathematics',
    detail: 'A deliberately long title to review line wrapping and alignment.',
    status: 'Course placeholder',
  },
  {
    title: 'Chemistry essentials',
    subject: 'Chemistry',
    detail: 'Build connections between ideas, reactions and practice.',
    status: 'Course placeholder',
  },
];

export default async function ShellPreviewPage({
  params,
}: {
  params: Promise<{ area: string; section: string }>;
}) {
  const values = await params;
  if (!areas.includes(values.area as PreviewArea)) notFound();
  const area = values.area as PreviewArea;
  const title = titleFor(area, values.section);
  if (!title) notFound();
  const isPublic = area === 'public';
  const isStudent = area === 'student';
  const isStaff = !isPublic && !isStudent;
  const isLanding = values.section === firstSection(area);
  return (
    <WorkspaceShell
      kind={isPublic ? 'public' : isStudent ? 'student' : 'staff'}
      label={labels[area]}
      brandHref={previewHref('public', 'home')}
      primary={primary}
      navigation={navigationFor(area)}
      footer={footer}
    >
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>{labels[area]}</p>
          <h1>
            {isPublic && isLanding
              ? 'Build understanding. Find your next step.'
              : title}
          </h1>
          <p className={styles.muted}>
            {isPublic
              ? 'Explore courses, practice and classes in one place.'
              : isStudent
                ? 'Keep your learning and next steps close at hand.'
                : 'A focused workspace for teaching and course operations.'}
          </p>
        </div>
        <Badge>
          {area === 'admin'
            ? 'Administrator sample'
            : isStaff
              ? 'Instructor sample'
              : 'Layout sample'}
        </Badge>
      </div>
      {!isLanding && (
        <div className={styles.boundary}>
          <Notice title={`${title} placeholder`}>
            This destination demonstrates navigation and page structure.{' '}
            {isStaff
              ? 'No content, learner or commercial operation is enabled.'
              : 'Course, class and account functionality will be added in later subphases.'}
          </Notice>
        </div>
      )}
      <div className={styles.contentGrid}>
        <div className={styles.mainStack}>
          {isStaff ? (
            <Card
              title={
                values.section === 'courses'
                  ? 'Course workspace'
                  : `${title} workspace`
              }
              description="Synthetic rows for layout review."
            >
              <div
                className={styles.tableRegion}
                role="region"
                aria-label="Sample course table, scroll horizontally if needed"
                tabIndex={0}
              >
                <table className={styles.table}>
                  <caption>Sample course records · no live data</caption>
                  <thead>
                    <tr>
                      <th scope="col">Course</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Workspace</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((sample) => (
                      <tr key={sample.subject}>
                        <th scope="row">{sample.title}</th>
                        <td>{sample.subject}</td>
                        <td>
                          <Badge>Draft sample</Badge>
                        </td>
                        <td>
                          <Link href={previewHref(area, 'questions')}>
                            Question bank
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card
              title={isStudent ? 'Your learning space' : 'Explore a subject'}
              description={
                isStudent
                  ? 'Illustrative course cards; no enrollment or progress is implied.'
                  : 'Placeholder cards to review density and content wrapping.'
              }
            >
              <div className={styles.courseGrid}>
                {samples.map((sample) => (
                  <article className={styles.course} key={sample.subject}>
                    <div className={styles.courseArt} aria-hidden="true">
                      <span>{sample.subject.slice(0, 2)}</span>
                      <span>01 / FOUNDATIONS</span>
                    </div>
                    <div className={styles.courseBody}>
                      <p className={styles.subject}>{sample.subject}</p>
                      <h3>{sample.title}</h3>
                      <p className={styles.muted}>{sample.detail}</p>
                      <span className={styles.sampleLabel}>
                        {sample.status}
                      </span>
                      <Link href={previewHref(area, 'courses')}>
                        View course area <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </Card>
          )}
          <Card
            title={
              isStudent
                ? 'Classes and study plans'
                : isStaff
                  ? 'Workspace notes'
                  : 'A clear path, one step at a time'
            }
          >
            <p className={styles.paragraph}>
              Use the navigation to explore linked placeholder sections. The
              content area grows naturally with longer titles, multilingual text
              and detailed study material.
            </p>
            <div className={styles.readingSample}>
              Build a strong foundation in mathematics and science through clear
              explanations and regular practice.
            </div>
            <details className={styles.details}>
              <summary>Long-content layout sample</summary>
              <p className={styles.paragraph}>
                A course may contain detailed explanations, references and long
                resource identifiers. These should wrap without forcing the
                entire page sideways.
              </p>
              <p className={styles.longToken}>
                example_resource_identifier_for_a_detailed_learning_reference_with_a_very_long_unbroken_name_2026_foundation_course_review
              </p>
            </details>
          </Card>
        </div>
        <aside className={styles.contextStack} aria-label="Page context">
          <Card
            title={
              isStudent
                ? 'Your next steps'
                : isStaff
                  ? 'Keep work in context'
                  : 'Find your focus'
            }
          >
            <p className={styles.paragraph}>
              {isStudent
                ? 'Courses, class schedules and learning history belong together in your workspace.'
                : isStaff
                  ? 'Teaching tools stay separate from student learning. Administrative destinations appear only in the administrator fixture.'
                  : 'School learning, entrance exam preparation and regular practice will share this foundation.'}
            </p>
            <Link
              className={styles.actionLink}
              href={previewHref(
                area,
                isPublic ? 'classes' : isStudent ? 'classes' : 'reviews',
              )}
            >
              {isStaff ? 'Review area' : 'Explore classes'}{' '}
              <span aria-hidden="true">→</span>
            </Link>
          </Card>
          <Card title="Need a hand?">
            <p className={styles.paragraph}>
              Help remains reachable from every layout, including narrow
              screens.
            </p>
            <Link href={previewHref('public', 'help')}>Open help area →</Link>
          </Card>
        </aside>
      </div>
    </WorkspaceShell>
  );
}
