/**
 * Interface defining a verification method definition entry in a DID Document.
 */
 export interface IDIDDocumentVerificationMethod {
  /** Fully qualified identifier of this public key, e.g. did:example:entity.id#keys-1 */
  id: string;
  /** The type of this public key, as defined in: https://w3c-ccg.github.io/ld-cryptosuite-registry/ */
  type: string;
  /** The DID of the controller of this key. */
  controller: string;
  /** The value of the public key in PEM format. Only one value field will be present. */
  publicKeyPem?: string;
  /** The value of the public key in JWK format. Only one value field will be present. */
  publicKeyJwk?: { kty: string; crv: string; x: string };
  /** The value of the public key in hex format. Only one value field will be present. */
  publicKeyHex?: string;
  /** The value of the public key in Base64 format. Only one value field will be present. */
  publicKeyBase64?: string;
  /** The value of the public key in Base58 format. Only one value field will be present. */
  publicKeyBase58?: string;
  /** The value of the public key in Multibase format. Only one value field will be present. */
  publicKeyMultibase?: string;
}


/**
 * Defines a service descriptor entry present in a DID Document.
 */
 export interface IDIDDocumentServiceDescriptor {
  /** The fully-qualified ID of this service, e.g. `did:example:me.id;agent`. */
  id: string;
  /** The type of this service. */
  type: string;
  /** The endpoint of this service, as a URI or JSON-LD object. */
  serviceEndpoint: string | object;
  /** didcomm service extension */
  routingKeys: string[];
}

/**
 * Interface describing the expected shape of a Decentralized Identity Document.
 */
 export interface IDIDDocument {
  /** The standard context for DID Documents. */
  "@context": string[];
  /** The DID to which this DID Document pertains. */
  id: string;
  /** Array of verification methods associated with the DID. */
  verificationMethod?: IDIDDocumentVerificationMethod[];
  /** Array of services associated with the DID. */
  service?: IDIDDocumentServiceDescriptor[];
  /** Array of authentication methods. */
  authentication?: (string | IDIDDocumentVerificationMethod)[];
  /** Array of assertion methods. */
  assertionMethod?: (string | IDIDDocumentVerificationMethod)[];
  /** Array of key agreement methods */
  keyAgreement?: (string | IDIDDocumentVerificationMethod)[];
}
