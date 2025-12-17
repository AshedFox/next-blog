'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@workspace/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@workspace/ui/lib/utils';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Option = { value: string; label: string };

type Props = {
  triggerClassName?: string;
  contentClassName?: string;
  value?: string;
  placeholder?: string;
  notFoundText?: string;
  onChange: (value: string) => void;
  options: readonly Option[] | Option[];
  overscan?: number;
};

const VirtualCombobox = ({
  value,
  onChange,
  options,
  triggerClassName,
  contentClassName,
  placeholder = 'Select option...',
  notFoundText = 'Nothing found...',
  overscan = 10,
}: Props) => {
  const [open, setOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search) {
      return options;
    }
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan,
  });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        virtualizer.measure();
      });
    }
  }, [open, virtualizer]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-72 justify-between', triggerClassName)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0 w-72', contentClassName)}>
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={placeholder}
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{notFoundText}</CommandEmpty>
            ) : (
              <div
                ref={parentRef}
                className="relative max-h-64 overflow-auto p-1"
              >
                <div
                  className="relative w-full"
                  style={{
                    height: virtualizer.getTotalSize(),
                  }}
                >
                  {virtualizer.getVirtualItems().map((v) => {
                    const option = filteredOptions[v.index];

                    if (!option) {
                      return null;
                    }

                    return (
                      <CommandItem
                        className="absolute top-0 left-0 w-full h-8 line-clamp-1 truncate flex items-center justify-between"
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        style={{ transform: `translateY(${v.start}px)` }}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            value === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VirtualCombobox;
