import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { enumValue, maxLength, optionalCoordinate, optionalLimit, positiveNumber, requiredNumber, requiredString, validateUuid } from "../application/validation.ts";
import { ValidationError } from "../domain/errors.ts";

Deno.test("requiredString returns trimmed values", () => {
  assertEquals(requiredString({ name: " Edwin " }, "name"), "Edwin");
});

Deno.test("requiredString rejects empty values", () => {
  assertThrows(() => requiredString({ name: " " }, "name"), ValidationError);
});

Deno.test("requiredNumber accepts valid numbers", () => {
  assertEquals(requiredNumber({ distance_meters: 1000 }, "distance_meters"), 1000);
});

Deno.test("optionalLimit applies fallback and max", () => {
  assertEquals(optionalLimit(null, 20, 100), 20);
  assertEquals(optionalLimit("250", 20, 100), 100);
  assertEquals(optionalLimit("-5", 20, 100), 20);
});

Deno.test("positiveNumber rejects zero and negative numbers", () => {
  assertThrows(() => positiveNumber({ distance_meters: 0 }, "distance_meters"), ValidationError);
  assertThrows(() => positiveNumber({ distance_meters: -1 }, "distance_meters"), ValidationError);
});

Deno.test("optionalCoordinate validates latitude and longitude ranges", () => {
  assertEquals(optionalCoordinate({ latitude: 14.08 }, "latitude"), 14.08);
  assertEquals(optionalCoordinate({ longitude: -87.2 }, "longitude"), -87.2);
  assertThrows(() => optionalCoordinate({ latitude: 91 }, "latitude"), ValidationError);
  assertThrows(() => optionalCoordinate({ longitude: -181 }, "longitude"), ValidationError);
});

Deno.test("enumValue rejects values outside the allowed list", () => {
  assertEquals(enumValue("fire", ["fire", "heart"] as const, "reaction_type"), "fire");
  assertThrows(() => enumValue("angry", ["fire", "heart"] as const, "reaction_type"), ValidationError);
});

Deno.test("validateUuid rejects invalid identifiers", () => {
  assertEquals(validateUuid("bbbbbbbb-0001-4000-8000-000000000001", "run_id"), "bbbbbbbb-0001-4000-8000-000000000001");
  assertThrows(() => validateUuid("run-1", "run_id"), ValidationError);
});

Deno.test("maxLength rejects oversized text", () => {
  assertEquals(maxLength("hola", "body", 10), "hola");
  assertThrows(() => maxLength("123456", "body", 5), ValidationError);
});
