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

interface ComboboxProps {
  items: string[];
  placeholder: string;
  emptyMessage: string;
  onChange: (value: string, isNewItem: boolean) => void;
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  ableToAdd?: boolean;
}

export function Combobox({
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
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const isNewItem = !items.includes(currentValue);
      onChange(currentValue, isNewItem);
      setOpen(false);
      if (onValueChange) {
        onValueChange(""); // Clear the input after selection
      }
      setSelectedIndex(-1);
    },
    [onChange, onValueChange, items]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndex !== -1 && filteredItems[selectedIndex]) {
          // An item is selected from the list
          handleSelect(filteredItems[selectedIndex]);
        } else if (ableToAdd && value.trim() && !items.includes(value.trim())) {
          // No item is selected, and the input is not empty and not in the list
          handleSelect(value.trim());
        }
      } else if (event.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredItems.length - 1)
        );
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      }
    },
    [ableToAdd, value, items, handleSelect, filteredItems, selectedIndex]
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
              value={value}
              onValueChange={(newValue) => {
                if (onValueChange) onValueChange(newValue);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item, index) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={handleSelect}
                    className={cn(
                      selectedIndex === index &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
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
