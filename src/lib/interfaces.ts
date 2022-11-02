import type { IJWK, JsonWebKey2020 } from "@aviarytech/crypto"

/**
 * A secret.
 */
export interface ISecret {
  id: string;
  type: string;
  /** The value of the private key in PEM format. Only one value field will be present. */
  privateKeyPem?: string;

  /** The value of the private key in JWK format. Only one value field will be present. */
  privateKeyJwk?: any;

  /** The value of the private key in hex format. Only one value field will be present. */
  privateKeyHex?: string;

  /** The value of the private key in Base64 format. Only one value field will be present. */
  privateKeyBase64?: string;

  /** The value of the private key in Base58 format. Only one value field will be present. */
  privateKeyBase58?: string;

  /** The value of the private key in Multibase format. Only one value field will be present. */
  privateKeyMultibase?: string;

  asJsonWebKey(): Promise<JsonWebKey2020>;
}

export interface ISecretResolver {
  resolve(id: string): Promise<ISecret>;
}



/**
 * A verification method definition entry in a DID Document.
 */
export interface IDIDDocumentVerificationMethod {
  /** Fully qualified identifier of this public key, e.g. did:example:123#key-1 */
  id: string;

  /** The type of this public key, as defined in: https://w3c-ccg.github.io/ld-cryptosuite-registry/ */
  type: string;

  /** The DID of the controller of this key. */
  controller: string;

  /** The value of the public key in PEM format. Only one value field will be present. */
  publicKeyPem?: string;

  /** The value of the public key in JWK format. Only one value field will be present. */
  publicKeyJwk?: IJWK;

  /** The value of the public key in hex format. Only one value field will be present. */
  publicKeyHex?: string;

  /** The value of the public key in Base64 format. Only one value field will be present. */
  publicKeyBase64?: string;

  /** The value of the public key in Base58 format. Only one value field will be present. */
  publicKeyBase58?: string;

  /** The value of the public key in Multibase format. Only one value field will be present. */
  publicKeyMultibase?: string;

  /** Returns the public key in JWK format regardless of the current type */
  asJsonWebKey(): Promise<JsonWebKey2020>;

  toJSON(): object;
}

/**
 * Defines a service descriptor entry present in a DID Document.
 */
export interface IDIDDocumentServiceDescriptor {
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
export interface IDIDDocument {
  /** The JSON Document (self) */
  document: object;

  /** The JSON-LD context of the DID Documents. */
  "@context": string[] | string;

  /** The DID to which this DID Document pertains. */
  id: string;

  /** The controller of the DID */
  controller?: string;

  /** This DID is also known as */
  alsoKnownAs?: string;

  /** Array of verification methods associated with the DID. */
  verificationMethod?: IDIDDocumentVerificationMethod[];

  /** Array of services associated with the DID. */
  service?: IDIDDocumentServiceDescriptor[] | string[];

  /** Array of authentication methods. */
  authentication?: IDIDDocumentVerificationMethod[] | string[];

  /** Array of assertion methods. */
  assertionMethod?: IDIDDocumentVerificationMethod[] | string[];

  /** Array of key agreement methods */
  keyAgreement?: IDIDDocumentVerificationMethod[] | string[];

  /** Array of capability invocation methods */
  capabilityInvocation?: IDIDDocumentVerificationMethod[] | string[];

  /** Array of capability delegation methods */
  capabilityDelegation?: IDIDDocumentVerificationMethod[] | string[];

  normalizeVerificationMethod: (
    methods: (string | IDIDDocumentVerificationMethod)[]
  ) => IDIDDocumentVerificationMethod[];
  getVerificationMethodById: (id: string) => IDIDDocumentVerificationMethod | undefined;
  getServiceById: (id: string) => IDIDDocumentServiceDescriptor | undefined;
  getServiceByType: (type: string) => IDIDDocumentServiceDescriptor | undefined;
  getKeyAgreementById: (id: string) => IDIDDocumentVerificationMethod | undefined;
  getAllKeyAgreements: () => IDIDDocumentVerificationMethod[];
  getAuthenticationById: (id: string) => IDIDDocumentVerificationMethod | undefined;
  getCapabilityInvocationById: (id: string) => IDIDDocumentVerificationMethod | undefined;
  getCapabilityDelegationById: (id: string) => IDIDDocumentVerificationMethod | undefined;
  getAssertionMethodById: (id: string) => IDIDDocumentVerificationMethod | undefined;
  toJSON: () => object;
}

export interface IDIDResolver {
  resolve(id: string): Promise<IDIDDocument>;
}
