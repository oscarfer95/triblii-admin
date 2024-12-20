import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ConfigList } from 'src/framework/repository/config-list.model';
import { LocationService } from '../../services/ss-location.repository-service';

@Component({
  selector: 'country-form',
  templateUrl: './country-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryFormComponent implements OnInit {

  @Input()
  public userDataModel!: any;

  public form!: FormGroup;
  public countries: any[];
  public cities: any[];

  constructor(private _locationRepositoryService: LocationService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef) {
    this.form = this._formBuilder.group({});
    this.countries = [];
    this.cities = [];
  }

  ngOnInit(): void {
    this._initForm();
    this._getCountries();
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  private _initForm(): void {
    this.form.addControl('countryIds', this._formBuilder.control(this.userDataModel?.entity?.countryId, [Validators.required]));
    this.form.addControl('cityIds', this._formBuilder.control(this.userDataModel?.entity, [Validators.required]));
  }

  private _getCountries(): void {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'parentId',
          operation: '==',
          value: ''
        }
      ]
    };

    firstValueFrom(this._locationRepositoryService.getByQuerys(configList))
      .then((countries: any[]) => {
        this.countries = countries;

        this._cdr.markForCheck();
      });
  }

  public getCities(): void {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'parentId',
          operation: 'in',
          value: this.form.get('countryIds')?.value
        }
      ]
    };

    firstValueFrom(this._locationRepositoryService.getByQuerys(configList))
      .then((cities: any[]) => {
        this.cities = cities;

        this._cdr.markForCheck();
      });
  }
}
