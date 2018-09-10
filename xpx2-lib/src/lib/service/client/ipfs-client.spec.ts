import { expect } from 'chai';
import 'mocha';
import { IpfsMultAddress, IpfsPort } from '../../config/config.spec';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { IpfsClient } from './ipfs-client';

describe('IpfsClient', () => {
  const connection = new IpfsConnection(IpfsMultAddress, IpfsPort);
  const client = new IpfsClient(connection);

  it('should connect to Ipfs storage', async () => {
    await client.isConnect().subscribe(response => {
      console.log(response);
      expect(response.status).to.be.equal('Connected');
    });
  });

  it('should not establish connection in the ipfs storage', async () => {
    const multiAddress = '172.24.231.92';
    const port = '5001';

    const connection2 = new IpfsConnection(multiAddress, port);
    const client2 = new IpfsClient(connection2);
    await client2.isConnect().subscribe(response => {
      console.log(response);
      expect(response.status).to.be.equal('Disconnected');
    });
  });
});
