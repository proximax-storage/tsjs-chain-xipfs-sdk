import { BlockchainNetworkType } from 'xpx2-ts-js-sdk';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ipfsConnection: {
    multAddress: 'localhost',
    port: '5001',
  },
  blockchainConnection: {
    network: BlockchainNetworkType.MIJIN_TEST,
    endpointUrl: 'http://localhost:3000',
    socketUrl: 'ws://localhost:3000',
    gatewayUrl: '',
    senderTestAccount: {
      privateKey: '94EB884DE6AD35227C36A2C7B394837962C6935C80630DA4D4AE04753E60213E',
      publicKey: '5C71DEE7EF1D89DC564F5C96638F8DBE151B149F693D67ABEBBF06BF0420F68E',
      address: 'SDTBKKBYL7NJL6YAUUH6LLI2EOQ3KSILI54BRAMW'
    },
    recipientTestAccount: {
      privateKey: 'F6FDC9A905467EBB105D273DA71D356A2DF0028BE3D7D06DCA5731C21DB4F329',
      publicKey: 'E0CA41B850F9F76C91DA3924E7E5FEEC4B33A9DDE7F3F215AB86960FE341C352',
      address: 'SAAGY6OAZRIQDKL4I7ZCEPM5D3NUYHXIU3CDAJHB'
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
