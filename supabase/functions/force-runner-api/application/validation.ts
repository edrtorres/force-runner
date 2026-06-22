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

export function positiveNumber(input: Record<string, unknown>, field: string): number {
  const value = requiredNumber(input, field);
  if (value <= 0) throw new ValidationError(`${field} debe ser mayor que cero`);
  return value;
}

export function optionalCoordinate(input: Record<string, unknown>, field: "latitude" | "longitude"): number | null {
  const value = input[field];
  if (value === undefined || value === null) return null;
  if (typeof value !== "number" || Number.isNaN(value)) throw new ValidationError(`${field} debe ser numerico`);
  const min = field === "latitude" ? -90 : -180;
  const max = field === "latitude" ? 90 : 180;
  if (value < min || value > max) throw new ValidationError(`${field} esta fuera de rango`);
  return value;
}

export function enumValue<T extends string>(value: string, allowed: readonly T[], field: string): T {
  if (!allowed.includes(value as T)) throw new ValidationError(`${field} no permitido`);
  return value as T;
}

export function optionalLimit(value: string | null, fallback: number, max: number): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}
