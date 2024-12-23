import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {UploadFileStorageService} from 'src/app/modules/ss-shared/services/upload-file-storage.service';

@Component({
  selector: 'banner-form',
  templateUrl: './banner-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerFormComponent implements OnInit, OnDestroy {

  @Input()
  public form!: FormGroup;

  @Input()
  public banner!: any;

  constructor(private _ssUploadFileStorageService: UploadFileStorageService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this._initForm();
  }

  ngOnDestroy(): void {
  }

  public uploadPhoto(event: any, field: string): void {
    const files: FileList = <FileList>(event.currentFiles);
    const file: File = files[0];

    if (files && files[0]) {
      // this._loaderService.show = true; //TODO AGREGAR LOADER

      firstValueFrom(this._ssUploadFileStorageService.upload(file))
        .then((url: string) => {
          this._updateImageLink(url, field);
        });
    }
  }

  private _initForm(): void {
    this.form.addControl('backgroundUrl', this._formBuilder.control(this.banner.backgroundUrl || ''));
    this.form.addControl('buttonLabel', this._formBuilder.control(this.banner.buttonLabel || '', [Validators.required, Validators.min(2), Validators.max(200)]));
    this.form.addControl('buttonLink', this._formBuilder.control(this.banner.buttonLink || '', [Validators.required, Validators.minLength(7), Validators.maxLength(200)]));
    this.form.addControl('description', this._formBuilder.control(this.banner.description || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]));
    this.form.addControl('pngUrl', this._formBuilder.control(this.banner.pngUrl || ''));
    this.form.addControl('title', this._formBuilder.control(this.banner.title || '', Validators.required));
  }

  public removeImage(field: string): void {
    this.banner[field] = '';

    this.form
      .get(field)
      ?.setValue('');
  }

  private _updateImageLink(url: string, field: string): void {
    this.banner[field] = url;

    this.form
      .get(field)
      ?.setValue(url);
    this._cdr.markForCheck();
    // this._loaderService.show = true; //TODO AGREGAR LOADER
  }
}
