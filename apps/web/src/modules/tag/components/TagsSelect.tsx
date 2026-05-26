'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Command,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { Field } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@workspace/ui/components/popover';
import { XIcon } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import Spinner from '@/shared/components/Spinner';
import useDebounce from '@/shared/hooks/use-debounce';

import { useTagsSearch } from '../hooks/use-tags-search';

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  placeholder?: string;
};

export const TagsSelect = ({
  value,
  onChange,
  max = 15,
  placeholder = 'Add tag...',
}: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debounced = useDebounce(inputValue, 400);
  const { data, isPending } = useTagsSearch(debounced);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();

      if (!trimmed) {
        return;
      }

      const isDuplicate = value.some(
        (t) => t.toLowerCase() === trimmed.toLowerCase()
      );

      if (isDuplicate || value.length >= max) {
        return;
      }

      onChange([...value, trimmed]);
      setInputValue('');
    },
    [value, onChange, max]
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }

    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const filteredTags =
    data?.data?.filter(
      (s) => !value.some((t) => t.toLowerCase() === s.name.toLowerCase())
    ) ?? [];

  return (
    <Popover
      open={open && (isPending || filteredTags.length > 0)}
      onOpenChange={setOpen}
    >
      <PopoverAnchor asChild>
        <Field>
          <div className="flex gap-2 flex-wrap">
            {value.map((tag, index) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                  variant="ghost"
                  size="icon-sm"
                  className="h-auto w-auto"
                >
                  <XIcon className="size-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);

              if (!open) {
                setOpen(true);
              }
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setTimeout(() => setOpen(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={value.length >= max}
          />
          {value.length >= max && (
            <span className="text-xs text-muted-foreground select-none">
              You&apos;ve reached maximum amount of tags ({max})
            </span>
          )}
        </Field>
      </PopoverAnchor>

      <PopoverContent
        className="p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isPending ? (
          <div className="flex items-center justify-center p-3">
            <Spinner className="size-4 text-muted-foreground" />
          </div>
        ) : (
          <Command shouldFilter={false}>
            <CommandList>
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    addTag(tag.name);
                    inputRef.current?.focus();
                  }}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};
