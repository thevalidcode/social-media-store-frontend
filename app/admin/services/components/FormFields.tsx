"use client";

import { ChangeEvent } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: "text" | "number" | "password" | "email";
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const InputField = ({
  label,
  value,
  onChange,
  required,
  placeholder = "",
  type = "text",
  disabled = false,
}: InputFieldProps) => (
  <div className="flex flex-col lg:gap-2 gap-1">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.value)
      }
      disabled={disabled}
    />
  </div>
);

interface TextareaFieldProps {
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const TextareaField = ({
  label,
  value,
  onChange,
  required,
  placeholder = "",
}: TextareaFieldProps) => (
  <div className="flex flex-col lg:gap-2 gap-1">
    <Label>{label}</Label>
    <Textarea
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value)
      }
    />
  </div>
);

interface FileInputFieldProps {
  label: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInputField = ({
  label,
  onChange,
  required,
}: FileInputFieldProps) => (
  <div className="flex flex-col lg:gap-2 gap-1">
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={onChange}
        required={required}
      />
      <ImageIcon className="w-5 h-5 text-muted-foreground" />
    </div>
  </div>
);

export interface SelectOption {
  value: string;
  label: string;
  image?: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  showImage?: boolean;
  required?: boolean;
}

export const SelectField = ({
  label,
  options,
  value,
  onChange,
  showImage = false,
  required = false,
}: SelectFieldProps) => (
  <div className="flex flex-col lg:gap-2 gap-1">
    <Label>{label}</Label>
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt, key) => (
          <SelectItem key={key} value={opt.value}>
            {showImage && opt.image && (
              <Image
                src={opt.image}
                alt={opt.label}
                width={20}
                height={20}
                className="inline rounded-sm object-cover"
              />
            )}
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {/* Hidden input for HTML required */}
    <Input
      type="text"
      value={value}
      required={required}
      style={{ display: "none" }}
      readOnly
    />
  </div>
);
