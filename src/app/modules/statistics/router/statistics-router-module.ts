import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { STATISTICS_ROUTES } from './statistics-router.routes';

@NgModule({
  imports: [RouterModule.forChild(STATISTICS_ROUTES)],
  exports: [RouterModule]
})
export class StatisticsRouterModule { }
