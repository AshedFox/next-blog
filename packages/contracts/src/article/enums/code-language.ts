export const CodeLanguage = {
  ABAP: 'abap',
  APEX: 'apex',
  'AZURE CLI': 'azcli',
  BATCH: 'bat',
  C: 'c',
  CLOJURE: 'clojure',
  COFFEESCRIPT: 'coffeescript',
  'C++': 'cpp',
  'C#': 'csharp',
  CSS: 'css',
  DART: 'dart',
  DOCKERFILE: 'dockerfile',
  ELIXIR: 'elixir',
  'F#': 'fsharp',
  GO: 'go',
  GRAPHQL: 'graphql',
  HASKELL: 'haskell',
  HTML: 'html',
  JAVA: 'java',
  JAVASCRIPT: 'javascript',
  JSON: 'json',
  JULIA: 'julia',
  KOTLIN: 'kotlin',
  LESS: 'less',
  LUA: 'lua',
  MARKDOWN: 'markdown',
  MYSQL: 'mysql',
  'OBJECTIVE-C': 'objective-c',
  PASCAL: 'pascal',
  PERL: 'perl',
  POSTGRESQL: 'pgsql',
  PHP: 'php',
  'PLAIN TEXT': 'plaintext',
  POWERSHELL: 'powershell',
  PYTHON: 'python',
  R: 'r',
  RUBY: 'ruby',
  RUST: 'rust',
  SASS: 'sass',
  SCALA: 'scala',
  SCHEME: 'scheme',
  SCSS: 'scss',
  SHELL: 'shell',
  SOLIDITY: 'sol',
  SQL: 'sql',
  SWIFT: 'swift',
  TYPESCRIPT: 'typescript',
  'VISUAL BASIC': 'vb',
  XML: 'xml',
  YAML: 'yaml',
} as const;

export type CodeLanguage = (typeof CodeLanguage)[keyof typeof CodeLanguage];

export const CODE_LANGUAGE_VALUES = Object.values(
  CodeLanguage
) as CodeLanguage[];

export const CODE_LANGUAGE_KEYS = Object.keys(CodeLanguage) as Array<
  keyof typeof CodeLanguage
>;

export function isCodeLanguage(value: unknown): value is CodeLanguage {
  return CODE_LANGUAGE_VALUES.includes(value as CodeLanguage);
}
