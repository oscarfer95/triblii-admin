import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'tt-reset-password-form',
  templateUrl: './ss-reset-password-form.component.html'
})
export class SsResetPasswordFormComponent implements OnInit {
  public resetPasswordForm!: FormGroup;

  public email!: string;

  constructor(private _angularFireAuth: AngularFireAuth,
              private _toastService: MessageService,
              private _config: DynamicDialogConfig,
              private _refDialog: DynamicDialogRef,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    if (this._config?.data?.email) {
      this.email = this._config?.data?.email;
    } else {
      this.email = '';
    }

    this.initializedForm();
  }

  public initializedForm(): void {
    this.resetPasswordForm = this._formBuilder.group({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.email
      ])
    });
  }

  public recoverPassword(): void {
    const email: string = this.resetPasswordForm.value.email;

    this._angularFireAuth.sendPasswordResetEmail(email)
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Correo enviado correctamente',
          detail: 'Revise su bandeja de entrada y siga los pasos',
          life: 6000
        });

        this._refDialog.close();
      })
      .catch((reason: any) => {
        let errorMessage = '¡Ups! Algo salió mal, intenta nuevamente.';

        if (reason.code === 'auth/user-not-found') {
          errorMessage = 'El correo electrónico es inválido.';
        }

        this._toastService.add({
          severity: 'error',
          summary: errorMessage,
          detail: '',
          life: 6000
        });
      });
  }
}
