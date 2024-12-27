import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { generateMenuItems } from 'src/app/modules/shared/utils/get-side-bar-options.utils';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy {

  public userDataModel!: UserDataModel | any;
  public interactionData!: any;
  public logByActionData!: any;
  public menuItems: any = null;
  public logList: any[] | null;
  public swiperConfig: SwiperOptions;

  private _unsubscribe: Subject<void>;

  constructor(private _logsRepositoryService: LogsRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this.interactionData = null;
    this.logByActionData = null;
    this.swiperConfig = {
      slidesPerView: 1,
      navigation: false,
      scrollbar: { draggable: true },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      pagination: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: true
      }
    };
    
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public toDDMMAAAA(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public getHour(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  public getActionLabel(action: string): string {
    let label = '';

    switch (action) {
      case 'CREATE':
        label = 'Creada'
        break;
      case 'READ':
        label = 'Vista'
        break;
      case 'UPDATE':
        label = 'Actualizada'
        break;
      case 'DELETE':
        label = 'Eliminada'
        break;
    }

    return label;
  }

  public getModuleLabel(module: string): string {
    let label = '';

    switch (module) {
      case 'attractions':
        label = 'Atracción'
        break;

      case 'restaurants':
        label = 'Restaurante'
        break;

      case 'hotels':
        label = 'Hotel'
        break;
        
      case 'foods':
        label = 'Comida'
        break;

      case 'events':
        label = 'Evento'
        break;

      case 'banners':
        label = 'Banner'
        break;
    }

    return label;
  }

  private _filterList(list: any, idList: any[]) {
    return list.filter((menuItem: any) =>
      idList.some(module => module.id === menuItem.id)
    );
  }

  private async _getLogs(): Promise<void> {
    try {
      const configList: ConfigList = this._getConfigList();

      let logs: any = await firstValueFrom(this._logsRepositoryService.getByQuerys(configList));
      this._getLogsByMonth(logs);
      this._getLogsByAction(logs);

      this.logList = logs.length > 3? logs.slice(0, 3): logs;
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
          this.menuItems = this._filterList(generateMenuItems(this.userDataModel.permissions, this.userDataModel.role), MODULES_LIST);

          this._cdr.markForCheck();
        }
      });
  }

  private _getLogsByMonth(logs: any[]): any {
    const currentYear = new Date().getFullYear();
    const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre'];
    const counts = new Array(12).fill(0);
  
    logs.forEach(log => {
      const logDate = new Date(log.date.seconds * 1000 + log.date.nanoseconds / 1000000);

      if (logDate.getFullYear() === currentYear) {
        const month = logDate.getMonth();
        counts[month]++;
      }
    });
  
    this.interactionData = {
      labels,
      datasets: [
        {
          label: 'Interacciones por mes',
          data: counts
        }
      ]
    };
  }
  
  private _getLogsByAction(logs: any[]): any {
    const actionCounts: { [key: string]: number } = {};
  
    logs.forEach(log => {
      const action = log.action;
      if (action) {
        actionCounts[action] = (actionCounts[action] || 0) + 1;
      }
    });
  
    this.logByActionData = {
      labels: Object.keys(actionCounts),
      datasets: [
        {
          label: 'Cantidad de acciones',
          data: Object.values(actionCounts)
        }
      ]
    };
  }
  
}
