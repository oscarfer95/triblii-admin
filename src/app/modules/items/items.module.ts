import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabMenuModule } from 'primeng/tabmenu';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemsRouterModule } from './router/items-router-module';
import { SsSharedModule } from '../ss-shared/ss-shared.module';
import { ItemsPage } from './pages/items-page/items.page';
import { AttractionDetail } from './pages/attraction-detail/attraction-detail.page';
import { GalleryFormComponent } from './components/gallery-form/gallery-form.component';
import { InformationFormComponent } from './components/information-form/information-form.component';
import { OptionsFormComponent } from './components/options-form/options-form.component';
import { ItemsTableComponent } from './components/items-table/items-table.component';
import { LocationCardComponent } from './components/map-form/location-card/location-card.component';
import { LocationFormComponent } from './components/map-form/location-form/location-form.component';
import { LocationMapComponent } from './components/map-form/location-map/location-map.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
import { RestaurantDetail } from './pages/restaurant-detail/restaurant-detail.page';

@NgModule({
  declarations: [
    GalleryFormComponent,
    ItemsPage,
    AttractionDetail,
    RestaurantDetail,
    ItemsTableComponent,
    InformationFormComponent,
    OptionsFormComponent,
    LocationCardComponent,
    LocationFormComponent,
    LocationMapComponent
  ],
  imports: [
    AccordionModule,
    CommonModule,
    RouterModule,
    ItemsRouterModule,
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
    ReactiveFormsModule,
    OverlayPanelModule
  ]
})
export class ItemsModule { }
