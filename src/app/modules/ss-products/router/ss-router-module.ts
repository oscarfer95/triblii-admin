import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SS_USERS_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(SS_USERS_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule { }
