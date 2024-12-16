import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {SsHomeRouterModule} from './router/ss-home-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {SsHomePage} from './pages/ss-home-page/ss-home.page';


@NgModule({
  declarations: [
    SsHomePage
  ],
  imports: [
    CommonModule,
    RouterModule,
    SsHomeRouterModule,
    SsSharedModule
  ]
})
export class SsHomeModule { }
