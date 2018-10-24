export class FileUploadResponse {
  constructor(
    public readonly hash: string,
    public readonly timestamp: number,
    public readonly digest?: string
  ) {}
}
