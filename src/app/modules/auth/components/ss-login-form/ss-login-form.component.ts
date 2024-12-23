import {MessageService} from 'primeng/api';

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../service/ss-auth.service';

@Component({
  selector: 'ss-login-form',
  templateUrl: './ss-login-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SsLoginFormComponent implements OnInit {
  public logInForm!: FormGroup;

  constructor(private _messageService: MessageService,
              private _authService: AuthService,
              private _formBuilder: FormBuilder,
              private _router: Router) { }

  public ngOnInit(): void {
    this._initForm();
  }

  public login(): void {
    const formValue: any = this.logInForm.value;

    this._authService.login(formValue.email, formValue.password)
      .then(() => {
        this._router.navigate(['/dashboard/home']);
      })
      .catch((error: Error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error al iniciar sesión',
          detail: error.message,
          life: 3000
        });
      });
  }

  private _initForm(): void {
    this.logInForm = this._formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.min(3)
      ]]
    });
  }
}
