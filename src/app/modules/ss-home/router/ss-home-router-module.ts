import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SS_HOME_ROUTES} from './ss-home-router.routes';

@NgModule({
  imports: [RouterModule.forChild(SS_HOME_ROUTES)],
  exports: [RouterModule]
})
export class SsHomeRouterModule { }
