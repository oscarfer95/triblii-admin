import {MessageService} from 'primeng/api';
import {SearchCountryField, CountryISO} from 'ngx-intl-tel-input';

import {EventEmitter, ChangeDetectionStrategy, Component, Input, OnInit, Output, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {LoaderService} from 'src/app/modules/shared/services/loader.service';
import { EntitiesRepositoryService } from 'src/app/modules/shared/services/entities.repository-service';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';

@Component({
  selector: 'entity-settings-form',
  templateUrl: './entity-settings-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntitySettingsFormComponent implements OnInit {

  @Output()
  saveEvent: EventEmitter<void> = new EventEmitter<void>();

  public form!: FormGroup;
  public isSlugAvailable: boolean;
  public slugMessage: any;

	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;

  @Input()
  public userDataModel!: any;

  constructor(private _entitiesService: EntitiesRepositoryService,
              private _logsRepositoryService: LogsRepositoryService,
              private _loaderService: LoaderService,
              private _toastService: MessageService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
    this.isSlugAvailable = true;
  }

  ngOnInit(): void {
    this.isSlugAvailable = true;

    this.form = this._formBuilder.group({
      slug: new FormControl(this.userDataModel.entity?.slug, [Validators.required, Validators.pattern('[a-z0-9_-]*'), Validators.minLength(3)]),
      color: new FormControl(this.userDataModel.entity?.color, [Validators.required]),
      isPublic: new FormControl(this.userDataModel.entity?.isPublic, [Validators.required])
    });
  }

  public saveForm(): any {
    this._loaderService.show = true;
    const entity = {...this.form.value};

    return firstValueFrom(this._entitiesService.update(entity, this.userDataModel.entity.id)).then(() => {
      this._loaderService.show = false;
      this._toastService.add({
        severity: 'success',
        summary: 'Datos guardados',
        detail: 'La información se editó correctamente',
        life: 6000
      });

      let log = getLog(this.userDataModel.entity.id, 'UPDATE', 'entities', this.userDataModel.id);
      this._logsRepositoryService.create({...log});
      this.saveEvent.emit();

    }).catch((error: any) => {
      this._toastService.add({
        severity: 'error',
        summary: 'Error al editar',
        detail: 'Ocurrio un error al guardar la información.',
        life: 6000
      });
      this._loaderService.show = false;
      console.error(error);
    });
  }

  public changeColor(color: any): void {
    this.form.get('color')?.setValue(color);
    this.form.markAsTouched();
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  // public validadeAvailableSlug(): void {

  //   const configList: ConfigList = {
  //     queryList: [
  //       {
  //         field: 'slug',
  //         operation: '==',
  //         value: this.form.get('slug')?.value
  //       }
  //     ]
  //   }

  //   if (this.userDataModel.entity?.slug !== this.form.get('slug')?.value) {
  //     firstValueFrom(this._entitiesService.getByQuerys(configList))
  //     .then((entities: any) => {

  //       if (entities.length > 0 && entities[0].slug === this.form.get('slug')?.value) {
  //         this.isSlugAvailable = false;
  //         this.form.get('slug')?.setValue('');

  //         this._cdr.markForCheck();

  //         throw 'already existing slug'
  //       }

  //       this.isSlugAvailable = true;
  //       this._cdr.markForCheck();
  //     }).catch(error => {
  //       console.error(error);
  //     })
  //   }
  // }
}
