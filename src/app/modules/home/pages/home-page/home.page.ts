import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { generateMenuItems } from 'src/app/modules/shared/utils/get-side-bar-options.utils';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy {

  public userDataModel!: UserDataModel | any;
  public data!: any;
  public menuItems: any = null;

  private _unsubscribe: Subject<void>;

  constructor(private _userDataModelService: UserDataModelService,
              private _cdr: ChangeDetectorRef) {
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    }
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _filterList(list: any, idList: any[]) {
    return list.filter((menuItem: any) =>
      idList.some(module => module.id === menuItem.id)
    );
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;
          this.menuItems = this._filterList(generateMenuItems(this.userDataModel.permissions, this.userDataModel.role), MODULES_LIST);

          this._cdr.markForCheck();
        }
      });
  }
}
