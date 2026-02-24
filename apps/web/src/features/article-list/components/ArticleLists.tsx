import { SYSTEM_LIST_TYPE_KEYS } from '@workspace/contracts';
import React from 'react';

import { getListsInclusionState } from '@/features/list/server';
import { getMe } from '@/features/user/server';

import { ArticleCustomListsDropdown } from './ArticleCustomListsDropdown';
import { ArticleSystemListButton } from './ArticleSystemListButton';

type Props = {
  articleId: string;
};

export const ArticleLists = async ({ articleId }: Props) => {
  const currentUser = await getMe();
  if (!currentUser) {
    return null;
  }

  const { error, data } = await getListsInclusionState(
    currentUser.id,
    articleId
  );

  return (
    <div className="flex items-center gap-1">
      {error ? (
        <span className="text-sm text-muted-foreground">
          Failed to load article lists
        </span>
      ) : (
        <>
          {SYSTEM_LIST_TYPE_KEYS.map((type) => (
            <ArticleSystemListButton
              key={type}
              type={type}
              articleId={articleId}
              isChecked={
                type === 'FAVORITE' ? data.isFavorite : data.isReadLater
              }
            />
          ))}
          <ArticleCustomListsDropdown
            articleId={articleId}
            includedInCustomLists={data.includedInCustomLists}
          />
        </>
      )}
    </div>
  );
};
