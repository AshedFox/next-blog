import {
  mergeAttributes,
  Node,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { Input } from '@workspace/ui/components/input';
import { ChangeEvent, useCallback } from 'react';

const CustomQuoteComponent = ({
  node,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) => {
  const handleAuthorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateAttributes({ author: e.target.value });
    },
    [updateAttributes]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        const pos = getPos();

        if (typeof pos === 'number') {
          const endPos = pos + node.nodeSize;

          editor
            .chain()
            .focus()
            .insertContentAt(endPos, { type: 'paragraph', content: [] })
            .setTextSelection(endPos + 1)
            .run();
        }
      }
    },
    [editor, getPos, node.nodeSize]
  );

  return (
    <NodeViewWrapper className="relative group" as="figure" data-type="quote">
      <blockquote>
        <NodeViewContent />
      </blockquote>
      <figcaption className="flex items-center gap-1">
        <span>—</span>
        <Input
          type="text"
          placeholder="Author..."
          value={node.attrs.author}
          onChange={handleAuthorChange}
          onKeyDown={handleKeyDown}
        />
      </figcaption>
    </NodeViewWrapper>
  );
};

export const CustomQuote = Node.create({
  name: 'quote',
  group: 'block',
  content: 'inline*',
  marks: '_',
  defining: true,
  isolating: true,
  addAttributes() {
    return {
      author: {
        default: '',
        parseHTML: (element) => {
          const authorContent = element.querySelector(
            '[data-author-content]'
          )?.textContent;
          const dataAuthor = element.getAttribute('data-author');
          const figcaption = element
            .querySelector('figcaption')
            ?.textContent?.replace(/^—\s*/, '');

          return authorContent || dataAuthor || figcaption || '';
        },
        renderHTML: (attributes) => {
          return {
            'data-author': attributes.author,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      { tag: 'figure[data-type="quote"]' },
      {
        tag: 'blockquote',
        getAttrs: (node) => {
          if (node instanceof HTMLElement) {
            if (node.closest('figure[data-type="quote"]')) {
              return false;
            }
          }
          return {};
        },
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'quote',
        'data-author': node.attrs.author,
      }),
      ['blockquote', 0],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomQuoteComponent);
  },
});
