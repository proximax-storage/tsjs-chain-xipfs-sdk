import { expect } from 'chai';
import 'mocha';
import { BlockchainNetworkType } from '../model/blockchain/blockchain-network-type';
import { NemUtils } from './nem-utils';

describe('NemUtils', () => {
  const accountTest = {
    address: 'SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2',
    privateKey: '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930'.toUpperCase(),
    publicKey: 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase()
  };

  it('should create new account', () => {
    const util = new NemUtils(BlockchainNetworkType.MIJIN_TEST);
    const account = util.generateAccount();
    console.log(account.address.plain);
    expect(account.publicKey).to.not.be.equal(undefined);
    expect(account.privateKey).to.not.be.equal(undefined);
    expect(account.address).to.not.be.equal(undefined);
  });

  it('should be created via private key', () => {
    const util = new NemUtils(BlockchainNetworkType.MIJIN_TEST);

    const account = util.getAccount(accountTest.privateKey);
    console.log(account.address.plain);
    expect(account.publicKey).to.be.equal(accountTest.publicKey);
    expect(account.privateKey).to.be.equal(accountTest.privateKey);
    expect(account.address.plain()).to.be.equal(accountTest.address);
  });

  it('should create a public account from public key', () => {
    const util = new NemUtils(BlockchainNetworkType.MIJIN_TEST);
    const publicAccount = util.getPublicAccount(accountTest.publicKey);
    expect(publicAccount.publicKey).to.be.equal(accountTest.publicKey);
    expect(publicAccount.address.plain()).to.be.equal(accountTest.address);
  });
});
