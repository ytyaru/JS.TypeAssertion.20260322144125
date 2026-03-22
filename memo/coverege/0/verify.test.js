import { test, expect } from "bun:test";
import { C as PrivateC } from "./private.js";
import { C as PublicC } from "./public.js";

test("Private class coverage check", () => {
  const c = new PrivateC();
  expect(c).toBeDefined();
});

test("Public class coverage check", () => {
  const c = new PublicC();
  expect(c).toBeDefined();
});

