import type { FormattedDateProps } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formattedDate = ({
  date,
  withTime,
}: FormattedDateProps): string => {
  if (!date) {
    return "";
  }

  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("id-ID", options).format(d);
};
