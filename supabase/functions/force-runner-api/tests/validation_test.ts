import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { optionalLimit, requiredNumber, requiredString } from "../application/validation.ts";
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
