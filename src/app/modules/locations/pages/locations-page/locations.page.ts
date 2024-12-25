import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { LocationService } from 'src/app/modules/shared/services/location.repository-service';

@Component({
  selector: 'locations-page',
  templateUrl: './locations.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsPage implements OnInit, OnDestroy {

  public locationList: any[] | null;

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;

  constructor(private _locationsRepositoryService: LocationService,
    private _userDataModelService: UserDataModelService,
    private _loaderService: LoaderService,
    private _cdr: ChangeDetectorRef) {
    this.locationList = null;
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
    this._getLocations();
  }

  private async _getLocations(): Promise<void> {
    try {
      this._loaderService.show = true;

      const locations: any = await firstValueFrom(this._locationsRepositoryService.list());
      this.locationList = locations;
    } catch (error) {
      console.error('Error al obtener los locaciones:', error);
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

          this._getLocations();
        }
      });
  }
}
