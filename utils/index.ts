import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export function getFormatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export function dateToISOString(date: Date): string {
  return date.toISOString();
}

export function isoStringToDate(isoString: string): Date {
  return new Date(isoString);
}

export function booleanToNumber(value: boolean): number {
  return value ? 1 : 0;
}

export function numberToBoolean(value: number): boolean {
  return value === 1;
}

export function uuid(): string {
  return uuidv4();
}
