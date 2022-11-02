import  { type JsonWebKey2020, JsonWebKeyPair, X25519KeyAgreementKey2019 } from "@aviarytech/crypto";
import type { ISecret } from "./interfaces.js";

export class SecretTypeAsJWKNotSupportedError extends Error {
  constructor(type: string) {
    super(type);
    this.message = `Secret ${type} as JWK not supported`;
  }
}

export class SecretTypeNotFound extends Error {
  constructor(type: string) {
    super(type);
    this.message = `Secret type "${type}" not supported`;
  }
}

export class Secret implements ISecret {
  id: string;
  type: string;
  privateKeyPem?: string;
  publicKeyPem?: string;
  privateKeyJwk?: any;
  publicKeyJwk?: any;
  privateKeyHex?: string;
  publicKeyHex?: string;
  privateKeyBase64?: string;
  publicKeyBase64?: string;
  privateKeyBase58?: string;
  publicKeyBase58?: string;
  privateKeyMultibase?: string;
  publicKeyMultibase?: string;

  private key: JsonWebKeyPair | X25519KeyAgreementKey2019;

  constructor(document: any) {
    this.id = document.id;
    this.type = document.type;

    switch (this.type) {
      case "JsonWebKey2020":
        this.publicKeyJwk = document.publicKeyJwk;
        this.privateKeyJwk = document.privateKeyJwk;
        this.key = new JsonWebKeyPair(
          this.id,
          this.id,
          this.publicKeyJwk,
          this.privateKeyJwk
        );
        return this;
      case "X25519KeyAgreementKey2019":
        this.publicKeyBase58 = document.publicKeyBase58;
        this.privateKeyBase58 = document.privateKeyBase58;
        this.key = new X25519KeyAgreementKey2019(
          this.id,
          this.id,
          this.publicKeyBase58 as string,
          this.privateKeyBase58
        );
        return this;
    }
    throw new SecretTypeNotFound(this.type);
  }

  async asJsonWebKey(): Promise<JsonWebKey2020> {
    switch (this.key.type) {
      case "JsonWebKey2020":
        return this.key;
      case "X25519KeyAgreementKey2019":
        return await this.key.export({
          privateKey: true,
          type: "JsonWebKey2020",
        });
    }
  }
}
