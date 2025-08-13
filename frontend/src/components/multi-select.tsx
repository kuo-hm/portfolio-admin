"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  defaultValue?: string[];
}

export function MultiSelect({
  options,
  onChange,
  placeholder = "Select...",
  defaultValue = [],
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (val: string) => {
    setSelectedValues((prev) => {
      let newSelected;
      if (prev.includes(val)) {
        newSelected = prev.filter((v) => v !== val);
      } else {
        newSelected = [...prev, val];
      }
      onChange?.(newSelected);
      return newSelected;
    });
  };

  const removeTag = (val: string) => {
    setSelectedValues((prev) => {
      const newSelected = prev.filter((v) => v !== val);
      onChange?.(newSelected);
      return newSelected;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedValues.length > 0
              ? selectedValues.map((v) => {
                  const option = options.find((o) => o.value === v);
                  return (
                    <Badge
                      key={v}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {option?.label ?? v}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(v);
                        }}
                      />
                    </Badge>
                  );
                })
              : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[200px]"
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="max-h-60">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent popover closing
                    handleSelect(option.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
