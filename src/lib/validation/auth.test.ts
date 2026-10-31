import { describe, expect, it } from "vitest";

import { registerSchema } from "./auth";

const base = {
  name: "Asha Rao",
  email: "asha@example.com",
};

describe("registerSchema password", () => {
  it("requires a special character", () => {
    const result = registerSchema.safeParse({
      ...base,
      password: "LongPassword1",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a long mixed password with a symbol", () => {
    const result = registerSchema.safeParse({
      ...base,
      password: "LongPassword1!",
    });
    expect(result.success).toBe(true);
  });
});