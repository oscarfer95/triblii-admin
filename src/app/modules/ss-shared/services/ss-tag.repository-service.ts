import {AngularFirestore} from '@angular/fire/compat/firestore';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';
import {ConfigList} from 'src/framework/repository/config-list.model';

@Injectable({
  providedIn: 'root'
})
export class TagRepositoryService extends FirebaseRepository<any> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  public getCategoriesByPageCatalogue(configList: ConfigList): Observable<any> {
    return this.getByQuerys(configList);
  }

  protected getCollectionName(): string {
    return 'tags';
  }
}
