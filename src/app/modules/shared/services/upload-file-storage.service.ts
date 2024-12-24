import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Injectable, OnDestroy } from '@angular/core';
import { finalize, firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';

import { UploadFileService } from '../components/ss-file-input/services/upload-file.service';
import { NumbersHelper } from '../helpers/numbers.helper';
import { UserDataModelService } from '../../auth/storage/user-data-model.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileStorageService extends UploadFileService implements OnDestroy {
  private _uploadPercent$: Subject<number>;
  private _dataResponse$: Subject<string>;

  private _unsubscribe: Subject<void>;

  private readonly _FILE_NAME_PREFIX = 'SS';

  constructor(private _userDataModelService: UserDataModelService,
    private _angularFireStorage: AngularFireStorage) {
    super();

    this._uploadPercent$ = new Subject<number>();
    this._dataResponse$ = new Subject<string>();
    this._unsubscribe = new Subject<void>();
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public upload(file: File): Observable<string> {
    const filePath: string = this._buildFilePath(file);

    const task = this._angularFireStorage.upload(filePath, file);
    const fileRef = this._angularFireStorage.ref(filePath);

    const uploadPercentFile: Observable<number> = <Observable<number>>task.percentageChanges();
    uploadPercentFile
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((percent: number) => {
        this._uploadPercent$.next(percent);
      });

    task.snapshotChanges()
      .pipe(
        takeUntil(this._unsubscribe),
        finalize(() => {
          firstValueFrom(fileRef.getDownloadURL())
            .then((fileUrl: string) => {
              this._dataResponse$.next(fileUrl);
            });
        }
        )
      )
      .subscribe();

    return this._dataResponse$.asObservable();
  }

  private _buildFilePath(file: File): string {
    const entityId: string = this._userDataModelService.userDataModel.entity.id;

    const time: number = new Date().getTime();
    const randomNumber: number = Math.round(NumbersHelper.getRandomFloat(1, 1000));
    const fileExtension: string | undefined = file.name.split('.').pop();
    const uniqueFileName: string = `${this._FILE_NAME_PREFIX}-${time}-${randomNumber}.${fileExtension}`

    return `/${entityId}/${uniqueFileName}`;
  }

  public uploadPercentListener(): Observable<number> {
    return this._uploadPercent$.asObservable();
  }
}
