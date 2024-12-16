import {OverlayPanelModule} from 'primeng/overlaypanel';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SsRouterModule} from './router/ss-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {LocationPageComponent} from './pages/locations-page/locations-page.component';
import {LocationCardComponent} from './components/location-card/location-card.component';
import {LocationFormComponent} from './components/location-form/location-form.component';
import {LocationMapComponent} from './components/location-map/location-map.component';

@NgModule({
  declarations: [
    LocationPageComponent,
    LocationCardComponent,
    LocationFormComponent,
    LocationMapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SsRouterModule,
    SsSharedModule,
    HttpClientModule,
    OverlayPanelModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayPanelModule
  ]
})
export class SsLocationModule { }
