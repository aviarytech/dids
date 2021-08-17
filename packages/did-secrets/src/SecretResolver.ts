import { Secret } from "./Secret";

export class JSONSecretResolver {
  private secret: Secret;

  constructor(json: object) {
    this.secret = new Secret(json);
  }

  async resolve(id: string): Promise<Secret> {
    return this.secret;
  }
}
