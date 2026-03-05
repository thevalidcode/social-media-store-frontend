"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon, XIcon } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectWithSearchProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  renderOption?: (option: SelectOption) => React.ReactNode;
  size?: "sm" | "default";
}

export function SelectWithSearch({
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  className,
  disabled,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  renderOption,
  size = "default",
}: SelectWithSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setOpen(false);
    setSearch("");
  };

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setSearch("");
    }
  }, [open]);

  const defaultRenderOption = (option: SelectOption) => (
    <>
      {option.icon && (
        <img
          src={option.icon}
          alt={option.label}
          className="w-6 h-6 rounded object-cover flex-shrink-0"
        />
      )}
      <span className="flex-1 truncate">{option.label}</span>
    </>
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          role="combobox"
          aria-expanded={open ? "true" : "false"}
          aria-controls="select-options-list"
          aria-label={placeholder}
          className={cn(
            "border-input text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent/50",
            selectedOption && "text-foreground",
            size === "default" && "h-9",
            size === "sm" && "h-8",
            className,
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption ? (
              renderOption ? (
                <div className="flex items-center gap-2 w-full">
                  {renderOption(selectedOption)}
                </div>
              ) : (
                defaultRenderOption(selectedOption)
              )
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDownIcon
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 w-[--radix-popover-trigger-width] max-w-[95vw] overflow-hidden rounded-md border shadow-md",
          )}
          align="start"
          sideOffset={4}
          style={{
            maxHeight: "min(400px, 60vh)",
          }}
        >
          <div className="flex flex-col h-full">
            {/* Search Input */}
            <div className="border-b p-2 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="relative flex items-center">
                <SearchIcon className="text-muted-foreground absolute left-2.5 size-4 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="focus:border-ring focus:ring-ring/30 bg-background h-9 w-full rounded-md border pl-9 pr-8 text-sm outline-none transition-all focus:ring-2"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-muted-foreground hover:text-foreground absolute right-2 transition-colors"
                  >
                    <XIcon className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div
              id="select-options-list"
              role="listbox"
              className="overflow-y-auto overscroll-contain p-1"
            >
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  {emptyMessage}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredOptions.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={option.disabled}
                        onClick={() => handleSelect(option.value)}
                        title={option.label}
                        className={cn(
                          "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm outline-none transition-colors hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-50",
                          isSelected && "bg-accent/50 font-medium",
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {renderOption
                            ? renderOption(option)
                            : defaultRenderOption(option)}
                        </div>
                        {isSelected && (
                          <CheckIcon className="text-primary size-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
