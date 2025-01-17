import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SplitButtonModule} from 'primeng/splitbutton';

import {HomeRouterModule} from './router/home-router-module';
import {SharedModule} from '../shared/shared.module';
import {HomePage} from './pages/home-page/home.page';


@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRouterModule,
    SharedModule,
    SplitButtonModule
  ]
})
export class HomeModule { }
