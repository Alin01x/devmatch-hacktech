"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Skills } from "@/types/JobDescription";

interface ComboboxProps {
  options: string[];
  items?: Skills;
  placeholder: string;
  emptyMessage: string;
  onChange: (value: string) => void;
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  ableToAdd?: boolean;
}

export function Combobox({
  options,
  items,
  placeholder,
  emptyMessage,
  onChange,
  value,
  onValueChange,
  className,
  disabled,
  ableToAdd = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number>(0);

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const filteredItems = React.useMemo(() => {
    return options.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
  }, [items, value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      let isNewItem = false;
      if (ableToAdd) {
        isNewItem =
          (items && !Object.keys(items).includes(currentValue)) || false;
      } else {
        isNewItem = true;
      }
      if (isNewItem) {
        onChange(currentValue);
        setOpen(false);
      }
    },
    [onChange, filteredItems]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (ableToAdd && value.trim() && filteredItems.length === 0) {
          onChange(value);
          setOpen(false);
        }
      }
    },
    [ableToAdd, value, filteredItems, handleSelect]
  );

  return (
    <div className={disabled ? "cursor-not-allowed" : ""}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left font-normal",
              "h-10 px-3 py-2",
              "bg-background",
              "border border-input",
              "transition-all",
              open && "ring-2 ring-ring ring-offset-2",
              !value && "text-muted-foreground",
              className,
              disabled && "cursor-not-allowed"
            )}
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: buttonWidth }}
        >
          <Command className="w-full">
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="h-9"
              disabled={disabled}
              onValueChange={(newValue) => {
                if (onValueChange) {
                  onValueChange(newValue);
                }
              }}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem key={item} value={item} onSelect={handleSelect}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
