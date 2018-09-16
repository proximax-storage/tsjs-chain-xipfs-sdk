export const BaseHost = 'localhost';

export const IpfsInfo = {
  multiaddress: BaseHost,
  options: { protocol: 'http' },
  port: '5001'
};
export const BlockchainInfo = {
  endpointUrl: 'http://' + BaseHost + ':3000',
  gatewayUrl: 'http://' + BaseHost + ':9000',
  socketUrl: 'ws://' + BaseHost + ':3000'
};

export const SenderAccount = {
  address: 'SDTBKKBYL7NJL6YAUUH6LLI2EOQ3KSILI54BRAMW',
  privateKey:
    '94EB884DE6AD35227C36A2C7B394837962C6935C80630DA4D4AE04753E60213E',
  publicKey: '5C71DEE7EF1D89DC564F5C96638F8DBE151B149F693D67ABEBBF06BF0420F68E'
};
export const RecipientAccount = {
  address: 'SAAGY6OAZRIQDKL4I7ZCEPM5D3NUYHXIU3CDAJHB',
  privateKey:
    'F6FDC9A905467EBB105D273DA71D356A2DF0028BE3D7D06DCA5731C21DB4F329',
  publicKey: 'E0CA41B850F9F76C91DA3924E7E5FEEC4B33A9DDE7F3F215AB86960FE341C352'
};
export const SchemaVersion = '1.0';
export const SampleTransactionHash =
  '8567766E0EECE33953B01BC3B28C259673C11072E0283B895BC66793620B2548';
