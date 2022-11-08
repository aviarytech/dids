import { beforeEach, describe, expect, test } from "vitest";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { DIDMethodNotSupported, DIDNotFoundError, DIDResolver } from "$lib";

var mock = new MockAdapter(axios);

describe('did-resolver', () => {
  beforeEach(() => {
    mock.reset();
  })
  
  test("did resolver DIDNotFound when did not resolved", async () => {
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

describe('did:web', () => {
  beforeEach(() => {
    mock.reset();
  })

  test("did resolver can resolve a web did", async () => {
    const didDoc = require("./fixtures/dids/web.json");
    mock.onGet().reply(200, JSON.stringify(didDoc), { headers: { 'Content-Type': 'application/json'}})
  
    const resolver = new DIDResolver();
    const did = await resolver.resolve("did:web:example.com");
    
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe("https://example.com/.well-known/did.json");
    expect(did.context).toContain("https://www.w3.org/ns/did/v1");
  });

  test("did resolver can resolve a web did w/ a path", async () => {
    const didDoc = require("./fixtures/dids/web.json");
    mock.onGet().reply(200, JSON.stringify(didDoc), { headers: { 'Content-Type': 'application/json'}})
  
    const resolver = new DIDResolver();
    const did = await resolver.resolve("did:web:example.com:user:123");
  
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe("https://example.com/user/123/did.json");
    expect(did.context).toContain("https://www.w3.org/ns/did/v1");
  });

  test("did resolver can resolve a web did w/ a port", async () => {
    const didDoc = require("./fixtures/dids/web.json");
    mock.onGet().reply(200, JSON.stringify(didDoc), { headers: { 'Content-Type': 'application/json'}})
  
    const resolver = new DIDResolver();
    const did = await resolver.resolve("did:web:example.com%3A3000:user:123");
  
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe("https://example.com:3000/user/123/did.json");
    expect(did.context).toContain("https://www.w3.org/ns/did/v1");
  });
})

describe('did:peer', () => {
  beforeEach(() => {
    mock.reset();
  })
  
  test("did resolver can resolve a peer did (alg 0)", async () => {
    const did = "did:peer:0z6MkqRYqQiSgvZQdnBytw86Qbs2ZWUkGv22od935YF4s8M7V";
    const didDoc = require("./fixtures/dids/peer0.json");
  
    const resolver = new DIDResolver();
    const resolvedDoc = await resolver.resolve(did);
    
    expect(resolvedDoc.context).toContain("https://www.w3.org/ns/did/v1");
    expect(resolvedDoc.verificationMethod[0].id).toBe(didDoc.verificationMethod[0].id)
    expect(resolvedDoc.authentication[0].id).toBe(didDoc.authentication[0])
  });

  test("did resolver can resolve a peer did (alg 2)", async () => {
    const did = "did:peer:2.Ez6LSpSrLxbAhg2SHwKk7kwpsH7DM7QjFS5iK6qP87eViohud.Vz6MkqRYqQiSgvZQdnBytw86Qbs2ZWUkGv22od935YF4s8M7V.SeyJ0IjoiZG0iLCJzIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9lbmRwb2ludDEiLCJyIjpbImRpZDpleGFtcGxlOnNvbWVtZWRpYXRvciNzb21la2V5MSJdLCJhIjpbImRpZGNvbW0vdjIiLCJkaWRjb21tL2FpcDI7ZW52PXJmYzU4NyJdfQ"
    const didDoc = require("./fixtures/dids/peer2.json");
  
    const resolver = new DIDResolver();
    const resolvedDoc = await resolver.resolve(did);
  
    expect(resolvedDoc.context).toContain("https://www.w3.org/ns/did/v1");
    expect(resolvedDoc.verificationMethod.length).toBe(didDoc.verificationMethod.length)
    expect(resolvedDoc.keyAgreement[0].id).toBe(didDoc.keyAgreement[0])
    expect(resolvedDoc.authentication[0].id).toBe(didDoc.authentication[0])
  });
})