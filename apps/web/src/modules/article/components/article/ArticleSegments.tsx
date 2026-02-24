import { ArticleSegment, ArticleSegmentType } from '@workspace/contracts';
import React, { ReactNode } from 'react';

type Props = {
  segments: ArticleSegment[];
};

const ArticleSegments = ({ segments }: Props) => {
  return segments.map((segment, index) => {
    if (segment.type === ArticleSegmentType.BREAK) {
      return <br key={index} />;
    }

    let content: ReactNode = segment.text;

    if (!segment.marks) {
      return <span key={index}>{content}</span>;
    }

    if (segment.marks.bold) {
      content = <strong>{content}</strong>;
    }

    if (segment.marks.italic) {
      content = <em>{content}</em>;
    }

    if (segment.marks.underline) {
      content = <u>{content}</u>;
    }

    if (segment.marks.strike) {
      content = <s>{content}</s>;
    }

    if (segment.marks.code) {
      content = <code>{content}</code>;
    }

    return <span key={index}>{content}</span>;
  });
};

export default ArticleSegments;
