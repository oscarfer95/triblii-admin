import {BehaviorSubject, Observable} from 'rxjs';

import {Injectable} from '@angular/core';

import {SsUserDataModel} from '../../ss-shared/models/ss-user-data-model.model';

@Injectable({
  providedIn: 'root'
})
export class SsUserDataModelService {

  private _userDataModel: SsUserDataModel;
  private _userDataModel$: BehaviorSubject<SsUserDataModel>;

  constructor() {
    this._userDataModel = new SsUserDataModel();
    this._userDataModel$ = new BehaviorSubject<SsUserDataModel>(this._userDataModel);
  }

  public get userDataModel(): SsUserDataModel {
    return this._userDataModel;
  }

  public set userDataModel(user: SsUserDataModel) {
    this._userDataModel = user;

    this._userDataModel$.next(this._userDataModel);
  }

  public userDataModelListener(): Observable<SsUserDataModel> {
    return this._userDataModel$.asObservable();
  }
}
