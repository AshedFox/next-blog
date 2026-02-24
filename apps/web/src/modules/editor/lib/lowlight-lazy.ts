import { createLowlight } from 'lowlight';

import {
  availableLanguages,
  DEFAULT_LANGUAGE,
  languageAliases,
  languageLoaders,
} from './language-config';

const lowlight = createLowlight();

const loadedLanguages = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

export async function loadLanguage(language: string): Promise<void> {
  if (loadedLanguages.has(language)) {
    return;
  }

  if (loadingPromises.has(language)) {
    return loadingPromises.get(language);
  }

  const loader = languageLoaders[language];
  if (!loader) {
    console.warn(`[Lowlight] Language "${language}" not supported`);
    return;
  }

  const loadPromise = (async () => {
    try {
      const langModule = await loader();
      lowlight.register(language, langModule.default);
      loadedLanguages.add(language);
      console.log(`[Lowlight] ✓ Loaded language: ${language}`);
    } catch (error) {
      console.error(`[Lowlight] ✗ Failed to load language: ${language}`, error);
      throw error;
    } finally {
      loadingPromises.delete(language);
    }
  })();

  loadingPromises.set(language, loadPromise);
  return loadPromise;
}

export function normalizeLanugage(language?: string): string {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = language.toLowerCase().trim();

  if (languageAliases[normalized]) {
    return languageAliases[normalized];
  }

  if (availableLanguages.has(normalized)) {
    return normalized;
  }

  return DEFAULT_LANGUAGE;
}

export function isLanguageAvailable(language: string): boolean {
  return availableLanguages.has(language);
}

export function isLanguageLoaded(language: string): boolean {
  return loadedLanguages.has(language);
}

export { lowlight };
