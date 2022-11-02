export const todo = 1;
// import { documentLoaderFactory } from "@transmute/jsonld-document-loader";
// import { DocumentLoader } from "@transmute/jsonld-document-loader/dist/types";
// import axios from "axios";

// import { DIDDocument } from "./DIDDocument";

// export class DIDNotFoundError extends Error {
//   constructor(did: string) {
//     super(did);
//     this.message = `DID ${did} not found`
//   }
// }

// export class DIDMethodNotSupported extends Error {
//   constructor(method: string) {
//     super(method)
//     this.message = `DID method ${method} not supported by resolver`
//   }
// }

// export class DIDResolver {
//   private documentLoader: DocumentLoader;

//   constructor() {
//     this.createDocumentLoader();
//   }

//   private createDocumentLoader() {
//     this.documentLoader = documentLoaderFactory.pluginFactory
//       .build()
//       .addResolver({
//         ["did:web"]: {
//           resolve: async (did: string) => {
//             const [_, method, id, ...extras] = did.split(":");
//             let domain = id.split("#").length > 1 ? id.split("#")[0] : id;
//             if (id.indexOf("localhost") >= 0) {
//               domain += `:${extras}`;
//             }
//             const resp = await axios.get(
//               `http${
//                 id.indexOf("localhost") >= 0 ? null : "s"
//               }://${domain}/.well-known/did.json`
//             );
//             return resp.data;
//           },
//         },
//       })
//       .buildDocumentLoader();
//   }

//   async resolve(did: string): Promise<DIDDocument> {
//     if (did.split(":").length < 3) {
//       throw new Error(`${did} not a valid DID`)
//     }
//     try {
//       const { document } = await this.documentLoader(did);
//       if (!document) throw new DIDNotFoundError(did);
//       return new DIDDocument(JSON.parse(document));
//     } catch(e) {
//       const [_, method ] = did.split(":")
//       if (e.message.indexOf("documentLoader called on unsupported URI") >= 0) throw new DIDMethodNotSupported(`did:${method}`)
//       throw e;
//     }
//   }
// }