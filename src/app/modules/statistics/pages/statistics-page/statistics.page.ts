import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { getLogsByAction, getLogsByActionYear, getLogsByMonth, getLogsForCurrentMonth } from 'src/app/modules/shared/utils/get-stadistics.utils';
import { ConfigList } from 'src/framework/repository/config-list.model';

@Component({
  selector: 'statistics-page',
  templateUrl: './statistics.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsPage implements OnInit, OnDestroy {

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;
  public logList: any[];

  public totalLogsByActionData!: any;

  public logsByCurrentMonthData!: any;
  
  public interactionYearData!: any;
  public logsByActionYearData!: any;
  
  constructor(private _userDataModelService: UserDataModelService,
              private _logsRepositoryService: LogsRepositoryService,
    private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._userDataModelListener();
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private async _getLogs(): Promise<void> {
    try {
      const configList: ConfigList = this._getConfigList();

      let logs: any = await firstValueFrom(this._logsRepositoryService.getByQuerys(configList));
      this.logList = logs;

      this._getLogsByMonth(logs);
      this._getTotalLogsByAction(logs);

      this._getLogsByCurrentMonthAction(logs);
      this._getLogsByActionYear(logs);
    } catch (error) {
      console.error('Error al obtener los logs:', error);
    } finally {
      this._cdr.markForCheck();
    }
  }

  private _getConfigList() {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'date',
          direction: 'desc'
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
        if (userDataModel) {
          this.userDataModel = userDataModel;
          this._getLogs();
        }

        this._cdr.markForCheck();
      });
  }

  private _getLogsByMonth(logs: any[]): any {
    this.interactionYearData = getLogsByMonth(logs);
  }

  private _getTotalLogsByAction(logs: any[]): any {
    this.totalLogsByActionData = getLogsByAction(logs);
  }

  private _getLogsByCurrentMonthAction(logs: any[]): any {
    this.logsByCurrentMonthData = getLogsForCurrentMonth(logs);
  }

  private _getLogsByActionYear(logs: any[]): any {
    this.logsByActionYearData = getLogsByActionYear(logs);
  }
}
