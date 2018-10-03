import { expect } from 'chai';
import 'mocha';
import { FileUploadResponse } from './file-upload-response';

describe('FileUploadResponse', () => {
  it('should create instance of FileUploadResponse', () => {
    const fur = new FileUploadResponse('sampleHash', Date.now());
    expect(fur).to.be.a.instanceof(FileUploadResponse);
  });
});
