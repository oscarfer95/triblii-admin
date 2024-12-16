import {MessageService} from 'primeng/api';
import {SearchCountryField, CountryISO} from 'ngx-intl-tel-input';

import {EventEmitter, ChangeDetectionStrategy, Component, Input, OnInit, Output, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {SsCatalogueRepositoryService} from 'src/app/modules/ss-shared/services/ss-catalogues.repository-service';
import {ConfigList} from 'src/framework/repository/config-list.model';
import {CategoriesRepositoryService} from 'src/app/modules/ss-shared/services/ss-category.repository-service';
import {SsLoaderService} from 'src/app/modules/ss-shared/services/ss-loader.service';
import { EntitiesRepositoryService } from 'src/app/modules/ss-shared/services/entities.repository-service';

@Component({
  selector: 'ss-catalogue-form',
  templateUrl: './ss-catalogue-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsCatalogueFormComponent implements OnInit {

  @Output()
  saveEvent: EventEmitter<void> = new EventEmitter<void>();

  public form!: FormGroup;

	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;

  @Input()
  public userDataModel!: any;

  constructor(private _entitiesRepositoryService: EntitiesRepositoryService,
              private _loaderService: SsLoaderService,
              private _toastService: MessageService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: new FormControl(this.userDataModel.entity?.name, [Validators.required]),
      description: new FormControl(this.userDataModel.entity?.description, [Validators.required]),
      phone: new FormControl(this.userDataModel.entity?.phone.number, [Validators.required])
    });
  }

  public saveForm(): any {
    this._loaderService.show = true;
    const entity = {...this.form.value};
    // enitity.updatedAt = Date.now(); agregar logs

    return firstValueFrom(this._entitiesRepositoryService.update(entity, this.userDataModel.entity.id)).then(() => {
      this._loaderService.show = false;
      this._toastService.add({
        severity: 'success',
        summary: 'Datos guardados',
        detail: 'La información se editó correctamente',
        life: 6000
      });

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

  public markAsTouched(): void {
    this.form.markAsTouched();
  }
}
