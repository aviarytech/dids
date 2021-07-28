import { DIDDocument } from "../src/DIDDocument";

test("did document can initialize from json", async () => {
  const json = require("../__fixtures__/didDocument.json");

  const didDoc = new DIDDocument(json);

  expect(didDoc.id).toBe("did:web:example.com");
  expect(didDoc.context).toContain("https://www.w3.org/ns/did/v1");
  expect(didDoc.context).toContain(
    "https://w3id.org/security/suites/jws-2020/v1"
  );
  expect(didDoc.verificationMethod).toHaveLength(2);
  expect(didDoc.authentication[0].controller).toBe("did:web:example.com");
  expect(didDoc.authentication[0].id).toBe("did:web:example.com#key-0");
  expect(didDoc.service[0].type).toBe("DIDCommMessaging");
  expect(didDoc.service[0].id).toBe("did:web:example.com#didcomm");
});
