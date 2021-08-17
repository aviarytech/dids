import {
  JWK,
  X25519KeyAgreementKey2019,
  JsonWebKey2020,
} from "@aviarytech/crypto-core";
import { ISecret } from "./interfaces";

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

  private key: JsonWebKey2020 | X25519KeyAgreementKey2019;

  constructor(document: object) {
    this.id = document["id"];
    this.type = document["type"];

    switch (this.type) {
      case "JsonWebKey2020":
        this.publicKeyJwk = document["publicKeyJwk"];
        this.privateKeyJwk = document["privateKeyJwk"];
        this.key = new JsonWebKey2020(
          this.id,
          null,
          this.publicKeyJwk,
          this.privateKeyJwk
        );
        return this;
      case "X25519KeyAgreementKey2019":
        this.publicKeyBase58 = document["publicKeyBase58"];
        this.privateKeyBase58 = document["privateKeyBase58"];
        this.key = new X25519KeyAgreementKey2019(
          this.id,
          null,
          this.publicKeyBase58,
          this.privateKeyBase58
        );
        return this;
    }
    throw new SecretTypeNotFound(this.type);
  }

  asJwk(): JWK {
    return this.key.asJwk();
  }
}
