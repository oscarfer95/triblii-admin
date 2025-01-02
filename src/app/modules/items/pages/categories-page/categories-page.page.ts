import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { getMenuItemById } from 'src/app/modules/shared/utils/get-side-bar-options.utils';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { CategoriesRepositoryService } from 'src/app/modules/shared/services/category.repository-service';

@Component({
  selector: 'categories-page',
  templateUrl: './categories-page.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesPage implements OnInit, OnDestroy {

  public categoryList: any[] | null;

  private _unsubscribe: Subject<void>;
  public collectionUIData: any;

  public userDataModel!: UserDataModel;

  constructor(private _categoriesRepositoryService: CategoriesRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _loaderService: LoaderService,
              private _cdr: ChangeDetectorRef) {
    this.categoryList = null;
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

      const items: any = await firstValueFrom(this._categoriesRepositoryService.list());
      this.categoryList = items;
    } catch (error) {
      console.error('Error al obtener los ítems:', error);
    } finally {
      this._cdr.markForCheck();
      this._loaderService.show = false;
    }
  }

  private _setCollectionConfig() {
    this.collectionUIData = this._getCollectionUIData('categories');
    this.categoryList = null;

    this._getItems();
  }

  private _getCollectionUIData(id: string): any {
    return getMenuItemById(id);
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

          this._setCollectionConfig();
        }
      });
  }
}
