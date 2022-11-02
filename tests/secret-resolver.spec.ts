import { JSONSecretResolver } from "$lib";
import { SecretTypeNotFound } from "../src/lib/Secret";
import { expect, test } from "vitest"

test("secret resolver can resolve a JsonWebKey2020 JSON file", async () => {
  const secretFile = require("./fixtures/JsonWebKey2020.example.json");

  const resolver = new JSONSecretResolver(secretFile);
  const secret = await resolver.resolve(secretFile["id"]);
  const jwk = await secret.asJsonWebKey();

  expect(secret.id).toBe("did:web:example.com#key-0");
  expect(secret.type).toBe("JsonWebKey2020");
  expect(jwk.privateKeyJwk.crv).toBe("Ed25519");
  expect(jwk.privateKeyJwk.d).toBe(
    "u7OKM36_b8k4Yk6QI0c_lOznRsKwnOzlhTfqCkr6VmY"
  );
  expect(jwk.privateKeyJwk.kty).toBe("OKP");
  expect(jwk.privateKeyJwk.x).toBe(
    "s_7sGeMPuhusy_X4slKydGXWAhvVfqBDW2DwZHloWr0"
  );
});

test("secret resolver can resolve a X25519KeyAgreementKey2019 JSON file", async () => {
  const secretFile = require("./fixtures/X25519KeyAgreementKey2019.example.json");
  const resolver = new JSONSecretResolver(secretFile);

  const secret = await resolver.resolve(secretFile["id"]);
  const jwk = await secret.asJsonWebKey();

  expect(secret.id).toBe("did:web:example.com#key-1");
  expect(secret.type).toBe("X25519KeyAgreementKey2019");
  expect(secret.privateKeyBase58).toBe(
    "66pGmEHd7fBfQa9ap27vWSouHAmipbmmw6GduBwNRY6y"
  );
  expect(jwk.privateKeyJwk.crv).toBe("X25519");
  expect(jwk.privateKeyJwk.kty).toBe("OKP");
  expect(jwk.privateKeyJwk.d).toBe(
    "S8fJ_kWYHtou5yMYqEUQgeJgBz5el-BdH_msKrkwXQY"
  );
});

test("secret throws error when doesn't support a key type", async () => {
  try {
    const resolver = new JSONSecretResolver({
      id: "did:web:example.com#key-1",
      type: "BAR",
    });
  } catch (e) {
    expect(e instanceof SecretTypeNotFound).toBeTruthy();
  }
});
