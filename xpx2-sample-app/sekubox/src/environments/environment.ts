import { BlockchainNetworkType  } from 'xpx2-js-sdk';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ipfsConnection: {
    multAddress: '172.24.231.91',
    port: '5001',
  },
  blockchainConnection: {
    network: BlockchainNetworkType.MIJIN_TEST,
    endpointUrl: 'http://172.24.231.91:3000',
    gatewayUrl: 'http://172.24.231.91:9000',
    senderTestAccount: {
      privateKey: '',
      publicKey: '',
      address: ''
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
