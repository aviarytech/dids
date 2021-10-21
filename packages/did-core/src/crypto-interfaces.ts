interface Header {
  typ?: string;
  alg: string;
  kid: string;
  apu?: string;
  apv?: string;
  epk?: IJWK;
}
interface IJWE {
  protected: string;
  iv: string;
  ciphertext: string;
  tag: string;
  aad?: string;
  recipients?: {
    header: Header;
    encrypted_key: string;
  }[];
}
interface IJWS {
  header: Header;
  payload: string;
  signature: string;
  protected?: string;
}
interface IJWK {
  alg?: string;
  crv?: string;
  d?: string;
  dp?: string;
  dq?: string;
  e?: string;
  ext?: boolean;
  k?: string;
  key_ops?: string[];
  kid?: string;
  kty?: string;
  n?: string;
  oth?: Array<{
    d?: string;
    r?: string;
    t?: string;
  }>;
  p?: string;
  q?: string;
  qi?: string;
  use?: string;
  x?: string;
  y?: string;
  x5c?: string[];
  x5t?: string;
  "x5t#S256"?: string;
  x5u?: string;
}

export { IJWK, IJWE, IJWS, Header };

export interface BaseKeyPair {
  id: string;
  type:
    | "JsonWebKey2020"
    | "X25519KeyAgreementKey2019"
    | "Ed25519VerificationKey2018";
  controller: string;
  export(options: {
    privateKey?: boolean;
    type: "JsonWebKey2020" | "X25519KeyAgreementKey2019";
  }): Promise<JsonWebKey | X25519KeyPair>;
}
export declare class JsonWebKey implements BaseKeyPair {
  id: string;
  type: "JsonWebKey2020";
  controller: string;
  publicKeyJwk: IJWK;
  privateKeyJwk?: IJWK;
  constructor(
    id: string,
    controller: string,
    publicKeyJwk: IJWK,
    privateKeyJwk?: IJWK
  );
  static from: (k: any, options?: any) => Promise<any>;
  static generate: (options?: any) => Promise<any>;
  export(options?: {
    privateKey?: boolean;
    type: "JsonWebKey2020" | "X25519KeyAgreementKey2019";
  }): Promise<JsonWebKey | X25519KeyPair>;
  signer: () => any;
  verifier: () => any;
  encrypter: () => any;
  decrypter: () => any;
}
export declare class X25519KeyPair {
  id: string;
  type: "X25519KeyAgreementKey2019";
  controller: string;
  publicKeyBase58: string;
  privateKeyBase58?: string;
  publicKey: Uint8Array;
  privateKey?: Uint8Array;
  constructor(
    id: string,
    controller: string,
    publicKeyBase58: string,
    privateKeyBase58?: string
  );
  static generate: ({
    secureRandom,
  }: {
    secureRandom: () => Uint8Array;
  }) => Promise<X25519KeyPair>;
  static from: (
    k: JsonWebKey | X25519KeyPair,
    options: {}
  ) => Promise<X25519KeyPair>;
  export(options?: {
    privateKey?: boolean;
    type: "JsonWebKey2020";
  }): Promise<JsonWebKey>;
  deriveSecret({
    publicKey,
  }: {
    publicKey: JsonWebKey | X25519KeyPair;
  }): Promise<Uint8Array>;
}
