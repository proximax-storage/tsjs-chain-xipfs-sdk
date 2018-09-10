import { expect } from 'chai';
import 'mocha';
import { IpfsConnection } from './ipfs-connection';

describe('IpfsConnection', () => {
  it('should create new ipfs connection', () => {
    const multiAddress = '172.24.231.91';
    const port = '5001';

    const connection = new IpfsConnection(multiAddress, port);
    expect(connection.host).to.be.equal(multiAddress);
    expect(connection.options).to.be.equal(port);
    expect(connection.getAPI() != null).to.be.true;
  });
});
