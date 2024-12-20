import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DASHBOARD_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule { }
