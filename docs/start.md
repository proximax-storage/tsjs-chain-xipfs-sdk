
# Setting up local nodes

Skip this section if you do not use local nodes

## Setting up local IPFS node

Follow instruction [here](https://ipfs.io/blog/1-run-ipfs-on-docker/) to install and run IPFS using docker image

## Setting up local Proximax storage node 

Follow instruction [here](https://nemtech.github.io/getting-started/setup-workstation.html) to run catapult service using docker image.

## Setting up your development environment
### 1. Proximax storage xpx2-ts-js-sdk is build with Typescript language and it is recommended to use Typescript when building the application.

```nodejs
npm install -g typescript ts-node
``` 

### 1. Create a package.json file. The minimum required Node.js version is 8.9.X.

```nodejs
npm init
```

### 2. Install xpx2-ts-js-sdk and rxjs library
```nodejs
npm install xpx2-ts-js-sdk --save
```

## Basic Usages
### 1. Upload content

Imports xpx2-ts-js-sdk

```ts
import {
 PrivacyType,
  BlockchainNetworkConnection,
  UploadService,
  TransactionClient,
  BlockchainTransactionService,
  ProximaxDataService,
  IpfsClient,
  IpfsConnection,
  UploadParameterData,
  UploadParameter
} from 'xpx2-ts-js-sdk'
```

Prepares Proximax upload service 

```ts
// Creates ipfs connection
const ipfsConnection = new IpfsConnection(
    'localhost', // the host or multi address
    '5001', // the port number
    { protocol: 'http' } // the optional protocol
);

// Creates Proximax blockchain network connection
const blockchainConnection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST, // the network type
    'http://localhost:3000', // the rest api base endpoint
    'ws://localhost:3000', // the optional websocket end point 
); 

// Creates the ipfs client
const ipfsClient = new IpfsClient(ipfsConnection);

// Creates the blockchain transaction client
const transactionClient = new TransactionClient(blockchainConnection);

// Initilises Proximax data service
const dataService = new ProximaxDataService(ipfsClient);

// Initilises blockchain transaction service
const transactionService = new BlockchainTransactionService(blockchainConnection, transactionClient);

// Initilises upload service
const uploadService = new UploadService(transactionService,dataService);
```

Prepares upload paramater data for text
```ts
// Content to be uploaded
// The content can be a text or binary file.
const content = 'Proximax P2P storage';

// optional content metadata
const metadataMap = new Map<string, object>();
metadata.set('Author','Proximax');

// optional callback options
const options = {};

// optional content type
const contentType = 'text/plain';


// creates upload parameter data
const dataParam = new UploadParameterData(
      content, // the content to be upload
      null, // the file path , null for text content
      options, // the callback options e.g for progress handler
      description, // the content description
      contentType, // the content type
      metadataMap,  // the optional metadata
      title
    );

// validate the upload parameter
dataParam.validate();
```

Prepares upload parameter data for binary file
```ts
// Content to be uploaded
let content: any; 

// read single file from standard browser file input
const file = fileInput.files[0];

const reader = new FileReader();
reader.onloadend = () => {
    content = reader.result;
};
reader.readAsArrayBuffer(file);

// optional content metadata
const metadataMap = new Map<string, object>();
metadata.set('Author','Proximax');

// optional callback options
const options = {
    progress: (bytes: number) => {
         console.log(`Progress: ${bytes}/${file.size}`);
    }
};

// optional content type
const contentType = file.type;


// creates upload parameter data
const dataParam = new UploadParameterData(
      content, // the content to be upload
      null, // the file path , null for text content
      options, // the callback options e.g for progress handler
      description, // the content description
      contentType, // the content type
      metadataMap,  // the optional metadata
      title
    );

// validate the upload parameter
dataParam.validate();
```

Prepares upload parameter

```ts
// sender and recipient account infos
const senderPrivateKey = '';
const recipientPublicKey = '';
const recipientAddress = '';

// privacy type
const privacyType = PrivacyType.PLAIN;

// the schema version
const version = '1.0';

// transaction deadline
const deadline = 1; // 1 hour

// use blockchain secure message for transaction
const useBlockchainSecureMessage = false;

// auto detect content type
const autoDetectContentType = true;

// creates upload parameter
const uploadParam = new UploadParameter(
    dataParam,  // the data parameter
    senderPrivateKey,
    privacyType,
    version,
    recipientPublicKey,
    recipientAddress,
    deadline,
    useBlockchainSecureMessage,
    autoDetectContentType);

// validates upload parameter
uploadParam.validate();
```

Uploads the content

```ts
// call upload services
uploadService.upload(uploadParam).subscribe(
    transactionHash => {
        console.log(transactionHash);
    }
)
```

Note: The file size to be uploaded to IPFS storage is 1.5GB for most browsers except Google Chrome.
Please check the status of this known [issue](https://github.com/ipfs/js-ipfs-api/pull/851).

### 2. Download content


Imports xpx2-ts-js-sdk

```ts
import {
 PrivacyType,
  BlockchainNetworkConnection,
  UploadService,
  TransactionClient,
  BlockchainTransactionService,
  ProximaxDataService,
  IpfsClient,
  IpfsConnection,
  DownloadParameter
} from 'xpx2-ts-js-sdk'
```

Prepares Proximax download service 

```ts
// Creates ipfs connection
const ipfsConnection = new IpfsConnection(
    'localhost', // the host or multi address
    '5001', // the port number
    { protocol: 'http' } // the optional protocol
);

// Creates Proximax blockchain network connection
const blockchainConnection = new BlockchainNetworkConnection(
    BlockchainNetworkType.MIJIN_TEST, // the network type
    'http://localhost:3000', // the rest api base endpoint
    'ws://localhost:3000', // the optional websocket end point 
); 

// Creates the ipfs client
const ipfsClient = new IpfsClient(ipfsConnection);

// Creates the blockchain transaction client
const transactionClient = new TransactionClient(blockchainConnection);

// Initilises Proximax data service
const dataService = new ProximaxDataService(ipfsClient);

// Initilises blockchain transaction service
const transactionService = new BlockchainTransactionService(blockchainConnection, transactionClient);

// Initilises upload service
const downloadService = new DownloadService(transactionService,dataService);
```


Prepares download parameter

```ts
// the transaction hash
const transactionHash = '';

// sender and recipient account infos
const privateKey = '';

// privacy type
const privacyType = PrivacyType.PLAIN;

// creates upload parameter
const downloadParam = new DownloadParameter(
    transactionHash,  
    privateKey,
    privacyType);

// validates download parameter
downloadParam.validate();
```

Downloads the content

```ts
// call download services
downloadService.download(uploadParam).subscribe(
    result => {
        const blob = new Blob([result.data.bytes], { type: result.data.contentType });
        this.fileUrl = window.URL.createObjectURL(blob);
    }
);
```
