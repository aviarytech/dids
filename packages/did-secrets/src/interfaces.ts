/**
 * A secret.
 */
interface ISecret {
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
}

interface ISecretResolver {
  resolve(id: string): Promise<ISecret>;
}

export { ISecretResolver, ISecret };
