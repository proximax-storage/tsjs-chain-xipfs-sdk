import { BlockchainNetworkType } from 'xpx2-js-sdk';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ipfsConnection: {
    multAddress: '172.24.231.93',
    port: '5001',
  },
  blockchainConnection: {
    network: BlockchainNetworkType.MIJIN_TEST,
    endpointUrl: 'http://172.24.231.93:3000',
    socketUrl: 'ws://172.24.231.93:3000',
    gatewayUrl: 'http://172.24.231.93:9000',
    senderTestAccount: {
      privateKey: '49C1DAB821368A6B813CDA16C9454B8020533D727C3D024324F062205A21F3AC',
      publicKey: 'A1089A38EC76F7E9DB832A01FBA47D77059C7B0443B366AA3A91BBDBEB54203A',
      address: 'SAC7H4GL3IBPBNY4ONXV3JXPYUHZLX2GCFEPK45W'
    },
    recipientTestAccount: {
      privateKey: '3FB36C8B5BFE5346585B3667019B744237DD493EA153B9BBE4B26FB5C3E9169C',
      publicKey: 'A75122155F4AA372C5A4048DF2E7033B4EE21070CE73B6F4530CBF20523E17DD',
      address: 'SCRJRFDWIAJDHA3NI5QXX3P374NIAHLWJG2WIDRP'
    }
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
