import { expect } from 'chai';
import 'mocha';

import { IpfsMultAddress } from '../../config/config.spec';
import { IpfsConnection } from './ipfs-connection';

describe('IpfsConnection', () => {
  it('should create new ipfs connection', () => {
    const multiAddress = IpfsMultAddress;
    const port = '5001';

    const connection = new IpfsConnection(multiAddress, port);
    expect(connection.host).to.be.equal(multiAddress);
    expect(connection.port).to.be.equal(port);
    expect(connection.getAPI() != null).to.be.true;
  });
});
