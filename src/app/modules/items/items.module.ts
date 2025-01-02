import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemsRouterModule } from './router/items-router-module';
import { SharedModule } from '../shared/shared.module';
import { ItemsPage } from './pages/items-page/items.page';
import { GalleryFormComponent } from './components/gallery-form/gallery-form.component';
import { InformationFormComponent } from './components/information-form/information-form.component';
import { OptionsFormComponent } from './components/options-form/options-form.component';
import { ItemsTableComponent } from './components/items-table/items-table.component';
import { LocationCardComponent } from './components/map-form/location-card/location-card.component';
import { LocationFormComponent } from './components/map-form/location-form/location-form.component';
import { LocationMapComponent } from './components/map-form/location-map/location-map.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
import { ItemDetail } from './pages/item-detail/item-detail.page';
import { FoodsFormComponent } from './components/foods-form/foods-form.component';
import { ScheduleFormComponent } from './components/schedule-form/schedule-form.component';
import { CalendarModule } from 'primeng/calendar';
import { CategoriesPage } from './pages/categories-page/categories-page.page';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { TagsPage } from './pages/tags-page/tags-page.page';
import { TagsTableComponent } from './components/tags-table/tags-table.component';
import { TagFormComponent } from './components/tag-form/tag-form.component';

@NgModule({
  declarations: [
    GalleryFormComponent,
    ItemsPage,
    ItemDetail,
    ItemsTableComponent,
    InformationFormComponent,
    OptionsFormComponent,
    LocationCardComponent,
    LocationFormComponent,
    LocationMapComponent,
    FoodsFormComponent,
    ScheduleFormComponent,
    CategoriesPage,
    CategoriesTableComponent,
    CategoryFormComponent,
    TagsPage,
    TagsTableComponent,
    TagFormComponent
  ],
  imports: [
    AccordionModule,
    CommonModule,
    RouterModule,
    ItemsRouterModule,
    SharedModule,
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
    ReactiveFormsModule,
    OverlayPanelModule,
    CalendarModule,
    DropdownModule
  ]
})
export class ItemsModule { }
