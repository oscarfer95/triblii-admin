import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {StatisticsRouterModule} from './router/statistics-router-module';
import {SharedModule} from '../shared/shared.module';
import {StatisticsPage} from './pages/statistics-page/statistics.page';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    StatisticsPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    StatisticsRouterModule,
    SharedModule,
    AccordionModule
  ]
})
export class StatisticsModule { }
