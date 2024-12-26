import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { EntitiesRepositoryService } from 'src/app/modules/shared/services/entities.repository-service';

@Component({
  selector: 'entities-page',
  templateUrl: './entities-page.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitiesPage implements OnInit, OnDestroy {

  public entityList: any[] | null;

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;

  constructor(private _entitiesRepositoryService: EntitiesRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _loaderService: LoaderService,
    private _cdr: ChangeDetectorRef) {
    this.entityList = null;
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
    this._getEntities();
  }

  private async _getEntities(): Promise<void> {
    try {
      this._loaderService.show = true;

      const entities: any = await firstValueFrom(this._entitiesRepositoryService.list());
      this.entityList = entities;
    } catch (error) {
      console.error('Error al obtener los ítems:', error);
    } finally {
      this._cdr.markForCheck();
      this._loaderService.show = false;
    }
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;

          this._getEntities();
        }
      });
  }
}
