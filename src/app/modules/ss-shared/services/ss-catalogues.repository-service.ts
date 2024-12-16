import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';

import {Injectable} from '@angular/core';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';
import {CatalogResponse} from './api/responses/catalog.response';

@Injectable({
  providedIn: 'root'
})
export class SsCatalogueRepositoryService extends FirebaseRepository<CatalogResponse> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  protected getCollectionName(): string {
    return 'catalogue';
  }

  public getByAccountId(accountId: string): Observable<CatalogResponse []> {
    return this.getByAttribute('accountId', accountId);
  }
}
