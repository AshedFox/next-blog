import 'highlight.js/styles/github-dark.min.css';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import type { NodeViewProps } from '@tiptap/react';
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { useEffect } from 'react';

import CopyButton from '@/shared/components/CopyButton';
import VirtualCombobox from '@/shared/components/VirtualCombobox';

import { DEFAULT_LANGUAGE, languageDefinitions } from '../lib/language-config';
import {
  loadLanguage,
  lowlight,
  normalizeLanugage,
} from '../lib/lowlight-lazy';

const CustomCodeBlockComponent = ({
  node,
  updateAttributes,
}: NodeViewProps) => {
  const currentLanguage = normalizeLanugage(node.attrs.language);

  useEffect(() => {
    let mounted = true;

    loadLanguage(currentLanguage).then(() => {
      if (mounted) {
        updateAttributes({ language: currentLanguage });
      }
    });

    return () => {
      mounted = false;
    };
  }, [currentLanguage, updateAttributes]);

  const handleLanguageChange = async (newLanguage: string) => {
    const normalizedLanguage = normalizeLanugage(newLanguage);

    if (currentLanguage === normalizedLanguage) {
      return;
    }

    await loadLanguage(newLanguage);
    updateAttributes({ language: newLanguage });
  };

  return (
    <NodeViewWrapper
      className="border p-2 @lg:p-3 rounded-xl space-y-2 @lg:space-y-3 my-2"
      data-language={currentLanguage}
    >
      <div
        className="flex justify-between gap-2 items-center select-none"
        contentEditable={false}
      >
        <VirtualCombobox
          triggerClassName="w-fit max-w-24 @lg:max-w-48"
          contentClassName="w-fit"
          value={node.attrs.language}
          onChange={handleLanguageChange}
          options={languageDefinitions}
        />
        <CopyButton text={node.textContent} />
      </div>
      <pre data-language={currentLanguage}>
        <NodeViewContent<'code'> as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export const CustomCodeBlock = CodeBlockLowlight.extend({
  name: 'codeBlock',
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      defaultLanguage: DEFAULT_LANGUAGE,
      languageClassPrefix: 'language-',
      exitOnTripleEnter: true,
      enableTabIndentation: true,
      exitOnArrowDown: true,
      tabSize: 4,
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (element) => {
          const language = element.getAttribute('data-language');
          return language || this.options.defaultLanguage;
        },
        renderHTML: (attributes) => {
          const language = attributes.language || this.options.defaultLanguage;
          return { 'data-language': language };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomCodeBlockComponent);
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Escape: () => {
        const { state } = this.editor;
        const { $from } = state.selection;

        if ($from.parent.type.name === this.name) {
          const pos = $from.after();
          return this.editor.commands.setTextSelection(pos);
        }
        return false;
      },
      'Mod-Enter': () => {
        const { state } = this.editor;
        const { $from } = state.selection;

        if ($from.parent.type.name === this.name) {
          const pos = $from.after();
          return this.editor
            .chain()
            .setTextSelection(pos)
            .insertContent({ type: 'paragraph' })
            .run();
        }
        return false;
      },
      'Mod-a': () => {
        const { state } = this.editor;
        const { $from, $to } = state.selection;

        if ($from.parent.type.name !== this.name) {
          return false;
        }

        if ($from.parent.type.name !== this.name) {
          return false;
        }

        if (!($from.pos === $from.start() && $to.pos === $from.end())) {
          return this.editor
            .chain()
            .setTextSelection({ from: $from.start(), to: $from.end() })
            .run();
        }

        return false;
      },
    };
  },
});
