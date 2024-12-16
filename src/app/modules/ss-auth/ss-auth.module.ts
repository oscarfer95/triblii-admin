import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SsRouterModule} from './router/ss-router.module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {SsLoginPage} from './pages/ss-login/ss-login.page';
import {SsLoginFormComponent} from './components/ss-login-form/ss-login-form.component';

@NgModule({
  declarations: [
    SsLoginFormComponent,
    SsLoginPage
  ],
  imports: [
    CommonModule,
    SsRouterModule,
    SsSharedModule
  ]
})
export class SsAuthModule {
}
