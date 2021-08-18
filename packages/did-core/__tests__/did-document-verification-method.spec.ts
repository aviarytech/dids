import { DIDDocumentVerificationMethod } from "../src";

test("did document verification method can initialize from json", async () => {
  const json = require("../__fixtures__/verificationMethod.json");

  const v = new DIDDocumentVerificationMethod(json);

  expect(v.id).toBe("did:web:example.com#key-2");
  expect(v.controller).toBe("did:web:example.com");
  expect(v.type).toBe("JsonWebKey2020");
});
