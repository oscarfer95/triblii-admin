import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';

import {Injectable} from '@angular/core';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';
import {BannerResponse} from './api/responses/banner.response';

@Injectable({
  providedIn: 'root'
})
export class SsBannerRepositoryService extends FirebaseRepository<BannerResponse> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  protected getCollectionName(): string {
    return 'catalogue-banner';
  }

  public getByAccountId(catalogueId: string): Observable<BannerResponse []> {
    return this.getByAttribute('catalogueId', catalogueId);
  }

  public getByCatalogueId(catalogueId: string): Observable<any> {
    return this.getByAttribute('catalogueId', catalogueId);
  }
}
