import fs from 'fs';
import { UploadResult } from '../src';

export class TestDataRepository {
  public static logAndSaveResult(result: UploadResult, testMethodName: string) {
    console.log('transaction hash: ' + result.transactionHash);
    console.log('data hash: ' + result.data.dataHash);

    TestDataRepository.TEST_DATA[testMethodName + '.transactionHash'] =
      result.transactionHash;
    TestDataRepository.TEST_DATA[testMethodName + '.dataHash'] =
      result.data.dataHash;
    TestDataRepository.TEST_DATA[testMethodName + '.digest'] =
      result.data.digest;

    TestDataRepository.saveTestDataMap();
  }

  public static getData(testMethodName: string, dataName: string): string {
    return TestDataRepository.TEST_DATA[testMethodName + '.' + dataName];
  }

  private static readonly TEST_DATA_JSON_FILE = './e2e/testdata.json';
  private static readonly TEST_DATA = TestDataRepository.loadTestDataMap();

  private static saveTestDataMap() {
    fs.writeFileSync(
      TestDataRepository.TEST_DATA_JSON_FILE,
      JSON.stringify(TestDataRepository.TEST_DATA)
    );
  }

  private static loadTestDataMap(): object {
    try {
      return JSON.parse(
        fs.readFileSync(TestDataRepository.TEST_DATA_JSON_FILE, 'utf8')
      );
    } catch (e) {
      return {};
    }
  }
}
