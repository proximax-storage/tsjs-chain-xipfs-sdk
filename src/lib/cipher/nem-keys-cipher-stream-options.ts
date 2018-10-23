import { Transform, TransformOptions } from 'stream';

export class NemKeysCipherStreamOptions implements TransformOptions {
  constructor(
    public readonly privateKey: string,
    public readonly publicKey: string
  ) {}

  // just to satisfy error TS2559
  public read?(this: Transform, size: number): void;
}
