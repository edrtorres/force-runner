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

export function validateUuid(value: string, field: string): string {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(value)) throw new ValidationError(`${field} debe ser un UUID valido`);
  return value;
}

export function maxLength(value: string, field: string, max: number): string {
  if (value.length > max) throw new ValidationError(`${field} no debe superar ${max} caracteres`);
  return value;
}

export function validateRunPoints(input: Record<string, unknown>): Record<string, unknown>[] {
  const points = input.points;
  if (points === undefined || points === null) return [];
  if (!Array.isArray(points)) throw new ValidationError("points debe ser una lista");
  if (points.length > 1000) throw new ValidationError("points no debe superar 1000 elementos");

  return points.map((point, index) => {
    if (!point || typeof point !== "object" || Array.isArray(point)) throw new ValidationError("Cada punto GPS debe ser un objeto");
    const row = point as Record<string, unknown>;
    return {
      point_order: typeof row.point_order === "number" ? row.point_order : index,
      latitude: optionalCoordinate(row, "latitude"),
      longitude: optionalCoordinate(row, "longitude"),
      accuracy_meters: typeof row.accuracy_meters === "number" ? row.accuracy_meters : null,
      speed_meters_second: typeof row.speed_meters_second === "number" ? row.speed_meters_second : null,
      recorded_at: typeof row.recorded_at === "string" ? row.recorded_at : undefined
    };
  });
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
