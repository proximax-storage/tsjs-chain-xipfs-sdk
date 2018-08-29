import { expect } from 'chai';
import 'mocha';
import { TestHelper } from '../helper/test-helper';
import { IpfsClient } from './ipfs';

describe('IpfsClient', () => {
  const client = new IpfsClient('localhost', '5001');
  it('should connect to local node and retrieve the node version number', () => {
    client.isDaemonRunning().subscribe(
      response => {
        expect(response).to.be.exist;
        expect(response).to.have.property('version');
        expect(response).to.have.property('repo');
        expect(response).to.have.property('commit');
      },
      error => {
        expect(error).to.not.be.exist;
      }
    );
  });

  it('should add text content to ipfs and return it hash', async () => {
    const Buffer = require('buffer').Buffer;
    const textContent = Buffer.from('Proximax P2P storage');
    const expectedHash = 'QmcQoG9VT4XYPNEpftg5to3vDmYifmGQ6c2w4oMcowgMsi';
    const test = await TestHelper.subscribeTestValue(
      client.addContent(textContent),
      expectedHash
    );
    console.log(test);
    /*client
      .addContent(textContent)
      .subscribe(
        response => {
          console.log(response);
          expect(response).to.have.length(2);
          expect(response[0].hash).to.not.equal(expectedHash);
          expect(response[0].path).to.equal(expectedHash);
        },
        error => {
          expect(error).to.not.be.exist;
        }
      );
   */
  });

  it('should create data from after uploading buffer content to ipfs network', () => {
    const Buffer = require('buffer').Buffer;
    const fileContent = Buffer.from('Proximax P2P storage ' + Date.now());
    const metadata = new Map<any, any>();
    metadata.set('author', 'proximax');
    client
      .createDataFile(
        fileContent,
        'proximax test file',
        'This is a test',
        'text/plain',
        metadata
      )
      .subscribe(res => {
        console.log(res);
      });
  });

  it('should create data from after uploading text content to ipfs network', () => {
    // const Buffer = require('buffer').Buffer;
    const fileContent = 'Proximax P2P storage upload text ' + Date.now();
    const metadata = new Map<any, any>();
    metadata.set('author', 'proximax');
    client
      .createDataFile(
        fileContent,
        'proximax test file',
        'This is a test',
        'text/plain',
        metadata
      )
      .subscribe(res => {
        console.log(res);
      });
  });
});
