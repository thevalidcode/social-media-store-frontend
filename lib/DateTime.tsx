"use client";

import React, { useMemo } from "react";
import {
  format,
  parseISO,
  isToday,
  isYesterday,
  isTomorrow,
  Locale,
  formatDistance,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { enUS } from "date-fns/locale";

interface DateTimeProps {
  date: string | Date; // ISO string or Date object
  formatStr?: string; // fallback format string
  locale?: Locale; // date-fns locale
  timeZone?: string; // optional timezone, default: local
  relative?: boolean; // show relative time instead of exact
  tooltip?: boolean; // show full timestamp on hover
}

export const DateTime: React.FC<DateTimeProps> = ({
  date,
  formatStr = "PPP p",
  locale = enUS,
  timeZone,
  relative = false,
  tooltip = true,
}) => {
  // Parse the date
  const dateObj: Date = useMemo(() => {
    let d = typeof date === "string" ? parseISO(date) : date;
    if (timeZone) {
      d = toZonedTime(d, timeZone);
    }
    return d;
  }, [date, timeZone]);

  // Compute display string
  const display = useMemo(() => {
    // Relative display
    if (relative) {
      return formatDistance(dateObj, new Date(), { addSuffix: true, locale });
    }

    // Today / Yesterday / Tomorrow shortcut
    if (isToday(dateObj))
      return `Today at ${format(dateObj, "HH:mm", { locale })}`;
    if (isYesterday(dateObj))
      return `Yesterday at ${format(dateObj, "HH:mm", { locale })}`;
    if (isTomorrow(dateObj))
      return `Tomorrow at ${format(dateObj, "HH:mm", { locale })}`;

    // Default formatted
    return format(dateObj, formatStr, { locale });
  }, [dateObj, relative, locale, formatStr]);

  const tooltipText = useMemo(
    () => format(dateObj, "PPP p", { locale }),
    [dateObj, locale]
  );

  return (
    <span
      title={tooltip ? tooltipText : undefined}
      className="whitespace-nowrap"
    >
      {display}
    </span>
  );
};
