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

  toJSON(): object {
    switch (this.type) {
      case "JsonWebKey2020":
        return {
          id: this.id,
          type: this.type,
          controller: this.controller,
          publicKeyJwk: this.publicKeyJwk,
        };
      case "X25519KeyAgreementKey2019":
        return {
          id: this.id,
          type: this.type,
          controller: this.controller,
          publicKeyBase58: this.publicKeyBase58,
        };
    }
  }
}

export class DIDDocument implements IDIDDocument {
  document: object;
  "@context": string[];
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

    this["@context"] = document["@context"];
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

  toJSON(): object {
    let doc: any = { "@context": this["@context"], id: this.id };
    if (this.controller) {
      doc.controller = this.controller;
    }
    if (this.alsoKnownAs) {
      doc.alsoKnownAs = this.alsoKnownAs;
    }
    if (this.verificationMethod && this.verificationMethod.length > 0) {
      doc.verificationMethod = this.verificationMethod.map((x) => x.toJSON());
    }
    if (this.service && this.service.length > 0) {
      doc.service = this.service;
    }
    if (this.authentication && this.authentication.length > 0) {
      doc.authentication =
        typeof this.authentication[0] === "string"
          ? this.authentication
          : this.authentication.map((x) => x.id);
    }
    if (this.assertionMethod && this.assertionMethod.length > 0) {
      doc.assertionMethod =
        typeof this.assertionMethod[0] === "string"
          ? this.assertionMethod
          : this.assertionMethod.map((x) => x.id);
    }
    if (this.keyAgreement && this.keyAgreement.length > 0) {
      doc.keyAgreement =
        typeof this.keyAgreement[0] === "string"
          ? this.keyAgreement
          : this.keyAgreement.map((x) => x.id);
    }
    if (this.capabilityInvocation && this.capabilityInvocation.length > 0) {
      doc.capabilityInvocation =
        typeof this.capabilityInvocation[0] === "string"
          ? this.capabilityInvocation
          : this.capabilityInvocation.map((x) => x.id);
    }
    if (this.capabilityDelegation && this.capabilityDelegation.length > 0) {
      doc.capabilityDelegation =
        typeof this.capabilityDelegation[0] === "string"
          ? this.capabilityDelegation
          : this.capabilityDelegation.map((x) => x.id);
    }
    return doc;
  }
}
