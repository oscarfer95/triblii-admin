import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SS_AUTH_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(SS_AUTH_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule {
}
