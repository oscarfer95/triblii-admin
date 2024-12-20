import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, Input, Type, ViewEncapsulation } from '@angular/core';

import { ResetPasswordFormComponent } from '../reset-password-form/reset-password-form.component';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';

@Component({
  selector: 'danger-zone',
  templateUrl: './danger-zone.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class DangerZoneComponent {
  @Input()
  public userData!: UserDataModel;

  constructor(private _dialogService: DialogService) {
  }

  public openResetPasswordModal(): void {
    const component: Type<any> = ResetPasswordFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        email: this.userData?.email
      },
      styleClass: 'p-dialog-center-content'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
  }
}
