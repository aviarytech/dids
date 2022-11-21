import { documentLoaderFactory, type Iri } from "@transmute/jsonld-document-loader";
import type { DocumentLoader } from "@transmute/jsonld-document-loader";
import { resolve as didPeer } from "@aviarytech/did-peer"
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
          let path = extras.join('/')
          const [host, port] = domain.split('%3A');
          const resp = await axios.get(
            `http${
              host.indexOf("localhost") >= 0 ? '' : "s"
            }://${host}${!port ? '' : `:${port}`}/${path === '' ? '.well-known' : path}/did.json`
          );
          return resp.data;
        },
        ["did:peer"]: async (did: string) => {
          try {
            return await didPeer(did)
          } catch (e: any) {
            console.error(`could not resolve did:peer`, e.message)
          }
        }
      })
  }

  async resolve(did: string): Promise<DIDDocument> {
    if (did.split(":").length < 3) {
      throw new Error(`${did} not a valid DID`)
    }
    try {
      const { document } = await this.documentLoader(did as Iri);
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