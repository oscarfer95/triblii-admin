import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from 'primeng/api';

import {UploadFileService} from '../../../shared/components/ss-file-input/services/upload-file.service';
import {UploadFileStorageService} from '../../../shared/services/upload-file-storage.service';

@Component({
  selector: 'gallery-form',
  templateUrl: './gallery-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: UploadFileService,
      useClass: UploadFileStorageService
    }
  ]
})
export class GalleryFormComponent implements OnInit {
  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  public uploadImageUrlList: Set<string>;

  constructor(private _toastService: MessageService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
    this.uploadImageUrlList = new Set<string>();
  }

  ngOnInit(): void {
    this.uploadImageUrlList = new Set<string>(this.item.gallery);
    this._initForm();
  }

  private _initForm(): void {
    this.form.addControl('imageIdList', this._formBuilder.control(this.item.gallery));
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
