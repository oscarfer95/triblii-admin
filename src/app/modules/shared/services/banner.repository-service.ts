import {AngularFirestore} from '@angular/fire/compat/firestore';

import {Injectable} from '@angular/core';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';
import {BannerResponse} from './api/responses/banner.response';

@Injectable({
  providedIn: 'root'
})
export class BannerRepositoryService extends FirebaseRepository<BannerResponse> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  protected getCollectionName(): string {
    return 'banners';
  }
}
