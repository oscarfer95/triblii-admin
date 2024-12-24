import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AUTH_ROUTES} from './auth-router.routes';

@NgModule({
  imports: [RouterModule.forChild(AUTH_ROUTES)],
  exports: [RouterModule]
})
export class AuthRouterModule {
}
