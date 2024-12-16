import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TT_DASHBOARD_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(TT_DASHBOARD_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule { }
