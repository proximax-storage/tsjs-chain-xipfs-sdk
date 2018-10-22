import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { DigestUtils } from './digest-util';
import { StreamHelper } from './stream-helper';

chai.use(chaiAsPromised);

describe('DigestUtil', () => {
  it('should compute digest for the given data', async () => {
    const expectedDigest =
      '18f6a4874fd46762b7fb75bf9097b29db236546232894dc1442a6ff83ac48447';

    const stream = StreamHelper.string2Stream('Proximax P2P test digest');

    const computedDigest = await DigestUtils.computeDigest(stream);

    expect(computedDigest).to.be.equal(expectedDigest);
  });

  it('should return the validate digest for the given data', async () => {
    const expectedDigest =
      '18f6a4874fd46762b7fb75bf9097b29db236546232894dc1442a6ff83ac48447';
    const stream = StreamHelper.string2Stream('Proximax P2P test digest');

    const isValid = await DigestUtils.validateDigest(stream, expectedDigest);

    expect(isValid).to.be.true;
  });

  it('should throw error if the digest is not valid for the given data', async () => {
    const expectedDigest =
      '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e';
    const stream = StreamHelper.string2Stream('Proximax P2P test digest');

    expect(
      DigestUtils.validateDigest(stream, expectedDigest)
    ).to.be.rejectedWith(Error);
  });
});
