import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AccountRouterModule } from './router/account-router-module';
import { AccountPage } from './pages/account-page/account.page';
import { SharedModule } from '../shared/shared.module';
import { EntityFormComponent } from './components/entity-form/entity-form.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DangerZoneComponent } from './components/danger-zone/danger-zone.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';
import { EntitySettingsFormComponent } from './components/entity-settings-form/entity-settings-form.component';
import { UsersPage } from './pages/users-page/users.page';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserDetail } from './pages/user-detail/user-detail.page';
import { UserFormComponent } from './components/user-form/user-form.component';
import { EntitiesPage } from './pages/entities-page/entities-page.page';
import { EntitiesTableComponent } from './components/entities-table/entities-table.component';
import { AdminEntityFormComponent } from './components/admin-entity-form/admin-entity-form.component';
import { LogsPage } from './pages/logs-page/logs-page.page';
import { LogsTableComponent } from './components/logs-table/logs-table.component';

@NgModule({
  declarations: [
    AccountPage,
    DangerZoneComponent,
    ColorPickerComponent,
    EntityFormComponent,
    ResetPasswordFormComponent,
    EntitySettingsFormComponent,
    UsersPage,
    UsersTableComponent,
    UserDetail,
    UserFormComponent,
    EntitiesPage,
    EntitiesTableComponent,
    AdminEntityFormComponent,
    LogsPage,
    LogsTableComponent
  ],
  imports: [
    AccordionModule,
    CommonModule,
    AccountRouterModule,
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
    SharedModule,
    FileUploadModule,
    HttpClientModule,
    ChipModule,
    DropdownModule
  ]
})
export class AccountModule { }
