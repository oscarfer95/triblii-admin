import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SS_LOCATION_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(SS_LOCATION_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule { }
