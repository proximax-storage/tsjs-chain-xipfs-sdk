import 'mocha';
import { IpfsInfo } from '../config/testconfig';
import { IpfsConnection } from '../connection/ipfs-connection';
import { RetrieveProximaxDataService } from './retrieve-proximax-data-service';

import { expect } from 'chai';
import { StreamHelper } from '../helper/stream-helper';
import { PlainPrivacyStrategy } from '../privacy/plain-privacy';

describe('RetrieveProximaxDataService', () => {
  const retrieveProximaxDataService = new RetrieveProximaxDataService(
    new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port)
  );

  it('should get stream with datahash', async () => {
    const expectedContent = 'Proximax P2P CreateProximaxDataService';

    const dataHash = 'QmVjQMmQu79Q751eSVHDuR6QHtTAAGvEhexPUwRmotjzm5';
    const response = await retrieveProximaxDataService.getStream(
      dataHash,
      PlainPrivacyStrategy.create(),
      false,
      '',
      'text/plain'
    );

    const content = await StreamHelper.stream2String(response);
    expect(content).to.be.equal(expectedContent);
  });
});
