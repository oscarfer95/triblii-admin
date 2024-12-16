import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { AttractionsRepositoryService } from 'src/app/modules/ss-shared/services/ss-products.repository-service';
import { ActivatedRoute } from '@angular/router';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/ss-auth/storage/user-data-model.service';
import { getMenuItemById } from 'src/app/modules/ss-shared/utils/get-side-bar-options.utils';
import { SsLoaderService } from 'src/app/modules/ss-shared/services/ss-loader.service';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { RestaurantsRepositoryService } from 'src/app/modules/ss-shared/services/restaurants.repository-service';

@Component({
  selector: 'items-page',
  templateUrl: './items.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsPage implements OnInit, OnDestroy {

  public itemList: any[] | null;

  private _unsubscribe: Subject<void>;
  private _itemsService: any;
  public collectionUIData: any;
  public moduleId: string;

  public userDataModel!: UserDataModel;

  constructor(private _attractionsRepositoryService: AttractionsRepositoryService,
              private _restaurantsRepositoryService: RestaurantsRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _activatedRoute: ActivatedRoute,
    private _loaderService: SsLoaderService,
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

  private _getItems(): void {
    this._loaderService.show = true;

    const configList: ConfigList = {
      queryList: [
        {
          field: 'entitiesId',
          operation: 'array-contains-any',
          value: [this.userDataModel.entity.id]
        }
      ]
    };

    if (this.userDataModel.entity.id) {
      firstValueFrom(this._itemsService.getByQuerys(configList))
        .then((items: any[]) => {
          this.itemList = items;

          this._cdr.markForCheck();
          this._loaderService.show = false;
        });
    }
  }

  private _getParamCollection() {
    this._activatedRoute.params.subscribe((params) => {
      this.moduleId = params['id'];
      this._setCollectionConfig();
    });
  }

  private _setCollectionConfig() {
    this._itemsService = this._getItemsServiceByParam(this.moduleId);
    this.collectionUIData = this._getCollectionUIData(this.moduleId);
    this.itemList = null;

    this._getItems();
  }

  private _getCollectionUIData(id: string): any {
    return getMenuItemById(id);
  }

  private _getItemsServiceByParam(id: string): any {
    let service: any;

    switch (id) {
      case 'attractions':
        service = this._attractionsRepositoryService;
        break;
      case 'restaurants':
        service = this._restaurantsRepositoryService;
        break;

      case 'hotels':
        service = this._attractionsRepositoryService;
        break;

      case 'foods':
        service = this._attractionsRepositoryService;
        break;

      case 'events':
        service = this._attractionsRepositoryService;
        break;
    }

    return service;
  }

  public refreshList(): void {
    this._getItems();
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

        this._cdr.markForCheck();
      });
  }
}
