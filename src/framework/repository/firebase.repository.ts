import {AngularFirestore, Query} from '@angular/fire/compat/firestore';
import {AngularFirestoreCollection} from '@angular/fire/compat/firestore/collection/collection';
import {CollectionReference} from '@angular/fire/compat/firestore';
import {DocumentReference} from '@angular/fire/compat/firestore/interfaces';
import {OrderByDirection} from '@angular/fire/firestore';

import {from, map, Observable} from 'rxjs';

import {Repository} from './repository';
import {ConfigList, OrderByConfig} from './config-list.model';

export abstract class FirebaseRepository<ENTITY> implements Repository<ENTITY> {

  private _collectionRef: AngularFirestoreCollection<ENTITY>;

  private _angularFirestore: AngularFirestore;

  constructor(angularFirestore: AngularFirestore) {
    this._angularFirestore = angularFirestore;

    this._collectionRef = this._angularFirestore.collection<ENTITY>(this.getCollectionName());
  }

  public create(entity: ENTITY): Observable<any> {
    return from(this._collectionRef.add(entity))
      .pipe(
        map((docRef: DocumentReference<ENTITY>) => docRef.id)
      );
  }

  public createMany(entityList: ENTITY []): Promise<void> {
    const batch: any = this._angularFirestore.firestore.batch();

    for (const entity of entityList) {
      const docRef: DocumentReference<ENTITY> = this._collectionRef.doc().ref;
      batch.set(docRef, entity);
    }

    return batch.commit();
  }

  public createWithID(id: string, entity: ENTITY): any {
    this._collectionRef.doc(id).set(entity);
  }

  public delete(id: string): Observable<void> {
    return from(
      this._collectionRef.doc(id)
        .delete()
    );
  }

  public getById(id: string): Observable<ENTITY> {
    return this._collectionRef.doc(id)
      .valueChanges({idField: 'id'}) as Observable<ENTITY>;
  }

  public list(): Observable<ENTITY []> {
    return this._collectionRef.valueChanges({idField: 'id'});
  }

  public update(entity: Partial<(ENTITY & { id: string })>, id: string): Observable<void> {
    let entityToDB: any = entity;
    delete entityToDB.id;

    return from(
      this._collectionRef.doc(id)
        .update(entityToDB)
    );
  }

  protected getByAttribute(attribute: string, value: any, configList?: ConfigList): Observable<any> {
    const defaultConfigList: ConfigList = {
      orderByConfigList: configList?.orderByConfigList,
      queryList: [
        {
          field: attribute,
          operation: '==',
          value: value
        }
      ]
    };

    return this.getByQuerys(defaultConfigList);
  }

  public getByQuerys(configList: ConfigList): Observable<any> {
    const queryFn = (ref: CollectionReference<any>) => {
      let query: Query = ref;

      if (configList && configList.queryList) {
        configList.queryList
          .forEach((queryPart: any) => {
            query = query.where(queryPart.field, queryPart.operation, queryPart.value);
          });
      }

      if (configList && configList.orderByConfigList) {
        configList.orderByConfigList
          .forEach((orderByConfig: OrderByConfig) => {
            query = query.orderBy(orderByConfig.field, <OrderByDirection>orderByConfig.direction);
          });
      }

      return query;
    };

    return this._angularFirestore.collection<ENTITY>(this.getCollectionName(), queryFn)
      .valueChanges({idField: 'id'});
  }

  protected abstract getCollectionName(): string;

}
