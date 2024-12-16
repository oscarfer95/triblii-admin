import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {SsStatisticsRouterModule} from './router/ss-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {SsStatisticsPage} from './pages/ss-statistics/ss-statistics.page';

@NgModule({
  declarations: [
    SsStatisticsPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    SsStatisticsRouterModule,
    SsSharedModule
  ]
})
export class SsStatisticsModule { }
