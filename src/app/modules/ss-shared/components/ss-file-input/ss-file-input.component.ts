import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';

import {SsUploadFileService} from './services/ss-upload-file.service';
import {FileInputMode} from './properties/ss-file-input.properties';

@Component({
  selector: 'tt-file-input',
  templateUrl: './ss-file-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SsFileInputComponent implements OnInit, OnDestroy {
  @Input()
  public mode: FileInputMode;
  @Input()
  public label: string;

  @Input()
  public cssClass!: string;

  @Input()
  public acceptedTypes!: string;
  @Input()
  public fileLimit!: number;
  @Input()
  public maxSize!: number;

  @Input()
  public multipleUpload: boolean;
  @Output()
  public uploadedFile: EventEmitter<any>;
  public uploadInProgress: boolean;
  public uploadPercent: number;

  @Output()
  public error: EventEmitter<string>;

  public draggingFiles: boolean;

  private _unsubscribe: Subject<void>;

  constructor(
    @Optional()
    private _ssUploadFilesService: SsUploadFileService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this.uploadedFile = new EventEmitter<any>();
    this.label = '+ Agregar imagen';
    this.error = new EventEmitter<string>();
    this._unsubscribe = new Subject<void>();
    this.acceptedTypes = 'image/*';
    this.uploadInProgress = false;
    this.multipleUpload = false;
    this.draggingFiles = false;
    this.uploadPercent = 0;
    this.mode = 'button';
  }

  public ngOnInit(): void {
    this._uploadPercentListener();
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public onDraggingFiles(dragging: any): void {
    this.draggingFiles = dragging;
  }

  public onDroppedFiles(files: any): void {
    if (this._validLimit(files)) {
      Array.from(files)
        .forEach((file: File) => {
          if (this._validate(file)) {
            this._uploadFile(file);
          }
        });
    }
  }

  public onSelectFiles(event: Event): void {
    const files: FileList = <FileList>(<HTMLInputElement>event.target).files;

    if (this._validLimit(files)) {
      Array.from(files)
        .forEach((file: File) => {
          if (this._validate(file) && this._validLimit(files)) {
            this._uploadFile(file);
          }
        });
    }
  }

  private _uploadFile(file: File): void {
    this._ssUploadFilesService.upload(file)
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((response: any) => {
        this.uploadedFile.emit(response);
      });
  }

  private _uploadPercentListener(): void {
    this._ssUploadFilesService.uploadPercentListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((percent: number) => {
        this.uploadInProgress = true;
        this.uploadPercent = percent;

        if (percent === 100) {
          this.uploadInProgress = false;
        }

        this._changeDetectorRef.markForCheck();
      });
  }

  private _validate(file: File): boolean {
    let valid = true;

    if (this.acceptedTypes && !this._validType(file)) {
      this.error.emit(`El tipo del Archivo ${file.name} es invalido.`);

      return false;
    }

    if (this.maxSize && file.size > this.maxSize) {
      this.error.emit(`El tamaño del Archivo ${file.name} execede el limite establecido.`);

      return false;
    }

    return valid;
  }

  private _validType(file: File): boolean {
    let acceptedTypeList: string [] = this.acceptedTypes.split(',').map(type => type.trim());
    let validType = true;

    let count = 0;
    while (validType && acceptedTypeList.length > count) {
      const acceptedType: string = acceptedTypeList[count];
      const typeWithWildcard: boolean = acceptedType.indexOf('*') !== -1;
      const fileExtension: string = `.${file.name.split('.').pop()}`;

      validType = typeWithWildcard ?
        this._getTypeClass(file.type) === this._getTypeClass(acceptedType) :
        file.type === acceptedType || fileExtension.toLowerCase() === acceptedType.toLowerCase();

      count++;
    }

    return validType;
  }

  private _getTypeClass(fileType: string): string {
    return fileType.substring(0, fileType.indexOf('/'));
  }

  private _validLimit(files: FileList): boolean {
    const valid: boolean = files.length <= this.fileLimit;

    if (!valid) {
      this.error.emit(`La cantidad de Archivos execede el limite establecido.`);
    }

    return valid;
  }
}
