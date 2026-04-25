"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultCountry?: string;
  international?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ defaultCountry, international, placeholder, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="tel"
        placeholder={placeholder || "Phone number (e.g., +1 234 567 8900)"}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
