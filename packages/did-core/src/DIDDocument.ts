import { IJWK, JsonWebKey, X25519KeyPair } from "./crypto-interfaces";
import {
  IDIDDocument,
  IDIDDocumentServiceDescriptor,
  IDIDDocumentVerificationMethod,
} from "./interfaces";

export class DIDDocumentVerificationMethod
  implements IDIDDocumentVerificationMethod
{
  id: string;
  type: "JsonWebKey2020" | "X25519KeyAgreementKey2019";
  controller: string;
  publicKeyPem?: string;
  publicKeyJwk?: IJWK;
  publicKeyHex?: string;
  publicKeyBase64?: string;
  publicKeyBase58?: string;
  publicKeyMultibase?: string;

  constructor(document: any) {
    Object.assign(this, document);
  }

  async asJsonWebKey(): Promise<JsonWebKey> {
    switch (this.type) {
      case "JsonWebKey2020":
        return new JsonWebKey(
          this.id,
          this.controller,
          this.publicKeyJwk,
          null
        ) as JsonWebKey;
      case "X25519KeyAgreementKey2019":
        return await new X25519KeyPair(
          this.id,
          this.controller,
          this.publicKeyBase58,
          null
        ).export({ privateKey: false, type: "JsonWebKey2020" });
    }
  }
}

export class DIDDocument implements IDIDDocument {
  document: object;
  context: string[];
  id: string;
  controller?: string;
  alsoKnownAs?: string;
  verificationMethod?: IDIDDocumentVerificationMethod[];
  service?: IDIDDocumentServiceDescriptor[];
  authentication?: IDIDDocumentVerificationMethod[];
  assertionMethod?: IDIDDocumentVerificationMethod[];
  keyAgreement?: IDIDDocumentVerificationMethod[];
  capabilityInvocation?: IDIDDocumentVerificationMethod[];
  capabilityDelegation?: IDIDDocumentVerificationMethod[];

  constructor(document: object) {
    if (typeof document["@context"] === "undefined") {
      throw new Error("@context is required");
    }
    if (typeof document["id"] === "undefined") {
      throw new Error("id is required");
    }

    this.document = document;

    this.context = document["@context"];
    this.id = document["id"];
    this.controller = document["controller"] ?? null;
    this.alsoKnownAs = document["alsoKnownAs"] ?? null;

    if (
      document["verificationMethod"] &&
      document["verificationMethod"].length > 0
    ) {
      this.verificationMethod = document["verificationMethod"].map(
        (v: IDIDDocumentVerificationMethod) =>
          new DIDDocumentVerificationMethod(v)
      );
    }

    if (document["authentication"] && document["authentication"].length > 0) {
      this.authentication = this.normalizeVerificationMethod(
        document["authentication"]
      );
    }

    if (document["keyAgreement"] && document["keyAgreement"].length > 0) {
      this.keyAgreement = this.normalizeVerificationMethod(
        document["keyAgreement"]
      );
    }

    if (document["assertionMethod"] && document["assertionMethod"].length > 0) {
      this.assertionMethod = this.normalizeVerificationMethod(
        document["assertionMethod"]
      );
    }

    if (
      document["capabilityInvocation"] &&
      document["capabilityInvocation"].length > 0
    ) {
      this.capabilityInvocation = this.normalizeVerificationMethod(
        document["capabilityInvocation"]
      );
    }

    if (
      document["capabilityDelegation"] &&
      document["capabilityDelegation"].length > 0
    ) {
      this.capabilityDelegation = this.normalizeVerificationMethod(
        document["capabilityDelegation"]
      );
    }

    if (document["service"] && document["service"].length > 0) {
      this.service = document["service"].map(
        (s: IDIDDocumentServiceDescriptor) => s
      );
    }
  }

  normalizeVerificationMethod(
    methods: (string | IDIDDocumentVerificationMethod)[]
  ): IDIDDocumentVerificationMethod[] {
    return methods.map((m: string | IDIDDocumentVerificationMethod) => {
      if (typeof m === "string") {
        const v = this.getVerificationMethodById(m);
        if (!v) {
          throw new Error(`Verification method: ${m} not found`);
        }
        return v;
      } else {
        return m as IDIDDocumentVerificationMethod;
      }
    });
  }

  getVerificationMethodById(id: string): IDIDDocumentVerificationMethod {
    return this.verificationMethod.find((v) => v.id === id);
  }

  getServiceById(id: string): IDIDDocumentServiceDescriptor {
    return this.service.find((s) => s.id === id);
  }

  getServiceByType(type: string): IDIDDocumentServiceDescriptor {
    return this.service.find((s) => s.type === type);
  }

  getKeyAgreementById(id: string): IDIDDocumentVerificationMethod {
    return this.keyAgreement.find((k) => k.id === id);
  }

  getAllKeyAgreements(): IDIDDocumentVerificationMethod[] {
    return this.keyAgreement;
  }

  getAuthenticationById(id: string): IDIDDocumentVerificationMethod {
    return this.authentication.find((k) => k.id === id);
  }

  getCapabilityInvocationById(id: string): IDIDDocumentVerificationMethod {
    return this.capabilityInvocation.find((k) => k.id === id);
  }

  getCapabilityDelegationById(id: string): IDIDDocumentVerificationMethod {
    return this.capabilityDelegation.find((k) => k.id === id);
  }

  getAssertionMethodById(id: string): IDIDDocumentVerificationMethod {
    return this.assertionMethod.find((k) => k.id === id);
  }
}
