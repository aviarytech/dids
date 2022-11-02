import { beforeEach, describe, expect, test } from "vitest";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { DIDMethodNotSupported, DIDNotFoundError, DIDResolver } from "$lib";

var mock = new MockAdapter(axios);

describe('did-resolver', () => {
  beforeEach(() => {
    mock.reset();
  })

  test("did resolver can resolve a web did", async () => {
    const didDoc = require("./fixtures/didDocument.json");
    mock.onGet().reply(200, JSON.stringify(didDoc), { headers: { 'Content-Type': 'application/json'}})
  
    const resolver = new DIDResolver();
    const did = await resolver.resolve("did:web:example.com");
  
    expect(did.context).toContain("https://www.w3.org/ns/did/v1");
  });
  
  test.only("did resolver DIDNotFound when did not resolved", async () => {
    const resolver = new DIDResolver();
    mock.onGet().reply(404, 'Not Found')
  
    try {
      const did = await resolver.resolve("did:web:example.com");
      expect(true).toBeFalsy()
    } catch (e) {
      expect(e instanceof DIDNotFoundError).toBeTruthy();
    }
  });
  
  test("did resolver throws not supported when did method not found", async () => {
    const resolver = new DIDResolver();
  
    try {
      const did = await resolver.resolve("did:fake:example.com");
      expect(true).toBeFalsy()
    } catch (e) {
      expect(e instanceof DIDMethodNotSupported).toBeTruthy();
    }
  });
})
