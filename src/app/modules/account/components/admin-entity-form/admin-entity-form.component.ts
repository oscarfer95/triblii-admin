import { MessageService } from 'primeng/api';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { EntitiesRepositoryService } from 'src/app/modules/shared/services/entities.repository-service';
import { Entity } from 'src/app/modules/shared/models/entity.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfigList } from 'src/framework/repository/config-list.model';
import { LocationService } from 'src/app/modules/shared/services/location.repository-service';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';

@Component({
  selector: 'admin-entity-form',
  templateUrl: './admin-entity-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEntityFormComponent implements OnInit {

  public form!: FormGroup;
  public entity!: any;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public cities: any[] | null;
  public countries: any[] | null;
  public userDataModel!: any;

  constructor(private _entitiesRepositoryService: EntitiesRepositoryService,
    private _logsRepositoryService: LogsRepositoryService,
    private _locationRepositoryService: LocationService,
    private _config: DynamicDialogConfig,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    public _ref: DynamicDialogRef) {
  }

  ngOnInit(): void {
    this._fetchCountries();
    if (this._config?.data.entity) {
      this.entity = this._config?.data.entity;
    } else {
      this.entity = new Entity();
    };
    this.userDataModel = this._config?.data.userDataModel;
    this._initForm();
    this.entity.location.countryIds.length > 0 ? this._fetchCities() : this.cities = [];
    this._setupFormListeners();
  }

  public saveForm(): any {
    this._loaderService.show = true;
    const entity = { ...this.entity, ...this.form.value };

    if (entity.id) {
      delete entity.id;
      this._editItem(entity);
    } else {
      this._createItem(entity);
    }
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  public changeColor(color: any): void {
    this.form.get('color')?.setValue(color);
    this.form.markAsTouched();
  }

  private _editItem(item: any): void {
    firstValueFrom(this._entitiesRepositoryService.update(item, this.entity.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Entidad editada',
          detail: item.name + ' se editó correctamente',
          life: 6000
        });

        let log = getLog(this.entity.id, 'UPDATE', 'entities', this.userDataModel.id);
        this._logsRepositoryService.create({ ...log });

        this._closeModal(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error editando',
          detail: 'Ocurrio un error al guardar la entidad',
          life: 6000
        });
        this._closeModal(false);
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _createItem(item: any): void {
    firstValueFrom(this._entitiesRepositoryService.create(item))
      .then((id: string) => {
        this._toastService.add({
          severity: 'success',
          summary: 'Entidad añadida',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

        let log = getLog(id, 'CREATE', 'entities', this.userDataModel.id);
        this._logsRepositoryService.create({...log});

        this._closeModal(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error creando',
          detail: 'Ocurrio un error al crear la entidad',
          life: 6000
        });
        this._closeModal(false);
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _closeModal(refreshList: boolean): void {
    this._ref.close({ refreshList: refreshList });
  }

  private _fetchCountries(): void {
    const configList: ConfigList = {
      orderByConfigList: [{ field: 'name', direction: 'asc' }],
      queryList: [{ field: 'parentId', operation: '==', value: '' }]
    };

    firstValueFrom(this._locationRepositoryService.getByQuerys(configList))
      .then((countries: any[]) => {
        this.countries = countries;
        this._cdr.markForCheck();
      })
      .catch(() => {
        this.countries = [];
      });
  }

  private _fetchCities(): void {
    const configList: ConfigList = {
      orderByConfigList: [{ field: 'name', direction: 'asc' }],
      queryList: [{ field: 'parentId', operation: '==', value: this.form.get('location.countryIds')?.value[0] }]
    };

    firstValueFrom(this._locationRepositoryService.getByQuerys(configList))
      .then((cities: any[]) => {
        this.cities = cities;
        this._cdr.markForCheck();
      })
      .catch(() => {
        this.cities = [];
      });
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      name: new FormControl(this.entity.name, [Validators.required]),
      description: new FormControl(this.entity.description),
      phone: new FormControl(this.entity.phone.number, [Validators.required]),
      slug: new FormControl(this.entity.slug, [Validators.required]),
      color: new FormControl(this.entity.color, [Validators.required]),
      isPublic: new FormControl(this.entity.isPublic, [Validators.required]),
      photoUrl: new FormControl(this.entity.photoUrl),
      location: this._formBuilder.group({
        cityIds: [this.entity.location.cityIds],
        countryIds: [this.entity.location.countryIds],
      })
    });
  }

  private _setupFormListeners(): void {
    this.form.get('location.countryIds')?.valueChanges.subscribe((countryIds) => {
      this._handleCountrySelectionChange(countryIds);
    });
  }

  private _handleCountrySelectionChange(countryIds: any[]): void {
    if (countryIds?.length > 0) {
      this._fetchCities();
    } else {
      this.cities = [];
    }
  }
}
