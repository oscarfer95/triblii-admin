import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';

import {AuthService} from '../../../auth/service/auth.service';
import {UserDataModelService} from 'src/app/modules/auth/storage/user-data-model.service';
import {UserDataModel} from 'src/app/modules/shared/models/user-data-model.model';
import {generateMenuItems} from '../../../shared/utils/get-side-bar-options.utils';
import { ADMIN_MODULES_LIST, MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Output()
  public clickMenuButton!: EventEmitter<void>;

  public userDataModel: UserDataModel | null = null;
  public menuItems: any = null;
  public modules = MODULES_LIST;
  public adminModules = ADMIN_MODULES_LIST;

  private _unsubscribe: Subject<void>;

  constructor(private _userDataModelService: UserDataModelService,
              private _authService: AuthService,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this.clickMenuButton = new EventEmitter();
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public onClickMenuButton(): void {
    this.clickMenuButton.emit();
  }

  public logout(): void {
    this._authService.logout()
      .then(() => {
        this._router.navigate(['/public/login']);
      });
  }

  public openHelpDesk(): void {
    const numbers = ["59179722988", "59179713891"];
    const random = Math.floor(Math.random() * numbers.length);

    const whatsAppBaseUrl = 'https://api.whatsapp.com';
    const numberUrl = '/send?phone=' + numbers[random];
    const messageUrl ='&text=';
    const message = 'Hola 👋, necesito ayuda con la plataforma de ShoppyStore';

    window.open(whatsAppBaseUrl + numberUrl + messageUrl + encodeURIComponent(message));
  }

  public isModuleIdInList(searchId: string): boolean {
    return MODULES_LIST.some(module => module.id === searchId);
  }

  public isModuleIdInAdminList(searchId: string): boolean {
    return ADMIN_MODULES_LIST.some(module => module.id === searchId);
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;
          this.menuItems = generateMenuItems(this.userDataModel.permissions, this.userDataModel.role);
        }

        this._cdr.markForCheck();
      });
  }
}
