import { codeToHtml } from 'shiki';

import CopyButton from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const shikiLangMap: Record<string, string> = {
  objectivec: 'objective-c',
};

export async function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: shikiLangMap[language] ?? language,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    cssVariablePrefix: '--shiki-',
    defaultColor: 'light-dark()',
  });

  return (
    <div className="relative rounded-lg overflow-hidden flex flex-col p-4 pt-2 gap-1 border">
      <div className="flex justify-between items-center">
        <span className="text-xs ">{language ?? 'text'}</span>
        <CopyButton text={code} />
      </div>
      <div
        className="*:overflow-x-auto *:p-4 overflow-hidden rounded-lg"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
