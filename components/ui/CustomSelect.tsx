"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type Ref,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

export interface Option<T = any> {
  label: string;
  value: T;
}

export interface CustomSelectProps<T = any> {
  options: Option<T>[];
  placeholder?: string;
  value?: Option<T> | Option<T>[];
  onChange: (value: Option<T> | Option<T>[]) => void;
  isMulti?: boolean;
  isSearchable?: boolean;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export interface CustomSelectRef {
  validate: () => boolean;
}

function CustomSelectInner<T>(
  {
    options,
    placeholder = "Select...",
    value,
    onChange,
    isMulti = false,
    isSearchable = false,
    disabled = false,
    className = "",
    required = false,
  }: CustomSelectProps<T>,
  ref: Ref<CustomSelectRef>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => !disabled && setIsOpen((prev) => !prev);

  const handleSelect = (option: Option<T>) => {
    setError(null);
    if (isMulti) {
      if (Array.isArray(value)) {
        const exists = value.find((v) => v.value === option.value);
        if (exists) {
          onChange(value.filter((v) => v.value !== option.value));
        } else {
          onChange([...value, option]);
        }
      } else {
        onChange([option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const isValid = isMulti
        ? Array.isArray(value) && value.length > 0
        : !!value;
      if (required && !isValid) {
        setError("This field is required");
        return false;
      }
      setError(null);
      return true;
    },
  }));

  return (
    <div
      ref={containerRef}
      className={`relative ${className ? className : "w-full"} text-sm`}
    >
      <button
        type="button"
        className={`w-full rounded-md border border-border bg-background px-3 py-2 text-left transition ${
          disabled
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "hover:border-primary"
        }`}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <div className="flex flex-wrap items-center gap-1">
          {isMulti && Array.isArray(value) && value.length > 0 ? (
            value.map((v) => (
              <span
                key={String(v.value)}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-primary"
              >
                {v.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelect(v);
                  }}
                />
              </span>
            ))
          ) : !isMulti && value ? (
            <span>{(value as Option<T>).label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-card shadow-lg"
          >
            {isSearchable && (
              <div className="border-b border-border p-2">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search..."
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="p-3 text-muted-foreground">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const selected = isMulti
                  ? Array.isArray(value) &&
                    value.some((selectedOption) => selectedOption.value === opt.value)
                  : !!value && (value as Option<T>).value === opt.value;

                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt)}
                    className={`cursor-pointer px-4 py-2 transition ${
                      selected
                        ? "bg-primary/10 font-medium text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CustomSelect = forwardRef(CustomSelectInner) as <T>(
  props: CustomSelectProps<T> & { ref?: Ref<CustomSelectRef> },
) => ReturnType<typeof CustomSelectInner>;

export default CustomSelect;
