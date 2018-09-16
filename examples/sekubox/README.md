# Sekubox

Sample Proximax P2P storage xpx2-ts-js-sdk

## Requirements

- Run local ipfs node
- Run local Proximax node

## Development server

Modify environments/environment.ts

```json
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
```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
