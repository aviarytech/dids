import { IJWK, JsonWebKey } from "./crypto-interfaces";

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
  asJsonWebKey(): Promise<JsonWebKey>;
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
  /** The JSON Document (self) */
  document: object;

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

  normalizeVerificationMethod: (
    methods: (string | IDIDDocumentVerificationMethod)[]
  ) => IDIDDocumentVerificationMethod[];
  getVerificationMethodById: (id: string) => IDIDDocumentVerificationMethod;
  getServiceById: (id: string) => IDIDDocumentServiceDescriptor;
  getServiceByType: (type: string) => IDIDDocumentServiceDescriptor;
  getKeyAgreementById: (id: string) => IDIDDocumentVerificationMethod;
  getAllKeyAgreements: () => IDIDDocumentVerificationMethod[];
  getAuthenticationById: (id: string) => IDIDDocumentVerificationMethod;
  getCapabilityInvocationById: (id: string) => IDIDDocumentVerificationMethod;
  getCapabilityDelegationById: (id: string) => IDIDDocumentVerificationMethod;
  getAssertionMethodById: (id: string) => IDIDDocumentVerificationMethod;
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
