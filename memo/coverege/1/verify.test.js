import { test, expect } from "bun:test";
import { C as PrivateC } from "./private.js";
import { C as PublicC } from "./public.js";
import { C as StaticPrivateC } from "./static-private.js";
import { C as DynamicClassC } from "./dynamic-class.js";

test("Private class coverage check", () => {
  const c = new PrivateC();
  expect(c).toBeDefined();
});

test("Public class coverage check", () => {
  const c = new PublicC();
  expect(c).toBeDefined();
});

test("Static Private check", () => {
  StaticPrivateC.run();
});

test("Dynamic Class check", () => {
  const NewClass = DynamicClassC.make();
  new NewClass();
});
