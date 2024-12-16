import {CardModule} from 'primeng/card';
import {EditorModule} from 'primeng/editor';
import {FileUploadModule} from 'primeng/fileupload';
import {ImageModule} from 'primeng/image';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';
import {TabMenuModule} from 'primeng/tabmenu';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SsRouterModule} from './router/ss-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {ItemsPage} from './pages/ss-products/items.page';
import {SsProductDetail} from './pages/ss-product-detail/ss-product-detail.page';
import {SsGalleryFormComponent} from './components/ss-gallery-form/ss-gallery-form.component';
import {SsInformationFormComponent} from './components/ss-information-form/ss-information-form.component';
import {SsOptionsFormComponent} from './components/ss-options-form/ss-options-form.component';
import {SsProductsTableComponent} from './components/ss-products-table/items-table.component';

@NgModule({
  declarations: [
    SsGalleryFormComponent,
    ItemsPage,
    SsProductDetail,
    SsProductsTableComponent,
    SsInformationFormComponent,
    SsOptionsFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SsRouterModule,
    SsSharedModule,
    TabMenuModule,
    CardModule,
    EditorModule,
    ImageModule,
    InputTextModule,
    InputNumberModule,
    FileUploadModule,
    HttpClientModule,
    InputSwitchModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SsProductsModule { }
