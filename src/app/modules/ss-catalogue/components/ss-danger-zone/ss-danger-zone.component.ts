import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, Input, Type, ViewEncapsulation } from '@angular/core';

import { SsResetPasswordFormComponent } from '../ss-reset-password-form/ss-reset-password-form.component';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';

@Component({
  selector: 'ss-danger-zone',
  templateUrl: './ss-danger-zone.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class SsDangerZoneComponent {
  @Input()
  public userData!: UserDataModel;

  constructor(private _dialogService: DialogService) {
  }

  public openResetPasswordModal(): void {
    const component: Type<any> = SsResetPasswordFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        email: this.userData?.email
      },
      styleClass: 'p-dialog-center-content'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
  }
}
