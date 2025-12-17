import { LanguageFn } from 'lowlight';

export const languageLoaders: Record<
  string,
  () => Promise<{ default: LanguageFn }>
> = {
  bash: () => import('highlight.js/lib/languages/bash'),
  c: () => import('highlight.js/lib/languages/c'),
  clojure: () => import('highlight.js/lib/languages/clojure'),
  cpp: () => import('highlight.js/lib/languages/cpp'),
  csharp: () => import('highlight.js/lib/languages/csharp'),
  css: () => import('highlight.js/lib/languages/css'),
  dart: () => import('highlight.js/lib/languages/dart'),
  diff: () => import('highlight.js/lib/languages/diff'),
  dockerfile: () => import('highlight.js/lib/languages/dockerfile'),
  elixir: () => import('highlight.js/lib/languages/elixir'),
  go: () => import('highlight.js/lib/languages/go'),
  gradle: () => import('highlight.js/lib/languages/gradle'),
  graphql: () => import('highlight.js/lib/languages/graphql'),
  haskell: () => import('highlight.js/lib/languages/haskell'),
  xml: () => import('highlight.js/lib/languages/xml'),
  ini: () => import('highlight.js/lib/languages/ini'),
  java: () => import('highlight.js/lib/languages/java'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  json: () => import('highlight.js/lib/languages/json'),
  kotlin: () => import('highlight.js/lib/languages/kotlin'),
  less: () => import('highlight.js/lib/languages/less'),
  lua: () => import('highlight.js/lib/languages/lua'),
  makefile: () => import('highlight.js/lib/languages/makefile'),
  markdown: () => import('highlight.js/lib/languages/markdown'),
  nginx: () => import('highlight.js/lib/languages/nginx'),
  objectivec: () => import('highlight.js/lib/languages/objectivec'),
  objc: () => import('highlight.js/lib/languages/objectivec'),
  perl: () => import('highlight.js/lib/languages/perl'),
  php: () => import('highlight.js/lib/languages/php'),
  plaintext: () => import('highlight.js/lib/languages/plaintext'),
  powershell: () => import('highlight.js/lib/languages/powershell'),
  python: () => import('highlight.js/lib/languages/python'),
  r: () => import('highlight.js/lib/languages/r'),
  ruby: () => import('highlight.js/lib/languages/ruby'),
  rust: () => import('highlight.js/lib/languages/rust'),
  scala: () => import('highlight.js/lib/languages/scala'),
  scss: () => import('highlight.js/lib/languages/scss'),
  sql: () => import('highlight.js/lib/languages/sql'),
  swift: () => import('highlight.js/lib/languages/swift'),
  typescript: () => import('highlight.js/lib/languages/typescript'),
  vim: () => import('highlight.js/lib/languages/vim'),
  yaml: () => import('highlight.js/lib/languages/yaml'),
} as const;

export const DEFAULT_LANGUAGE = 'plaintext';

export type LanguageDefinition = {
  value: keyof typeof languageLoaders;
  label: string;
  aliases?: string[];
};

export const languageDefinitions: LanguageDefinition[] = [
  { value: 'bash', label: 'Bash', aliases: ['sh', 'zsh'] },
  { value: 'c', label: 'C' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'cpp', label: 'C++', aliases: ['c++', 'cc', 'cxx'] },
  { value: 'csharp', label: 'C#', aliases: ['cs', 'c#'] },
  { value: 'css', label: 'CSS' },
  { value: 'dart', label: 'Dart' },
  { value: 'diff', label: 'Diff' },
  { value: 'dockerfile', label: 'Dockerfile', aliases: ['docker'] },
  { value: 'elixir', label: 'Elixir' },
  { value: 'go', label: 'Go', aliases: ['golang'] },
  { value: 'gradle', label: 'Gradle' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'xml', label: 'XML', aliases: ['html', 'svg'] },
  { value: 'ini', label: 'INI', aliases: ['toml'] },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript', aliases: ['js', 'jsx'] },
  { value: 'json', label: 'JSON' },
  { value: 'kotlin', label: 'Kotlin', aliases: ['kt'] },
  { value: 'less', label: 'Less' },
  { value: 'lua', label: 'Lua' },
  { value: 'makefile', label: 'Makefile', aliases: ['mk'] },
  { value: 'markdown', label: 'Markdown', aliases: ['md'] },
  { value: 'nginx', label: 'Nginx', aliases: ['conf'] },
  { value: 'objectivec', label: 'Objective-C', aliases: ['objc'] },
  { value: 'perl', label: 'Perl', aliases: ['pl'] },
  { value: 'php', label: 'PHP' },
  { value: 'plaintext', label: 'Plain Text', aliases: ['text', 'txt'] },
  { value: 'powershell', label: 'PowerShell', aliases: ['ps', 'ps1'] },
  { value: 'python', label: 'Python', aliases: ['py'] },
  { value: 'r', label: 'R' },
  { value: 'ruby', label: 'Ruby', aliases: ['rb'] },
  { value: 'rust', label: 'Rust', aliases: ['rs'] },
  { value: 'scala', label: 'Scala' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript', aliases: ['ts', 'tsx'] },
  { value: 'vim', label: 'Vim Script', aliases: ['vim'] },
  { value: 'yaml', label: 'YAML', aliases: ['yml'] },
];

export const languageAliases = Object.fromEntries(
  languageDefinitions.flatMap(
    (language) =>
      language.aliases?.map((alias) => [alias, language.value]) || []
  )
);

export const availableLanguages = new Set<string>(Object.keys(languageLoaders));
