import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from 'primeng/api';

import {SsUploadFileService} from '../../../ss-shared/components/ss-file-input/services/ss-upload-file.service';
import {SsUploadFileStorageService} from '../../../ss-shared/services/ss-upload-file-storage.service';

@Component({
  selector: 'ss-gallery-form',
  templateUrl: './ss-gallery-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SsUploadFileService,
      useClass: SsUploadFileStorageService
    }
  ]
})
export class SsGalleryFormComponent implements OnInit {
  @Input()
  public form!: FormGroup;

  @Input()
  public product!: any;

  public uploadImageUrlList: Set<string>;

  constructor(private _toastService: MessageService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
    this.uploadImageUrlList = new Set<string>();
  }

  ngOnInit(): void {
    this.uploadImageUrlList = new Set<string>(this.product.gallery);
    this._initForm();
  }

  private _initForm(): void {
    this.form.addControl('imageIdList', this._formBuilder.control(this.product.gallery));
    this.form.addControl('removedImageIdList', this._formBuilder.control([]));
  }

  public showErrorMessage(message: string): void {
    this._toastService.add({
      detail: message,
      severity: 'error',
      sticky: true,
      summary: 'Error al subir el archivo'
    });
  }

  public addImageFileUrl(imageUrl: string): void {
    this.uploadImageUrlList.add(imageUrl);

    this.form
      .get('imageIdList')
      ?.patchValue([...this.uploadImageUrlList.values()]);

    this.form.markAsDirty();
  }

  public removeImageUrl(imageUrl: string): void {
    this.uploadImageUrlList.delete(imageUrl);

    this.form
      .get('imageIdList')
      ?.patchValue([...this.uploadImageUrlList.values()]);

    this.form
      .get('removedImageIdList')
      ?.value
      .push(imageUrl);

    this.form.markAsDirty();
  }
}
