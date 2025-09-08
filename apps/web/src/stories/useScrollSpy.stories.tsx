import React from 'react';

import { useScrollSpy } from '@/hooks';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// --- Mock Data ---
const SECTIONS = Array.from({ length: 10 }, (_, i) => ({
  id: `section-${i + 1}`,
  label: `Section ${i + 1}`,
}));
const sectionIds = SECTIONS.map(section => section.id);

// --- Story Component ---
const ScrollSpyStoryComponent = () => {
  // Storybook의 캔버스 환경에 맞게 offset 조정
  const { activeSection, gnbRef } = useScrollSpy(sectionIds, { offset: 60 });

  return (
    <>
      {/* Storybook 데모를 위한 최소한의 스타일 */}
      <style>{`
        .gnb-container {
          position: sticky; top: 0; left: 0; display: flex; width: 100%;
          gap: 0.5rem; overflow-x: auto; background-color: white;
          padding: 1rem 1.25rem; border-bottom: 1px solid #eee;
          scrollbar-width: none; /* Firefox */
        }
        .gnb-container::-webkit-scrollbar { display: none; /* Safari, Chrome */ }
        .gnb-item a {
          display: block; padding: 0.5rem 1rem; border-radius: 9999px;
          background-color: #f1f3f5; color: #495057; text-decoration: none;
          white-space: nowrap; font-family: sans-serif; font-size: 14px;
          font-weight: 600; transition: all 0.2s;
        }
        .gnb-item a[data-state='active'] { background-color: #68982D; color: white; }
        .content-wrapper { padding-top: 1.25rem; }
        .content-section {
          height: 50vh; padding: 1rem; border-bottom: 2px dashed #eee;
        }
        .content-section h2 {
          font-size: 2rem; font-weight: bold; margin-bottom: 1rem;
          /* Anchor offset for sticky header */
          scroll-margin-top: 60px;
        }
      `}</style>

      {/* GNB (Global Navigation Bar) */}
      <ul ref={gnbRef} className="gnb-container">
        {SECTIONS.map(section => (
          <li
            key={section.id}
            data-section-id={section.id}
            className="gnb-item"
          >
            <a
              href={`#${section.id}`}
              data-state={activeSection === section.id ? 'active' : 'inactive'}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Content Sections */}
      <div className="content-wrapper">
        {SECTIONS.map(section => (
          <div key={section.id} className="content-section">
            <h2 id={section.id}>{section.label}</h2>
            <p>Scroll down to see the next section.</p>
            <p>
              The active navigation item above will automatically update and
              center itself.
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

// --- Storybook Meta Configuration ---
const meta: Meta = {
  component: ScrollSpyStoryComponent,
  parameters: {
    docs: {
      description: {
        component: `
페이지 스크롤에 따라 활성 섹션을 감지하고, 상단 네비게이션(GNB)의 해당 아이템을 자동으로 중앙에 위치시키는 훅입니다.

### 사용 방법

1.  **훅 호출**: 컴포넌트에서 \`useScrollSpy\`를 호출합니다. 추적할 섹션들의 ID 배열을 첫 번째 인자로 전달합니다.
2.  **Ref 연결**: 반환된 \`gnbRef\`를 GNB 역할을 하는 컨테이너 요소(보통 \`<ul>\`)의 \`ref\` 속성에 연결합니다.
3.  **상태 사용**: 반환된 \`activeSection\` 상태를 사용하여 현재 활성화된 메뉴 아이템에 스타일을 적용합니다.
4.  **데이터 속성 추가**: GNB의 각 메뉴 아이템(\`<li>\`)에 \`data-section-id\` 속성을 추가하여 섹션 ID와 연결합니다.

\`\`\`tsx
import { useScrollSpy } from '@recipot/hooks';

const sectionIds = ['intro', 'features', 'pricing'];

function MyPage() {
  const { activeSection, gnbRef } = useScrollSpy(sectionIds, { offset: 80 });

  return (
    <>
      <ul ref={gnbRef}>
        <li data-section-id="intro">
          <a href="#intro" data-state={activeSection === 'intro' ? 'active' : 'inactive'}>
            소개
          </a>
        </li>
        {/* ... other items */}
      </ul>

      <section id="intro">...</section>
      <section id="features">...</section>
      <section id="pricing">...</section>
    </>
  );
}
\`\`\`
        `,
      },
    },
    layout: 'fullscreen',
  },
  title: 'hooks/useScrollSpy',
};

export default meta;

export const Default: StoryObj = {
  name: '기본 사용법 (Default)',
  render: () => <ScrollSpyStoryComponent />,
};
