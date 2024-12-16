import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ConfigList } from 'src/framework/repository/config-list.model';
import { SsUserDataModel } from 'src/app/modules/ss-shared/models/ss-user-data-model.model';
import { SsUserDataModelService } from 'src/app/modules/ss-auth/storage/ss-user-data-model.service';
import { LocationService } from 'src/app/modules/ss-shared/services/ss-location.repository-service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocationFormComponent } from '../../components/location-form/location-form.component';
import { SsLoaderService } from 'src/app/modules/ss-shared/services/ss-loader.service';

@Component({
  selector: 'app-locations-page',
  templateUrl: './locations-page.component.html',
  providers: [DialogService]
})
export class LocationPageComponent implements OnInit, OnDestroy {

  public locationList: any = null;
  public storeId: any = null;
  public userDataModel!: SsUserDataModel;

  private _ref: DynamicDialogRef | undefined;
  private _unsubscribe: Subject<void>;

  constructor(private _userDataModelService: SsUserDataModelService,
              private _loaderService: SsLoaderService,
              private _locationService: LocationService,
              private _dialogService: DialogService,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public async openDetailModal() {
    this._ref = this._dialogService.open(
      LocationFormComponent,
      {
        header: 'Nueva dirección'
      }
    );

    this._ref.onClose.subscribe((data: any) => {
      if (data) {
        this._createLocation(data);
      }
    });
  }

  private _createLocation(data: any): void {
    this._loaderService.show = true;
    data.accountId = this.storeId;

    try {
      this._locationService.create(data).subscribe(() => {
        this._loaderService.show = false;
      });
    } catch (error) {
      this._loaderService.show = false;
    }
  }

  private _getLocations() {

    const configList: ConfigList = {
      queryList: [
        {
          field: 'accountId',
          operation: '==',
          value: this.storeId
        }
      ]
    };

    this._locationService.getByQuery(configList).subscribe(async (list: any) => {
      this.locationList = list;
      this._cdr.detectChanges();
    })
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: SsUserDataModel) => {
        if (userDataModel?.account?.id) {
          this.storeId = userDataModel?.catalogueList[0]?.id;
          this.userDataModel = userDataModel;

          this._getLocations();
        }
        this._cdr.markForCheck();
      });
  }
}
