import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {LoaderService} from 'src/app/modules/ss-shared/services/loader.service';
import {UploadFileStorageService} from 'src/app/modules/ss-shared/services/upload-file-storage.service';

@Component({
  selector: 'information-form',
  templateUrl: './information-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationFormComponent implements OnInit, OnDestroy {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  constructor(private _ssUploadFileStorageService: UploadFileStorageService,
              private _loaderService: LoaderService,
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
    this.form?.addControl('name', this._formBuilder.control(this.item.name, [Validators.required, Validators.min(1), Validators.max(40)]));
    this.form?.addControl('description', this._formBuilder.control(this.item.description, [Validators.required, Validators.min(1), Validators.max(200)]));
    this.form?.addControl('content', this._formBuilder.control(this.item.content));
    this.form?.addControl('coverUrl', this._formBuilder.control(this.item.coverUrl));
  }
}
