import { Transform, TransformOptions } from 'stream';

export class PbeCipherStreamOptions implements TransformOptions {
  constructor(public readonly password: string) {}

  // just to satisfy error TS2559
  public read?(this: Transform, size: number): void;
}
