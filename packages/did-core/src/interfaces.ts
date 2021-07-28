import { JWK } from "@aviarytech/crypto-core";

/**
 * A verification method definition entry in a DID Document.
 */
interface IDIDDocumentVerificationMethod {
  /** Fully qualified identifier of this public key, e.g. did:example:123#key-1 */
  id: string;

  /** The type of this public key, as defined in: https://w3c-ccg.github.io/ld-cryptosuite-registry/ */
  type: string;

  /** The DID of the controller of this key. */
  controller: string;

  /** The value of the public key in PEM format. Only one value field will be present. */
  publicKeyPem?: string;

  /** The value of the public key in JWK format. Only one value field will be present. */
  publicKeyJwk?: any;

  /** The value of the public key in hex format. Only one value field will be present. */
  publicKeyHex?: string;

  /** The value of the public key in Base64 format. Only one value field will be present. */
  publicKeyBase64?: string;

  /** The value of the public key in Base58 format. Only one value field will be present. */
  publicKeyBase58?: string;

  /** The value of the public key in Multibase format. Only one value field will be present. */
  publicKeyMultibase?: string;

  /** Returns the public key in JWK format regardless of the current type */
  asJwk(): JWK;
}

/**
 * Defines a service descriptor entry present in a DID Document.
 */
interface IDIDDocumentServiceDescriptor {
  /** id of this service, e.g. `did:example:123#id`. */
  id: string;

  /** The type of this service. */
  type: string;

  /** The endpoint of this service, as a URI. */
  serviceEndpoint: string;

  /** didcomm service extension */
  routingKeys: string[];
}

/**
 * Decentralized Identity Document.
 */
interface IDIDDocument {
  /** The JSON-LD context of the DID Documents. */
  context: string[];

  /** The DID to which this DID Document pertains. */
  id: string;

  /** The controller of the DID */
  controller?: string;

  /** This DID is also known as */
  alsoKnownAs?: string;

  /** Array of verification methods associated with the DID. */
  verificationMethod?: IDIDDocumentVerificationMethod[];

  /** Array of services associated with the DID. */
  service?: IDIDDocumentServiceDescriptor[];

  /** Array of authentication methods. */
  authentication?: IDIDDocumentVerificationMethod[];

  /** Array of assertion methods. */
  assertionMethod?: IDIDDocumentVerificationMethod[];

  /** Array of key agreement methods */
  keyAgreement?: IDIDDocumentVerificationMethod[];

  /** Array of capability invocation methods */
  capabilityInvocation?: IDIDDocumentVerificationMethod[];

  /** Array of capability delegation methods */
  capabilityDelegation?: IDIDDocumentVerificationMethod[];
}

interface IDIDResolver {
  resolve(id: string): Promise<IDIDDocument>;
}

export {
  IDIDResolver,
  IDIDDocument,
  IDIDDocumentServiceDescriptor,
  IDIDDocumentVerificationMethod,
};
