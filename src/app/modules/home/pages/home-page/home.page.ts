import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { getSingularActionLabel, getSingularModuleLabel } from 'src/app/modules/shared/utils/get-label-text.util';
import { generateMenuItems } from 'src/app/modules/shared/utils/get-side-bar-options.utils';
import { getLogsByAction, getLogsByMonth } from 'src/app/modules/shared/utils/get-stadistics.utils';
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
  public items: any[];
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

    this.items = [
      {
        label: 'Lugares',
        icon: 'pi pi-map-marker',
        command: () => {}
      },
      {
        label: 'Restaurantes',
        icon: 'bi bi-shop',
        command: () => {}
      },
      {
        label: 'Hoteles',
        icon: 'pi pi-building',
        command: () => {}
      },
      {
        label: 'Eventos',
        icon: 'pi pi-calendar',
        command: () => {}
      },
      {separator: true},
      {
        label: 'Descargar BD',
        icon: 'pi pi-download',
        command: () => {}
      },
      {
        label: 'Descargar plantilla',
        icon: 'pi pi-file',
        command: () => {}
      }
  ];

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
    return getSingularActionLabel(action);
  }

  public getModuleLabel(action: string): string {
    return getSingularModuleLabel(action);
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

      this.logList = logs.length > 4 ? logs.slice(0, 5) : logs;
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
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;
          this._getLogs();
          this.menuItems = this._filterList(generateMenuItems(this.userDataModel.permissions, this.userDataModel.role), MODULES_LIST);

          this._cdr.markForCheck();
        }
      });
  }

  private _getLogsByMonth(logs: any[]): any {
    this.interactionData = getLogsByMonth(logs);
  }

  private _getLogsByAction(logs: any[]): any {
    this.logByActionData = getLogsByAction(logs);
  }

}
