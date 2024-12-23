import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { SpeedDialModule } from 'primeng/speeddial';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SsRouterModule } from './router/banners-router-module';
import { SsSharedModule } from '../ss-shared/ss-shared.module';
import { BannerFormComponent } from './components/banner-form/banner-form.component';
import { BannerDetail } from './pages/banner-detail/banner-detail.page';
import { BannersPage } from './pages/banners/banners.page';
import { BannerCardComponent } from './components/banner-card/banner-card.component';

@NgModule({
  declarations: [
    BannersPage,
    BannerDetail,
    BannerFormComponent,
    BannerCardComponent
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
export class BannersModule { }
