import { Secret } from "$lib";
import { test, expect } from "vitest";

test("secret can be constructed from json", async () => {
  const json = require("./fixtures/JsonWebKey2020.example.json");

  const secret = new Secret(json);

  expect(secret.id).toBe("did:web:example.com#key-0");
  expect(secret.type).toBe("JsonWebKey2020");
  expect(secret.privateKeyJwk.x).toBe(
    "s_7sGeMPuhusy_X4slKydGXWAhvVfqBDW2DwZHloWr0"
  );
  expect(secret.privateKeyJwk.crv).toBe("Ed25519");
  expect(secret.privateKeyJwk.d).toBe(
    "u7OKM36_b8k4Yk6QI0c_lOznRsKwnOzlhTfqCkr6VmY"
  );
  expect(secret.privateKeyJwk.kty).toBe("OKP");
});
