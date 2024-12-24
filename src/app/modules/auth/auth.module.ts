import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AuthRouterModule} from './router/auth-router.module';
import {SharedModule} from '../shared/shared.module';
import {LoginPage} from './pages/login/login.page';
import {LoginFormComponent} from './components/login-form/login-form.component';

@NgModule({
  declarations: [
    LoginFormComponent,
    LoginPage
  ],
  imports: [
    CommonModule,
    AuthRouterModule,
    SharedModule
  ]
})
export class AuthModule {
}
