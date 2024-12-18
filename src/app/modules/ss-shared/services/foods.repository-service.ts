import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';

import {Injectable} from '@angular/core';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';

@Injectable({
  providedIn: 'root'
})
export class FoodsRepositoryService extends FirebaseRepository<any> {
  // TODO: CHANGE ANY TYPE OF FirebaseRepository< >
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  protected getCollectionName(): string {
    return 'foods';
  }
}
