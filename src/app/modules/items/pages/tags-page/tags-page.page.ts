import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { getMenuItemById } from 'src/app/modules/shared/utils/get-side-bar-options.utils';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { TagRepositoryService } from 'src/app/modules/shared/services/tag.repository-service';

@Component({
  selector: 'tags-page',
  templateUrl: './tags-page.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsPage implements OnInit, OnDestroy {

  public tagList: any[] | null;

  private _unsubscribe: Subject<void>;
  public collectionUIData: any;

  public userDataModel!: UserDataModel;

  constructor(private _tagsRepositoryService: TagRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _loaderService: LoaderService,
              private _cdr: ChangeDetectorRef) {
    this.tagList = null;
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

      const items: any = await firstValueFrom(this._tagsRepositoryService.list());
      this.tagList = items;
    } catch (error) {
      console.error('Error al obtener los ítems:', error);
    } finally {
      this._cdr.markForCheck();
      this._loaderService.show = false;
    }
  }

  private _setCollectionConfig() {
    this.collectionUIData = this._getCollectionUIData('tags');
    this.tagList = null;

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
