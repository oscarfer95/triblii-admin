import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MAIN_ROUTES, ROUTER_CONFIG} from './router.routes';

@NgModule({
  imports: [
    RouterModule.forRoot(MAIN_ROUTES, ROUTER_CONFIG)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule {
}
