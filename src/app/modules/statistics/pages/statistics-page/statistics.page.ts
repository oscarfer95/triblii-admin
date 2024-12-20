import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';

@Component({
  selector: 'statistics-page',
  templateUrl: './statistics.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsPage implements OnInit, OnDestroy {

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;
  public data: any;

  constructor(private _userDataModelService: UserDataModelService,
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
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel) {
          this.userDataModel = userDataModel;
        }

        this._cdr.markForCheck();
      });
  }
}
