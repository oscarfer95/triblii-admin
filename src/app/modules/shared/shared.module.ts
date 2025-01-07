import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SwiperModule } from 'swiper/angular';
import { SkeletonModule } from 'primeng/skeleton';
import { QRCodeModule } from 'angularx-qrcode';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AnnouncementComponent } from './components/announcement/announcement.component';
import { FileInputComponent } from './components/ss-file-input/file-input.component';
import { QrComponent } from './components/qr/qr.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { CountryFormComponent } from './components/country-form/country-form.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  declarations: [
    AnnouncementComponent,
    DropZoneDirective,
    FileInputComponent,
    QrComponent,
    SanitizePipe,
    CountryFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProgressBarModule,
    QRCodeModule,
    ReactiveFormsModule,
    SwiperModule,
    SkeletonModule,
    TooltipModule,
    ChartModule,
    MultiSelectModule,
    SelectButtonModule
  ],
  exports: [
    ButtonModule,
    CardModule,
    ChartModule,
    ChipModule,
    DividerModule,
    DynamicDialogModule,
    InputTextareaModule,
    InputTextModule,
    MenuModule,
    PasswordModule,
    ReactiveFormsModule,
    SkeletonModule,
    AnnouncementComponent,
    DropZoneDirective,
    FileInputComponent,
    QrComponent,
    SwiperModule,
    TableModule,
    TooltipModule,
    CountryFormComponent,
    SelectButtonModule
  ],
  providers: [
    SanitizePipe
  ]
})
export class SharedModule {
}
