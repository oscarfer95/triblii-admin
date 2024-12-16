import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {FileUploadModule} from 'primeng/fileupload';
import {SpeedDialModule} from 'primeng/speeddial';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SsRouterModule} from './router/ss-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {SsBannersPage} from './pages/ss-banners/ss-banners.page';
import {SsBannerFormComponent} from './components/ss-banner-form/ss-banner-form.component';
import {SsBannerDetail} from './pages/ss-banner-detail/ss-banner-detail.page';

@NgModule({
  declarations: [
    SsBannersPage,
    SsBannerDetail,
    SsBannerFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SsRouterModule,
    SsSharedModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SpeedDialModule
  ]
})
export class SsBannersModule { }
