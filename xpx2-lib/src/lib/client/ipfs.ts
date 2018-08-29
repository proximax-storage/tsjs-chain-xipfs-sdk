import { from, Observable } from 'rxjs';
import { Version } from '../model/ipfs/version';

export class IpfsClient {
  private localAPI: any;

  constructor(host: string, port?: string, options?: object) {
    const API = require('ipfs-api');
    this.localAPI = new API(host, port, options);
  }

  public isDaemonRunning(): Observable<Version> {
    return from(this.localAPI.version());
  }

  /*
  public createDataFile(
    data: any,
    name?: string,
    description?: string,
    contentType?: string,
    metadata?: Map<any, any>,
    options?: any
  ): Observable<dataFile.DataFile> {
    const df: dataFile.DataFile = {
      contentType,
      description,
      metadata,
      name,
      timestamp: Date.now()
    };

    if (typeof data === 'string') {
      df.data = data;
    }
    const pull = require('pull-stream');

    // convert string to buffer
    const localData = pull.values([Buffer.from(data)]);

    const createFile$ = from<IpfsContent[]>(
      this.localAPI.files.add(localData, options)
    ).pipe(
      map(res => {
        const result: IpfsContent = res[0];

        df.hash = result.hash;
        df.path = result.path;

        return df;
      })
    );

    return createFile$;
  }

  public addContent(
    content: FileContent,
    options?: any
  ): Observable<IpfsContent[]> {
    return from(this.localAPI.files.add(content, options));
  }*/
}
