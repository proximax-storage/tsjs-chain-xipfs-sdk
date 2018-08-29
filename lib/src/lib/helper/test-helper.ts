import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
}
