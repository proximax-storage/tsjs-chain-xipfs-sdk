/*import { Message, NetworkType, PlainMessage, TransferTransaction } from 'nem2-sdk';
import { BlockchainNetworkConnection } from '../connection/blockchain-network-connection';
import { Converter } from '../helper/converter';
import { EncryptedMessage } from '../model/blockchain/encrypted-message';
import { ProximaxMessagePayloadModel } from '../model/proximax/message-payload-model';
import { AccountClient } from './client/catapult/account-client';
import { SecureMessage } from '../model/blockchain/secure-message';
import { KeyPair, convert } from 'xpx2-library';



export class BlockchainMessageService {

    // private networkType: NetworkType;
    // private accountClient: AccountClient;

    constructor(blockchainNetworkConnection: BlockchainNetworkConnection) {
       // this.accountClient = new AccountClient(blockchainNetworkConnection);
       // this.networkType = Converter.getNemNetworkType(blockchainNetworkConnection.networkType);
    }

    public createMessage(messagePayload: ProximaxMessagePayloadModel, senderPrivateKey: string,
        recipientPublicKeyRaw: string, useBlockchainSecureMessage): Message {
        if (messagePayload === null) {
            throw new Error('Message payload is required');
        }

        const jsonPayload = JSON.stringify(messagePayload);

        if (useBlockchainSecureMessage) {
            // const recipientPublicKey = this.getRecipientPublicKey(senderPrivateKey, recipientPublicKeyRaw, recipientAddress);
            return EncryptedMessage.create(jsonPayload, senderPrivateKey, recipientPublicKeyRaw);
        } else {
            return PlainMessage.create(jsonPayload);
        }
    }

    public getMessage(transferTransaction:TransferTransaction, accountPrivateKey: string) {
        // Secure Message
        if(transferTransaction.message.type === 2) {
            const accountKeyPair: PKeyPair = KeyPair.createKeyPairFromPrivateKeyString(accountPrivateKey);
            return EncryptedMessage.decrypt(transferTransaction.message.payload,accountPrivateKey,convert.uint8ToHex(accountKeyPair.publicKey)).payload;
        } else {
            return transferTransaction.message.payload;
        }
    }


    
    public getRecipientPublicKey(senderPrivateKey:string, recipientPublicKey:string, recipientAddress:string): string {
        if(recipientPublicKey !==null){
            return recipientPublicKey;
        } else if( recipientAddress !==null) {
            const senderKeyPair: PKeyPair = KeyPair.createKeyPairFromPrivateKeyString(senderPrivateKey);
            const senderAddress = AddressLibary.addressToString(AddressLibary.publicKeyToAddress(senderKeyPair.publicKey,this.networkType));
            console.log(senderAddress);
            if(senderAddress === recipientAddress) {
                return convert.uint8ToHex(senderKeyPair.publicKey);
            } else {
                this
            }

        }
    }
}*/
