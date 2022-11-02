import { DIDDocumentVerificationMethod } from "$lib";
import { expect, test } from "vitest"

test("did document verification method can initialize from json", async () => {
  const json = require("./fixtures/verificationMethod.json");

  const v = new DIDDocumentVerificationMethod(json);

  expect(v.id).toBe("did:web:example.com#key-2");
  expect(v.controller).toBe("did:web:example.com");
  expect(v.type).toBe("JsonWebKey2020");
});
