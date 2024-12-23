import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { LoaderService } from 'src/app/modules/ss-shared/services/loader.service';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { ActivatedRoute } from '@angular/router';
import { UsersRepositoryService } from 'src/app/modules/ss-shared/services/users.repository-service';

@Component({
  selector: 'users-page',
  templateUrl: './users.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPage implements OnInit, OnDestroy {

  public userList: any[] | null;

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;

  constructor(private _usersRepositoryService: UsersRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _activatedRoute: ActivatedRoute,
    private _loaderService: LoaderService,
    private _cdr: ChangeDetectorRef) {
    this.userList = null;
    this._unsubscribe = new Subject<void>();
  }

  public ngOnInit(): void {
    this._userDataModelListener();
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public refreshList() {
    this._getUsers();
  }

  private async _getUsers(): Promise<void> {
    try {
      this._loaderService.show = true;

      if (!this.userDataModel?.entity?.id) {
        console.warn('El ID de la entidad no está disponible.');
        this._loaderService.show = false;
        return;
      }

      const configList: ConfigList = this._getConfigList(); 

      const users: any = await firstValueFrom(this._usersRepositoryService.getByQuerys(configList));
      const filteredUsers = users.filter((user: any) => user.id !== this.userDataModel.id);
      this.userList = filteredUsers;
    } catch (error) {
      console.error('Error al obtener los ítems:', error);
    } finally {
      this._cdr.markForCheck();
      this._loaderService.show = false;
    }
  }

  private _getConfigList() {
    let configList: ConfigList;

    if (this.userDataModel.role !== 'SUPERADMIN') {
      configList = {
        queryList: [
          {
            field: 'entityId',
            operation: '==',
            value: this.userDataModel.entity.id
          }
        ]
      };
    } else {
      configList = {};
    };

    return configList;
  }
  
  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;

          this._getUsers();
        }
      });
  }
}
