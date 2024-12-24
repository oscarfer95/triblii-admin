import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export abstract class UploadFileService {
  public abstract upload(file: File): Observable<any>;

  public abstract uploadPercentListener(): Observable<number>;
}
