import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { UsersRepositoryService } from 'src/app/modules/shared/services/users.repository-service';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';

@Component({
  selector: 'logs-page',
  templateUrl: './logs-page.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsPage implements OnInit, OnDestroy {

  public logList: any[] | null;

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;

  constructor(private _logsRepositoryService: LogsRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _loaderService: LoaderService,
    private _cdr: ChangeDetectorRef) {
    this.logList = null;
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
    this._getLogs();
  }

  private async _getLogs(): Promise<void> {
    try {
      this._loaderService.show = true;

      const configList: ConfigList = this._getConfigList();

      const logs: any = await firstValueFrom(this._logsRepositoryService.getByQuerys(configList));
      this.logList = logs;
    } catch (error) {
      console.error('Error al obtener los logs:', error);
    } finally {
      this._cdr.markForCheck();
      this._loaderService.show = false;
    }
  }

  private _getConfigList() {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'date',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'userId',
          operation: '==',
          value: this.userDataModel.id
        }
      ]
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

          this._getLogs();
        }
      });
  }
}
