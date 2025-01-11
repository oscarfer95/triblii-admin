import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarModule } from 'primeng/sidebar';

import { DashboardRouterModule } from './router/dashboard-router-module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion'; 
import { PanelMenuModule } from 'primeng/panelmenu';


@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    WrapperComponent,
    DashboardPage,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    DashboardRouterModule,
    SharedModule,
    SkeletonModule,
    AccordionModule,
    PanelMenuModule
  ]
})
export class DashboardModule { }
