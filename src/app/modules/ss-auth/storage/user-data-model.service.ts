import {BehaviorSubject, Observable} from 'rxjs';

import {Injectable} from '@angular/core';

import {UserDataModel} from '../../ss-shared/models/user-data-model.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataModelService {

  private _userDataModel: UserDataModel;
  private _userDataModel$: BehaviorSubject<UserDataModel>;

  constructor() {
    this._userDataModel = new UserDataModel();
    this._userDataModel$ = new BehaviorSubject<UserDataModel>(this._userDataModel);
  }

  public get userDataModel(): UserDataModel {
    return this._userDataModel;
  }

  public set userDataModel(user: UserDataModel) {
    this._userDataModel = user;

    this._userDataModel$.next(this._userDataModel);
  }

  public userDataModelListener(): Observable<UserDataModel> {
    return this._userDataModel$.asObservable();
  }
}
