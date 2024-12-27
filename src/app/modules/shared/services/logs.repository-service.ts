import {AngularFirestore} from '@angular/fire/compat/firestore';

import {Injectable} from '@angular/core';

import {FirebaseRepository} from '../../../../framework/repository/firebase.repository';

@Injectable({
  providedIn: 'root'
})
export class LogsRepositoryService extends FirebaseRepository<any> {
  constructor(private _angularFireStore: AngularFirestore) {
    super(_angularFireStore);
  }

  protected getCollectionName(): string {
    return 'logs';
  }
}
