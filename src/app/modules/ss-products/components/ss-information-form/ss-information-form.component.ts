import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {SsLoaderService} from 'src/app/modules/ss-shared/services/ss-loader.service';
import {SsUploadFileStorageService} from 'src/app/modules/ss-shared/services/ss-upload-file-storage.service';

@Component({
  selector: 'ss-information-form',
  templateUrl: './ss-information-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsInformationFormComponent implements OnInit, OnDestroy {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  constructor(private _ssUploadFileStorageService: SsUploadFileStorageService,
              private _loaderService: SsLoaderService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this._initForm();
  }

  ngOnDestroy(): void {
  }

  public uploadPhoto(event: any): void {
    const files: FileList = <FileList>(event.currentFiles);
    const file: File = files[0];

    if (files && files[0]) {
      this._loaderService.show = true;

      firstValueFrom(this._ssUploadFileStorageService.upload(file))
        .then((url: string) => {
          this.item.coverUrl = url;

          this.form
            .get('coverUrl')
            ?.setValue(url);
          this.form.markAsDirty();

          this._cdr.markForCheck();
          this._loaderService.show = false;
        });
    }
  }

  public removeImage(): void {
    this.item.coverUrl = '';

    this.form
      .get('coverUrl')
      ?.setValue('');
    this.form.markAsDirty();
  }

  private _initForm(): void {
    this.form.addControl('name', this._formBuilder.control(this.item.name, [Validators.required, Validators.min(1), Validators.max(40)]));
    this.form.addControl('description', this._formBuilder.control(this.item.description, [Validators.required, Validators.min(1), Validators.max(200)]));
    this.form.addControl('content', this._formBuilder.control(this.item.content));
    this.form.addControl('coverUrl', this._formBuilder.control(this.item.coverUrl));
  }
}
