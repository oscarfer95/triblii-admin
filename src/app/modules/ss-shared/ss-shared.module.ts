import {AccordionModule} from 'primeng/accordion';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {ChipModule} from 'primeng/chip';
import {DividerModule} from 'primeng/divider';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import {MenuModule} from 'primeng/menu';
import {PasswordModule} from 'primeng/password';
import {ProgressBarModule} from 'primeng/progressbar';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {SwiperModule} from 'swiper/angular';
import {SkeletonModule} from 'primeng/skeleton';
import {QRCodeModule} from 'angularx-qrcode';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {SsAnnouncementComponent} from './components/ss-announcement/ss-announcement.component';
import {SsFileInputComponent} from './components/ss-file-input/ss-file-input.component';
import {SsQrComponent} from './components/ss-qr/ss-qr.component';
import {SsDropZoneDirective} from './directives/ss-drop-zone.directive';
import {SsSanitizePipe} from './pipes/ss-sanitize.pipe';

@NgModule({
  declarations: [
    SsAnnouncementComponent,
    SsDropZoneDirective,
    SsFileInputComponent,
    SsQrComponent,
    SsSanitizePipe
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
    ChartModule
  ],
  exports: [
    AccordionModule,
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
    SsAnnouncementComponent,
    SsDropZoneDirective,
    SsFileInputComponent,
    SsQrComponent,
    SwiperModule,
    TableModule,
    TooltipModule
  ],
  providers: [
    SsSanitizePipe
  ]
})
export class SsSharedModule {
}
