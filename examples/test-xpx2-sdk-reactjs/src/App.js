import React, {Component} from 'react';
import './App.css';
import {
  BlockchainNetworkConnection,
  BlockchainNetworkType,
  ConnectionConfig,
  Downloader,
  IpfsConnection,
  Protocol,
  Uploader,
  UploadParameter
} from 'xpx2-ts-js-sdk';

class App extends Component {
  privatekey1 = '97226FCCBD876D399BA2A70E640AD2C2C97AD5CE57A40EE9455C226D3C39AD49';
  publickey1 = '632479641258F56F961473CD729F6357563D276CE7B68D5AD8F9F7FA071BB963';
  address1 = 'SDB5DP6VGVNPSQJYEC2X3QIWKAFJ3DCMNQCIF6OA';

  privatekey2 = 'D19EDBF7C5F4665BBB168F8BFF3DC1CA85766080B10AABD60DDE5D6D7E893D5B';
  publickey2 = 'D1869362F4FAA5F683AEF78FC0D6E04B976833000F3958862A09CC7B6DF347C2';
  address2 = 'SDUCJBPMHXWEWJL6KI4GVW3X4EKWSINM3WBVUDQ2';

  defaultpassword = 'thisismypassword';

  connectionConfig = ConnectionConfig.createWithLocalIpfsConnection(
    new BlockchainNetworkConnection(
      BlockchainNetworkType.MIJIN_TEST,
      'privatetest1.proximax.io',
      3000,
      Protocol.HTTP
    ),
    new IpfsConnection('ipfs2.dev.proximax.io', 5001)
  );

  uploader = new Uploader(this.connectionConfig);
  downloader = new Downloader(this.connectionConfig);


  constructor(connect) {
    super();
    this.state = {
      uploadResult: "",
      text: "enter text here"};
  }

  changeText = async evt => this.setState({text: evt.target.value});

  testPlainUpload = async () => {
    const param = UploadParameter.createForStringUpload(
      this.state.text,
      '97226FCCBD876D399BA2A70E640AD2C2C97AD5CE57A40EE9455C226D3C39AD49'
    )
      .build();

    const uploadResult = await this.uploader.upload(param);

    this.setState({uploadResult: JSON.stringify(uploadResult)});
  };

  testPasswordUpload = async () => {
    const param = UploadParameter.createForStringUpload(
      this.state.text,
      '97226FCCBD876D399BA2A70E640AD2C2C97AD5CE57A40EE9455C226D3C39AD49'
    )
      .withPasswordPrivacy(this.defaultpassword)
      .build();

    const uploadResult = await this.uploader.upload(param);

    this.setState({uploadResult: JSON.stringify(uploadResult)});
  };

  testNemKeysUpload = async () => {
    const param = UploadParameter.createForStringUpload(
      this.state.text,
      '97226FCCBD876D399BA2A70E640AD2C2C97AD5CE57A40EE9455C226D3C39AD49'
    )
      .withNemKeysPrivacy(this.privatekey1, this.publickey2)
      .build();

    const uploadResult = await this.uploader.upload(param);

    this.setState({uploadResult: JSON.stringify(uploadResult)});
  };

  render() {
    return (
      <div className="App">
        <p id="state" className="App-intro">
          <textarea value={this.state.text} onChange={this.changeText} style={{width: 500, height: 300}}/><br/>
          <button onClick={this.testPlainUpload}>test plain upload</button> &nbsp;
          <button onClick={this.testPasswordUpload}>test password upload</button> &nbsp;
          <button onClick={this.testNemKeysUpload}>test nem keys upload</button>
        </p>
        <br/>
        <p id="state">
          {this.state.uploadResult}
        </p>
      </div>
    );
  }
}

export default App;
