import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {StatisticsRouterModule} from './router/statistics-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {StatisticsPage} from './pages/statistics-page/statistics.page';

@NgModule({
  declarations: [
    StatisticsPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    StatisticsRouterModule,
    SsSharedModule
  ]
})
export class StatisticsModule { }
