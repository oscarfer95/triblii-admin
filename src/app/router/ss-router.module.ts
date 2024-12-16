import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SS_MAIN_ROUTES, SS_ROUTER_CONFIG} from './ss-router.routes';

@NgModule({
  imports: [
    RouterModule.forRoot(SS_MAIN_ROUTES, SS_ROUTER_CONFIG)
  ],
  exports: [
    RouterModule
  ]
})
export class SsRouterModule {
}
