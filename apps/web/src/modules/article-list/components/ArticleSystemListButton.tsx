'use client';

import { SystemListType } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Bookmark, HeartIcon, LucideIcon } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { setSystemListItemAction } from '../../list/client';

export const systemListButtonVariants = cva('rounded-full', {
  variants: {
    listType: {
      favorite:
        'hover:text-red-500 hover:bg-red-200 hover:border-red-200 focus-visible:ring-red-500 data-[state=on]:text-red-500 data-[state=on]:bg-red-200 data-[state=on]:border-red-200 data-[state=on]:hover:text-red-400 data-[state=on]:hover:bg-red-200/80 dark:hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 dark:focus-visible:ring-red-600 dark:data-[state=on]:text-red-600 dark:data-[state=on]:bg-red-900/20 dark:data-[state=on]:border-red-900/50 dark:data-[state=on]:hover:text-red-700 dark:data-[state=on]:hover:bg-red-900/15',

      'read-later':
        'hover:text-amber-500 hover:bg-amber-200 hover:border-amber-200 focus-visible:ring-amber-500 data-[state=on]:text-amber-500 data-[state=on]:bg-amber-200 data-[state=on]:border-amber-200 data-[state=on]:hover:text-amber-400 data-[state=on]:hover:bg-amber-200/80 dark:hover:text-amber-500 dark:hover:bg-amber-900/20 dark:hover:border-amber-900/50 dark:focus-visible:ring-amber-500 dark:data-[state=on]:text-amber-500 dark:data-[state=on]:bg-amber-900/20 dark:data-[state=on]:border-amber-900/50 dark:data-[state=on]:hover:text-amber-600 dark:data-[state=on]:hover:bg-amber-900/15',
    },
  },
});

export const SystemListsDefinitions: Record<
  SystemListType,
  {
    Icon: LucideIcon;
    name: string;
    listType: VariantProps<typeof systemListButtonVariants>['listType'];
  }
> = {
  FAVORITE: { Icon: HeartIcon, name: 'Favorites', listType: 'favorite' },
  READ_LATER: { Icon: Bookmark, name: 'Read Later', listType: 'read-later' },
};

type Props = {
  type: SystemListType;
  articleId: string;
  isChecked?: boolean;
};

export const ArticleSystemListButton = ({
  type,
  articleId,
  isChecked,
}: Props) => {
  const { Icon, name, listType } = SystemListsDefinitions[type];

  const [optimisticChecked, addOptimisticChecked] = useOptimistic(
    isChecked,
    (_, nextValue: boolean) => nextValue
  );
  const [, startTransition] = useTransition();

  async function handleToggle() {
    const newState = !optimisticChecked;

    startTransition(async () => {
      addOptimisticChecked(newState);
      try {
        const { error } = await setSystemListItemAction(
          articleId,
          type,
          newState
        );
        if (error) {
          throw new Error(error.message);
        }
      } catch {
        toast.error(`Failed to update "${name}" list`);
      }
    });
  }

  return (
    <Button
      className={cn(systemListButtonVariants({ listType }))}
      variant="outline"
      size="icon-lg"
      title={name}
      onClick={handleToggle}
      data-state={optimisticChecked ? 'on' : 'off'}
      aria-pressed={optimisticChecked}
    >
      <Icon className={cn(optimisticChecked && 'fill-current')} />
    </Button>
  );
};
