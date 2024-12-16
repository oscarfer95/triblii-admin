import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SS_BANNER_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(SS_BANNER_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule { }
