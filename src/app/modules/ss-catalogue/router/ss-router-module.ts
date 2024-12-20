import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ACCOUNT_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(ACCOUNT_ROUTES)],
  exports: [RouterModule]
})
export class AccountRouterModule { }
