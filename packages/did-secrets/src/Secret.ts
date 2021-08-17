import { JWK } from "@aviarytech/crypto-core";
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
    this.message = `Secret ${type} not supported`;
  }
}

export class Secret implements ISecret {
  id: string;
  type: string;
  privateKeyPem?: string;
  privateKeyJwk?: any;
  privateKeyHex?: string;
  privateKeyBase64?: string;
  privateKeyBase58?: string;
  privateKeyMultibase?: string;

  constructor(document: object) {
    this.id = document["id"];
    this.type = document["type"];
    switch (this.type) {
      case "JsonWebKey2020":
        this.privateKeyJwk = document["privateKeyJwk"];
        return this;
    }
    throw new SecretTypeNotFound(this.type);
  }

  asJwk(): JWK {
    throw new SecretTypeAsJWKNotSupportedError(this.type);
  }
}
