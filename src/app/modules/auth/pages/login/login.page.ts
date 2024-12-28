import {ChangeDetectionStrategy, Component, Type, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService , DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {firstValueFrom} from 'rxjs';
import {ResetPasswordFormComponent} from 'src/app/modules/account/components/reset-password-form/reset-password-form.component';

import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService]
})
export class LoginPage implements OnInit {

  public images: any[];

  constructor(private _authService: AuthService,
              private _dialogService: DialogService,
              private _router: Router) {
    this.images = [
      {
        src: 'https://images.pexels.com/photos/68704/pexels-photo-68704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ];
  }

  public ngOnInit(): void {
    this._redirectIfUserIsAuthenticated();
  }

  public openResetPasswordModal(): void {
    const component: Type<any> = ResetPasswordFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        email: ''
      },
      styleClass: 'p-dialog-center-content'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
  }

  private _redirectIfUserIsAuthenticated(): void {
    firstValueFrom(this._authService.getAuth())
      .then((isAuth: boolean) => {
        if (isAuth) {
          this._router.navigate(['/dashboard']);
        }
      });
  }
}
