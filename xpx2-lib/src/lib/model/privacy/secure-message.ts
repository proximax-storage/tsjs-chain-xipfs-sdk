export class SecureMessage {
  public static create(message: string): SecureMessage {
    return new SecureMessage(2, message);
  }

  constructor(public readonly type: number, public readonly payload: string) {}
}
