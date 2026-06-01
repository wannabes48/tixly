'use client';
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

function TeamFlag({ src, name }: { src?: string; name: string }) {
  if (!src) return null;
  if (src.startsWith('http')) {
    return <Image src={src} alt={name} width={20} height={14} className="inline-block rounded-sm object-cover" />;
  }
  return <span>{src}</span>;
}
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface TeamOption {
  label: string;
  value: string;
  emoji?: string;
}

interface TeamMultiSelectProps {
  options: TeamOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TeamMultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Select teams...",
}: TeamMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px] px-3 py-2 text-left font-normal border-gray-300 focus:ring-brand-orange"
        >
          <div className="flex flex-wrap gap-1 items-center overflow-hidden">
            {selectedValues.length === 0 && (
              <span className="text-gray-500">{placeholder}</span>
            )}
            {selectedValues.length > 0 && selectedValues.length <= 2 &&
              selectedValues.map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <Badge variant="secondary" key={val} className="mr-1 mb-1 rounded-sm px-1.5 font-medium bg-brand-paleblue text-brand-navy flex items-center gap-1.5">
                    <TeamFlag src={opt?.emoji} name={opt?.label || val} />
                    {opt?.label}
                  </Badge>
                );
              })}
            {selectedValues.length > 2 && (
              <Badge variant="secondary" className="rounded-sm px-2 font-medium bg-brand-paleblue text-brand-navy">
                {selectedValues.length} selected
              </Badge>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => toggleOption(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100 text-brand-orange" : "opacity-0"
                    )}
                  />
                  {option.emoji && <span className="mr-2 inline-flex"><TeamFlag src={option.emoji} name={option.label} /></span>}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
