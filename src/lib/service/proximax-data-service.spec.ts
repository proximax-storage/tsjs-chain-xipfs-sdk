import { expect } from 'chai';
import 'mocha';
import { IpfsInfo,} from '../config/config.spec';
import { IpfsConnection } from '../connection/ipfs-connection';
import { ProximaxDataModel } from '../model/proximax/data-model';
// import { PrivacyType } from '../privacy/privacy-type';
// import { UploadParameter } from '../upload/upload-parameter';
// import { UploadParameterData } from '../upload/upload-parameter-data';
import { IpfsClient } from './client/ipfs-client';
import { ProximaxDataService } from './proximax-data-service';

describe('ProximaxDataService', () => {
  const connection = new IpfsConnection(IpfsInfo.multiaddress, IpfsInfo.port);
  const client = new IpfsClient(connection);
  const dataService = new ProximaxDataService(client);

  it('should add data to ipfs storage via upload parameter', async () => {
  /*  const uploadParamData = new UploadParameterData(
      Buffer.from('Proximax P2P storage')
    );

    const expectedHash = 'QmcQoG9VT4XYPNEpftg5to3vDmYifmGQ6c2w4oMcowgMsi';

    const uploadParam = new UploadParameter(
      uploadParamData,
      SenderAccount.privateKey,
      PrivacyType.PLAIN,
      SchemaVersion
    );

    await dataService.addData(uploadParam).subscribe(pdm => {
      //  console.log(pdm);
      expect(pdm.dataHash).to.be.equal(expectedHash);
    });*/
  });

  it('should get data to ipfs storage from ProximaxDataModel', async () => {
    const expectedHash = 'QmcQoG9VT4XYPNEpftg5to3vDmYifmGQ6c2w4oMcowgMsi';
    const expectedDataInText = 'Proximax P2P storage';
    const dataModel = new ProximaxDataModel(
      expectedHash,
      '',
      undefined,
      undefined,
      undefined,
      undefined,
      1536906194502
    );

    await dataService.getData(dataModel).subscribe(drd => {
      // console.log(drd);

      expect(drd.dataHash).to.be.equal(expectedHash);
      expect(drd.bytes.toString('utf8')).to.be.equal(expectedDataInText);
    });
  });
});
