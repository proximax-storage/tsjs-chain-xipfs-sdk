import { expect } from 'chai';
import 'mocha';
import { IpfsInfo } from '../../config/testconfig';
import { IpfsConnection } from '../../connection/ipfs-connection';
import { StreamHelper } from '../../helper/stream-helper';
import { IpfsClient } from './ipfs-client';

describe('IpfsClient', () => {
  const connection = new IpfsConnection(IpfsInfo.host, IpfsInfo.port);
  const client = new IpfsClient(connection);

  it('should add data to ipfs storage and return data hash', async () => {
    const stream = StreamHelper.string2Stream('Proximax P2P storage');
    const response = await client.addStream(stream).toPromise();

    expect(response.length > 0).to.be.true;
  });

  it('should add data to ipfs storage and get data from ipfs storage', async () => {
    const stream = StreamHelper.string2Stream('Proximax P2P storage');
    const dataHash = await client.addStream(stream).toPromise();
    const retrievedStream = await client.getStream(dataHash).toPromise();

    expect(retrievedStream).to.be.not.equal(undefined);
  });
});
