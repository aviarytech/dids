import axios from "axios";
import { JSONSecretResolver } from "../src";

test("secret resolver can resolve a JSON file", async () => {
  const secretFile = require("../__fixtures__/JsonWebKey2020.example.json");

  const resolver = new JSONSecretResolver(secretFile);
  const secret = await resolver.resolve(secretFile["id"]);

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
