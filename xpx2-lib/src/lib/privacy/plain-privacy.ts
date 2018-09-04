import { PrivacyType } from "../model/privacy/privacy-type";
import { PrivacyStrategy } from "./privacy";

export class PlainPrivacyStrategy implements PrivacyStrategy {

    public getPrivacyType(): number {
        return PrivacyType.PLAIN;
    }   
    
    public encrypt(data: any) {
       return data;
    }

    public decrypt(data: any) {
        return data;
    }


}