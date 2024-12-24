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

import { SharedModule } from '../shared/shared.module';
import { LocationsPage } from './pages/locations-page/locations.page';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { LocationRouterModule } from './router/location-router-module';

@NgModule({
  declarations: [
    LocationsPage,
    UsersTableComponent,
    UserFormComponent
  ],
  imports: [
    AccordionModule,
    CommonModule,
    LocationRouterModule,
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
export class LocationsModule { }
