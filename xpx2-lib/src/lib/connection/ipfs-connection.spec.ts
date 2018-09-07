import { expect } from 'chai';
import 'mocha';
import { IpfsConnection } from './ipfs-connection';

describe('IpfsConnection', () => {
  it('should establish connection in the ipfs storage', async () => {
    const multiAddress = '172.24.231.91';
    const port = '5001';

    const connection = new IpfsConnection(multiAddress, port);
    await connection.isConnect().subscribe(response => {
      console.log(response);
      expect(response.status).to.be.equal('Connected');
    });
  });

  it('should not establish connection in the ipfs storage', async () => {
    const multiAddress = '172.24.231.92';
    const port = '5001';

    const connection = new IpfsConnection(multiAddress, port);
    await connection.isConnect().subscribe(response => {
      console.log(response);
      expect(response.status).to.be.equal('Disconnected');
    });
  });
});
