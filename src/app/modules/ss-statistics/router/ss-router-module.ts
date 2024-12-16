import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { SS_STATISTICS_ROUTES } from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(SS_STATISTICS_ROUTES)],
  exports: [RouterModule]
})
export class SsStatisticsRouterModule { }
