import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';

import {SsUserDataModel} from 'src/app/modules/ss-shared/models/ss-user-data-model.model';
import {SsUserDataModelService} from 'src/app/modules/ss-auth/storage/ss-user-data-model.service';

@Component({
  selector: 'ss-statistics-page',
  templateUrl: './ss-statistics.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsStatisticsPage implements OnInit, OnDestroy {

  private _unsubscribe: Subject<void>;

  public userDataModel!: SsUserDataModel;
  public data: any;

  constructor(private _userDataModelService: SsUserDataModelService,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._userDataModelListener();

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40]
          }
      ]
  }
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: SsUserDataModel) => {
        if (userDataModel) {
          this.userDataModel = userDataModel;
        }

        this._cdr.markForCheck();
      });
  }
}
