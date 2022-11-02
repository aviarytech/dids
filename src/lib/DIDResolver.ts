import { documentLoaderFactory, type Iri } from "@transmute/jsonld-document-loader";
import type { DocumentLoader } from "@transmute/jsonld-document-loader";
import axios from "axios";

import { DIDDocument } from "./DIDDocument.js";

export class DIDNotFoundError extends Error {
  constructor(did: string) {
    super(did);
    this.message = `DID ${did} not found`
  }
}

export class DIDMethodNotSupported extends Error {
  constructor(method: string) {
    super(method)
    this.message = `DID method ${method} not supported by resolver`
  }
}

export class DIDResolver {
  private documentLoader: DocumentLoader;

  constructor() {
    this.documentLoader = this.createDocumentLoader();
  }

  private createDocumentLoader() {
    return documentLoaderFactory
      .build({
        ["did:web"]: async (did: string) => {
          const [_, method, id, ...extras] = did.split(":");
          let domain = id.split("#").length > 1 ? id.split("#")[0] : id;
          if (id.indexOf("localhost") >= 0) {
            domain += `:${extras}`;
          }
          const resp = await axios.get(
            `http${
              id.indexOf("localhost") >= 0 ? null : "s"
            }://${domain}/.well-known/did.json`
          );
          return resp.data;
        },
      })
  }

  async resolve(did: Iri): Promise<DIDDocument> {
    if (did.split(":").length < 3) {
      throw new Error(`${did} not a valid DID`)
    }
    try {
      const { document } = await this.documentLoader(did);
      if (!document) throw new DIDNotFoundError(did);
      if (typeof document === 'object') {
        return new DIDDocument(document)
      }
      return new DIDDocument(JSON.parse(document));
    } catch(e: any) {
      const [_, method ] = did.split(":")
      if (e.message.indexOf("Unsupported iri") >= 0) throw new DIDMethodNotSupported(`did:${method}`)
      if (e.message.indexOf("status code 404") >= 0) throw new DIDNotFoundError(did)
      throw e;
    }
  }
}