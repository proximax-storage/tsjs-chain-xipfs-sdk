import { expect } from 'chai';
import 'mocha';
import { IpfsInfo } from '../config/testconfig';
import { IpfsConnection } from '../connection/ipfs-connection';
import { StreamHelper } from '../helper/stream-helper';
import { FileRepositoryFactory } from './factory/file-repository-factory';
import { FileUploadService } from './file-upload-service';

describe('FileUploadService', () => {
  it('should upload content to file repository', async () => {
    const ipfsClient = FileRepositoryFactory.create(
      new IpfsConnection(IpfsInfo.host, IpfsInfo.port)
    );

    const fileUploadService = new FileUploadService(ipfsClient);

    const fileUploadResponse = await fileUploadService.uploadStream(async () =>
      StreamHelper.string2Stream('Proximax P2P test')
    );

    expect(fileUploadResponse.hash).to.be.equal(
      'QmTjC5q7fFkUh4spfXjzfahWVfkLMLcnsbnQ7ZhZwCNfq6'
    );
  });
});
