export class FileUploadResponse {

    constructor(public hash: string,
        public timestamp: number,
        public path?: string,
        public content?: string) { }

}
