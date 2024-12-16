import {CardModule} from 'primeng/card';
import {ColorPickerModule} from 'primeng/colorpicker';
import {DividerModule} from 'primeng/divider';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextModule} from 'primeng/inputtext';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {TabMenuModule} from 'primeng/tabmenu';
import {ChipModule} from 'primeng/chip';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {SsCatalogueRouterModule} from './router/ss-router-module';
import {SsSharedModule} from '../ss-shared/ss-shared.module';
import {SsCataloguePage} from './pages/ss-catalogue-page/ss-catalogue-page.page';
import {SsCatalogueFormComponent} from './components/ss-catalogue-form/ss-catalogue-form.component';
import {SsColorPickerComponent} from './components/ss-color-picker/ss-color-picker.component';
import {SsDangerZoneComponent} from './components/ss-danger-zone/ss-danger-zone.component';
import {SsResetPasswordFormComponent} from './components/ss-reset-password-form/ss-reset-password-form.component';
import {SsSocialNetworkFormComponent} from './components/ss-social-network-form/ss-social-network-form.component';
import {SsCustomSettingsFormComponent} from './components/ss-custom-settings-form/ss-custom-settings-form.component';

@NgModule({
  declarations: [
    SsCataloguePage,
    SsDangerZoneComponent,
    SsColorPickerComponent,
    SsCatalogueFormComponent,
    SsResetPasswordFormComponent,
    SsSocialNetworkFormComponent,
    SsCustomSettingsFormComponent
  ],
  imports: [
    CommonModule,
    SsCatalogueRouterModule,
    CardModule,
    DividerModule,
    TabMenuModule,
    ColorPickerModule,
    FormsModule,
    InputTextModule,
    InputSwitchModule,
    ReactiveFormsModule,
    MultiSelectModule,
    NgxIntlTelInputModule,
    SsSharedModule,
    FileUploadModule,
    HttpClientModule,
    ChipModule
  ]
})
export class SsCatalogueModule { }
