import {AngularFireStorage} from '@angular/fire/compat/storage';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {TtUserDataModelService} from './tt-user-data-model.service';

@Injectable({
  providedIn: 'root'
})
export class TtDeleteFileStorageService {

  constructor(private _ttUserDataModelService: TtUserDataModelService,
              private _angularFireStorage: AngularFireStorage) {
  }

  public delete(fileName: string): Observable<void> {
    const userId: string = this._ttUserDataModelService.userDataModel.id;
    const filePath: string = `/${userId}/${fileName}`;

    const fileRef = this._angularFireStorage.ref(filePath);

    return fileRef.delete();
  }
}
