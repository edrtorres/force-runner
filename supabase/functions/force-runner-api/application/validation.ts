import { ValidationError } from "../domain/errors.ts";

export function requiredString(input: Record<string, unknown>, field: string): string {
  const value = input[field];
  if (typeof value !== "string" || value.trim().length === 0) throw new ValidationError(`${field} es obligatorio`);
  return value.trim();
}

export function requiredNumber(input: Record<string, unknown>, field: string): number {
  const value = input[field];
  if (typeof value !== "number" || Number.isNaN(value)) throw new ValidationError(`${field} es obligatorio`);
  return value;
}

export function optionalLimit(value: string | null, fallback: number, max: number): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}
