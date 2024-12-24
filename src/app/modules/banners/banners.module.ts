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

import { BannerRouterModule } from './router/banners-router-module';
import { SharedModule } from '../shared/shared.module';
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
    BannerRouterModule,
    SharedModule,
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
