import { ProximaxDataPayload } from "../proximax/data-payload";

export class UploadResult {
    constructor(
        public transactionHash:string,
        public privacyType:number,
        public version?:string,
        public data?:ProximaxDataPayload
    ){}
}