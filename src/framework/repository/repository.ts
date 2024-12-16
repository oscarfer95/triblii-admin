import {Observable} from 'rxjs';

export interface Repository<BASE_ENTITY> {

  create(entity: BASE_ENTITY): Observable<void>;

  delete(id: string): Observable<void>;

  getById(id: string): Observable<BASE_ENTITY>;

  list(): Observable<BASE_ENTITY []>;

  update(entity: BASE_ENTITY, id: string): Observable<void>;

}
