import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UploadParameterData } from '../upload/upload-parameter-data';

export class TestHelper {
  public static subscribeTestValue(
    observable: Observable<any>,
    expected: any
  ): string {
    let fail = '';
    let wasSubscribed = false;

    const subscription$ = observable.pipe(take(1)).subscribe(
      result => {
        if (result !== expected) {
          fail = 'Subscription result does not match the expected value';
        }
        wasSubscribed = true;
      },
      error => {
        console.log(error);
        fail = 'Subscription raised an error ' + error;
      },
      (/*completed*/) => {
        if (!wasSubscribed) {
          fail = 'Subscription produced no result';
        }
      }
    );
    subscription$.unsubscribe();

    return fail;
  }


  public static createUploadParameterData() : UploadParameterData {
     const name = 'upload parameter data';
     const description = 'upload parameter data description';
     const contentType = 'text/plain';
     const metadata = new Map<string,string>();
     metadata.set('author','Proximax');
     const uploadParameterData = new UploadParameterData(name,description, contentType, metadata);

     return uploadParameterData;
  }
}
