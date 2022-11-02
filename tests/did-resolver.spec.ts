// import { test, expect } from "vitest";

import { expect, test } from "vitest";


// afterEach(() => {
//   mockedAxios.get.mockReset();
// });

// test("did resolver can resolve a web did", async () => {
//   const didDoc = require("../__fixtures__/didDocument.json");
//   mockedAxios.get.mockResolvedValue({ data: JSON.stringify(didDoc) });

//   const resolver = new DIDResolver();
//   const did = await resolver.resolve("did:web:example.com");

//   expect(axios.get).toHaveBeenCalled();
//   expect(did.context).toContain("https://www.w3.org/ns/did/v1");
// });

// test("did resolver DIDNotFound when did not resolved", async () => {
//   const resolver = new DIDResolver();
//   mockedAxios.get.mockResolvedValue({ status: 404, statusText: "Not Found" });

//   try {
//     const did = await resolver.resolve("did:web:example.com");
//   } catch (e) {
//     expect(e instanceof DIDNotFoundError).toBeTruthy();
//   }
// });

// test("did resolver throws not supported when did method not found", async () => {
//   const resolver = new DIDResolver();
//   console.error = jest.fn();

//   try {
//     const did = await resolver.resolve("did:fake:example.com");
//   } catch (e) {
//     expect(console.error).toHaveBeenCalled();
//     expect(e instanceof DIDMethodNotSupported).toBeTruthy();
//   }
// });
test('todo add tests', () => {
  expect(true).toBeTruthy()
})
