'use client';

import MDEditor from '@uiw/react-md-editor';

export function Markdown({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <MDEditor.Markdown
      source={source}
      style={{ background: 'transparent' }}
      className={className}
    />
  );
}

export { MDEditor as MarkdownEditor };
