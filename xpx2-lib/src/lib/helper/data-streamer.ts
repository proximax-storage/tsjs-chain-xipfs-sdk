import { from, Observable } from 'rxjs';

/**
 * Class represents data streamer. This helper class will read a big file or blob into smaller chunksize
 */
export class DataStreamer {
  // default chunk size is 64K. Chrome will crash on the larger size
  protected defaultChunkSize: number = 64 * 1024;

  // default offser
  private offset: number = 0;

  /**
   * DataStreamer constructor
   * @param data the file or blob
   */
  constructor(private data: File | Blob) {
    this.rewind();
  }

  /**
   * Read the file or blob into smaller chunksize.
   * Note: Chrome will crash on bigger chunksize, therefore, keep the chunksize smaller
   * @param length the length of the chunk size
   */
  public readStream(
    byteslength: number = this.defaultChunkSize
  ): Observable<ArrayBuffer> {
    return from(this.readBlockArrayBuffer(byteslength));
  }

  /**
   * Is this end of data file or blob
   */
  public isEndOfData(): boolean {
    return this.offset >= this.data.size;
  }

  /**
   * Rewind the offset with bytes length
   * @param bytesLength the byte length
   */
  private rewind(bytesLength: number = this.offset): void {
    this.offset -= bytesLength;
  }

  /**
   * Read the file or blob into smaller chunksize.
   * @param bytesLength the length of the chunksize
   */
  private readBlockArrayBuffer(
    bytesLength: number = this.defaultChunkSize
  ): Promise<ArrayBuffer> {
    const fileReader: FileReader = new FileReader();
    const dataChunk: File | Blob = this.data.slice(
      this.offset,
      this.offset + bytesLength
    );

    return new Promise<ArrayBuffer>((resolve, reject) => {
      fileReader.onload = (event: Event) => {
        const reader: FileReader = event.target as FileReader;
        const data: any = reader.result;

        // shift the data offset
        this.offset += dataChunk.size;

        resolve(data);
      };

      fileReader.onerror = (e: any) => {
        reject(e.error);
      };

      fileReader.readAsArrayBuffer(dataChunk);
    });
  }
}
