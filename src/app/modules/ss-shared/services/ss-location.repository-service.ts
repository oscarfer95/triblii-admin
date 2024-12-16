import {AngularFirestore} from '@angular/fire/compat/firestore';

import {Injectable} from '@angular/core';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';
import {ConfigList} from 'src/framework/repository/config-list.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends FirebaseRepository<any> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  public getCollectionName(): string {
    return 'location';
  }
  
  public getByQuery(configList: ConfigList): Observable<any> {
    return this.getByQuerys(configList);
  }
}
