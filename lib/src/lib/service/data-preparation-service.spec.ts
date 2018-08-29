import { expect } from 'chai';
import { IpfsConnection } from '../connection/ipfs-connection';
import { DataPreparationService } from './data-preparation-service';

describe('DataPreparationService', () => {
  const ipfsConnection = new IpfsConnection('localhost', '5001');
  const dataPreparationService = new DataPreparationService(ipfsConnection);

  it('should create proximax data model when input is string or text', done => {
    // setup
    const content = 'Proximax P2P storage ';
    const name = 'Text ' + Math.random();
    const desc = 'Test Proximax P2P storage ' + Date.now();
    const contentType = 'text/plain';
    const metadata = new Map<any, any>();
    metadata.set('author', 'Proximax');
    const expectedHash = 'QmSV5y3v9aWhJivY6YEphkt2z69aXRem8nRmVH5s8Xuosw';

    // test
    dataPreparationService
      .createProximaxDataModel(
        content,
        name,
        desc,
        contentType,
        false,
        metadata
      )
      .subscribe(
        response => {
          console.log(response);
          expect(response).to.be.exist;
          expect(response.dataHash).to.be.equal(expectedHash);
          expect(response.name).to.be.equal(name);
          expect(response.description).to.be.equal(desc);
          expect(response.digest).to.be.equal('');
          expect(response.metadata).to.be.equal(metadata);
        },
        error => {
          console.log(error);
          expect(error).to.not.be.exist;
        }
      );
    done();
  });
});
