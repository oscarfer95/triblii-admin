import {AngularFireAuth} from '@angular/fire/compat/auth';

import {AsyncSubject, firstValueFrom, Observable} from 'rxjs';
import {Injectable} from '@angular/core';

import {UserDataModel} from '../../ss-shared/models/user-data-model.model';
import {UsersRepositoryService} from '../../ss-shared/services/users.repository-service';
import {EntitiesRepositoryService} from '../../ss-shared/services/entities.repository-service';
import {UserDataModelService} from '../storage/user-data-model.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth: AsyncSubject<boolean>;

  constructor(private _entityRepositoryService: EntitiesRepositoryService,
              private _usersRepositoryService: UsersRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _angularFireAuth: AngularFireAuth) {
    this._auth = new AsyncSubject<boolean>();
    this._initialize();
  }

  private _initialize() {
    this._checkAuthStateListener();
  }

  public getAuth(): Observable<boolean> {
    return this._auth.asObservable();
  }

  public async login(user: string, password: string): Promise<any> {
    return this._angularFireAuth.signInWithEmailAndPassword(user, password)
      .catch((error: any) => {
        throw new Error(this._getAuthErrorMessage(error.code));
      });
  }

  public logout(): Promise<void> {
    this._userDataModelService.userDataModel = new UserDataModel();

    return this._angularFireAuth.signOut();
  }

  private _checkAuthStateListener(): void {
    this._angularFireAuth.authState
      .subscribe((user: any) => {
        if (user) {
          this._getUser(user);

          this._auth.next(true);
          this._auth.complete();
        } else {
          this._auth.next(false);
          this._auth.complete();
        }
      });
  }

  private _getUser(account: any): void {
    firstValueFrom(this._usersRepositoryService.getByAccountId(account.uid))
      .then( async(users: any []) => {
        if (users.length > 0) {
          this._saveUserDataModel(account, users[0]);
        }
      });
  }

  private async _saveUserDataModel(account: any, user: any): Promise<void> {
    try {
      const userData: UserDataModel = new UserDataModel();
      userData.accountId = account.uid;
      userData.email = account.email;

      userData.id = user.id;
      userData.name = user.name;
      userData.role = user.role;
      userData.permissions = user.permissions;
      userData.actions = user.actions;

      const entity = await this._getEntityById(user.entityId);
      userData.entity = entity;

      this._userDataModelService.userDataModel = userData;
    } catch (error) {
      console.error('Error al guardar el UserDataModel:', error);
    }
  }

  private async _getEntityById(entityId: string): Promise<any> {
    try {
      const entity = await firstValueFrom(this._entityRepositoryService.getById(entityId));
      return entity;
    } catch (error) {
      console.error('Error al obtener la entidad:', error);
      throw error;
    }
  }

  private _getAuthErrorMessage(code: string): string {
    switch (code) {
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';

      case 'auth/popup-closed-by-user':
        return 'Debes elegir una cuenta';

      default:
        return 'Usuario no encontrado';
    }
  }
}
