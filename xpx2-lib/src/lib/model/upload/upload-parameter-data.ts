export class UploadParameterData  {
    constructor(
        public readonly byteStreams:any,
        public readonly path?:string,
        public readonly description?: string,
        public readonly name?:string,
        public readonly metadata?:Map<string,any>,
        public readonly contentType?:string
    ){}
}