import { expect } from 'chai';
import 'mocha';
import { DigestUtils } from './digest-util';

describe('DigestUtil', () => {
  it('should compute digest for the given data', () => {
    const expectedDigest =
      '18f6a4874fd46762b7fb75bf9097b29db236546232894dc1442a6ff83ac48447';
    // console.log(expectedDigest);
    const data = Buffer.from('Proximax P2P test digest');

    const computedDigest = DigestUtils.computeDigest(data);
    // console.log(computedDigest);

    expect(computedDigest).to.be.equal(expectedDigest);
  });

  it('should return the validate digest for the given data', async () => {
    const expectedDigest =
      '18f6a4874fd46762b7fb75bf9097b29db236546232894dc1442a6ff83ac48447';
    const data = Buffer.from('Proximax P2P test digest');

    await DigestUtils.validateDigest(data, expectedDigest).subscribe(
      isValid => {
        // console.log(isValid);
        expect(isValid).to.be.true;
      }
    );
  });

  it('should throw error if the digest is not valid for the given data', async () => {
    const expectedDigest =
      '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e';
    const data = Buffer.from('Proximax P2P test digest');
    await expect(() => {
      DigestUtils.validateDigest(data, expectedDigest).subscribe(isValid => {
        // console.log(isValid);
        expect(isValid).to.be.true;
      });
    }).to.throw();
  });
});
