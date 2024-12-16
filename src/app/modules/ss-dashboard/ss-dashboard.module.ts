import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {SidebarModule} from 'primeng/sidebar';

import {SsRouterModule} from './router/ss-router-module';
import {SsDashboardPage} from './pages/ss-dashboard/ss-dashboard.page';
import {SsNavbarComponent} from './components/ss-navbar/ss-navbar.component';
import {SsSidebarComponent} from './components/ss-sidebar/ss-sidebar.component';
import {SsWrapperComponent} from './components/ss-wrapper/ss-wrapper.component';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {SkeletonModule} from 'primeng/skeleton';

@NgModule({
  declarations: [
    SsNavbarComponent,
    SsSidebarComponent,
    SsWrapperComponent,
    SsDashboardPage,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    SsRouterModule,
    SsSharedModule,
    SkeletonModule
  ]
})
export class SsDashboardModule { }
