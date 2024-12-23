import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { AttractionsRepositoryService } from 'src/app/modules/ss-shared/services/attractions.repository-service';
import { ActivatedRoute } from '@angular/router';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { getMenuItemById } from 'src/app/modules/ss-shared/utils/get-side-bar-options.utils';
import { LoaderService } from 'src/app/modules/ss-shared/services/loader.service';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { RestaurantsRepositoryService } from 'src/app/modules/ss-shared/services/restaurants.repository-service';
import { HotelsRepositoryService } from 'src/app/modules/ss-shared/services/hotels.repository-service';
import { FoodsRepositoryService } from 'src/app/modules/ss-shared/services/foods.repository-service';
import { EventsRepositoryService } from 'src/app/modules/ss-shared/services/events.repository-service';

@Component({
  selector: 'items-page',
  templateUrl: './items.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsPage implements OnInit, OnDestroy {

  public itemList: any[] | null;

  private _unsubscribe: Subject<void>;
  public itemsService: any;
  public collectionUIData: any;
  public moduleId: string;

  public userDataModel!: UserDataModel;

  constructor(private _attractionsRepositoryService: AttractionsRepositoryService,
              private _restaurantsRepositoryService: RestaurantsRepositoryService,
              private _hotelsRepositoryService: HotelsRepositoryService,
              private _foodsRepositoryService: FoodsRepositoryService,
              private _eventsRepositoryService: EventsRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _activatedRoute: ActivatedRoute,
              private _loaderService: LoaderService,
              private _cdr: ChangeDetectorRef) {
    this.itemList = null;
    this._unsubscribe = new Subject<void>();
  }

  public ngOnInit(): void {
    this._userDataModelListener();
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private async _getItems(): Promise<void> {
    try {
      this._loaderService.show = true;
  
      if (!this.userDataModel?.entity?.id) {
        console.warn('El ID de la entidad no está disponible.');
        this._loaderService.show = false;
        return;
      }
  
      const configList: ConfigList = this._getConfigList();
  
      const items: any = await firstValueFrom(this.itemsService.getByQuerys(configList));
      this.itemList = items;
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
            field: 'entitiesId',
            operation: 'array-contains-any',
            value: [this.userDataModel.entity.id]
          }
        ]
      };
    } else {
      configList = {};
    };

    return configList;
  }

  private _getParamCollection() {
    this._activatedRoute.params.subscribe((params) => {
      this.moduleId = params['id'];
      this._setCollectionConfig();
    });
  }

  private _setCollectionConfig() {
    this.itemsService = this._getItemsServiceById(this.moduleId);
    this.collectionUIData = this._getCollectionUIData(this.moduleId);
    this.itemList = null;

    this._getItems();
  }

  private _getCollectionUIData(id: string): any {
    return getMenuItemById(id);
  }

  private _getItemsServiceById(id: string): any {
    let service: any;

    switch (id) {
      case 'attractions':
        service = this._attractionsRepositoryService;
        break;
      case 'restaurants':
        service = this._restaurantsRepositoryService;
        break;

      case 'hotels':
        service = this._hotelsRepositoryService;
        break;

      case 'foods':
        service = this._foodsRepositoryService;
        break;

      case 'events':
        service = this._eventsRepositoryService;
        break;
    }

    return service;
  }

  public refreshList(): void {
    this._setCollectionConfig();
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;

          this._getParamCollection();
        }
      });
  }
}
