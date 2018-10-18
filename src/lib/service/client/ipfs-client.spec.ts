import { expect } from 'chai';
import 'mocha';
import { switchMap } from 'rxjs/operators';
import { IpfsInfo } from '../../config/testconfig';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { IpfsClient } from './ipfs-client';

describe('IpfsClient', () => {
  const connection = new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port);
  const client = new IpfsClient(connection);

  it('should add data to ipfs storage and return data hash', async () => {
    const data = Buffer.from('Proximax P2P storage');
    await client.addStream(data).subscribe(response => {
      // console.log(response);
      expect(response.length > 0).to.be.true;
    });
  });

  it('should add data to ipfs storage and get data from ipfs storage', async () => {
    const message = 'Proximax P2P storage';
    const data = Buffer.from(message);
    await client
      .addStream(data)
      .pipe(
        switchMap(hash => {
          // console.log('Hash ' + hash);
          return client.getStream(hash);
        })
      )
      .subscribe(ipfsContent => {
        // console.log(ipfsContent);
        // console.log(ipfsContent[0].content);
        expect(ipfsContent[0].content).to.be.not.equal(undefined);
      });
  });
});
