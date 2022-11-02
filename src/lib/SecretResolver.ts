import { Secret } from "$lib/Secret.js";
import { base64url, utf8 } from "@aviarytech/crypto";

export class JSONSecretResolver {
  private secret: Secret;

  constructor(json: object) {
    this.secret = new Secret(json);
  }

  async resolve(id: string): Promise<Secret> {
    return this.secret;
  }
}

export class EnvironmentVariableSecretResolver {
  private secrets: Secret[];

  constructor(env: any) {
    this.secrets = JSON.parse(utf8.decode(base64url.decode(env.SECRETS)))
  }

  async resolve(id: string): Promise<Secret> {
    const secret = this.secrets.find(s => s.id === id)
    if (!secret) throw new Error('No (base64 encoded secrets) found in environment')
    return new Secret(secret);
  }
}