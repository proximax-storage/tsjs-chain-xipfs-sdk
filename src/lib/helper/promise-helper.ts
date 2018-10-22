export class PromiseHelper {
  public static async timeout<T>(
    promise: Promise<T>,
    action: string,
    timeoutDuration: number
  ): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        reject(new Error(`timeout reach waiting for ${action}`));
      }, timeoutDuration);
      promise.then(() => clearTimeout(wait));
    });

    return Promise.race([promise, timeoutPromise]);
  }
}
