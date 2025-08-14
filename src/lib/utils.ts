import { clsx, type ClassValue } from 'clsx';
import { DateLib, Locale } from 'react-day-picker';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateLib(locale: Locale) {
  return new DateLib({ locale });
}
