import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { ConfigList } from 'src/framework/repository/config-list.model';
import { LocationService } from '../../services/location.repository-service';

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
  public countries: any[] | null;
  public cities: any[] | null;

  constructor(
    private _locationRepositoryService: LocationService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef
  ) {
    this.countries = null;
    this.cities = null;
    this.form = this._formBuilder.group({});
  }

  ngOnInit(): void {
    this._fetchCountries();
    this._initializeForm();
    this._fetchCities();
    this._loadInitialData();
    this._setupFormListeners();
  }

  private _initializeForm(): void {
    this.form.addControl(
      'countryIds',
      this._formBuilder.control(
        { value: this.userDataModel?.entity?.location?.countryIds || [], disabled: this.userDataModel?.role !== 'SUPERADMIN' },
        [Validators.required]
      )
    );
    this.form.addControl(
      'cityIds',
      this._formBuilder.control(
        { value: this.userDataModel?.entity?.location?.cityIds || [], disabled: this.userDataModel?.role !== 'SUPERADMIN' }
      )
    );
  }
  

  private _loadInitialData(): void {
    const cityIds = this.userDataModel?.entity?.location?.cityIds;
    
    if (cityIds?.length > 0) {
      this.cities = cityIds;
    }
  }

  private _setupFormListeners(): void {
    this.form.get('countryIds')?.valueChanges.subscribe((countryIds) => {
      this._handleCountrySelectionChange(countryIds);
    });
  }

  private _handleCountrySelectionChange(countryIds: any[]): void {
    if (countryIds?.length > 0) {
      this._fetchCities();
    } else {
      this._clearCities();
    }
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
    const countryIds = this.form.get('countryIds')?.value;

    if (!countryIds || countryIds.length === 0) {
      this._clearCities();
      return;
    }

    const configList: ConfigList = {
      orderByConfigList: [{ field: 'name', direction: 'asc' }],
      queryList: [{ field: 'parentId', operation: 'in', value: countryIds }]
    };

    firstValueFrom(this._locationRepositoryService.getByQuerys(configList))
      .then((cities: any[]) => {
        this._updateCities(cities);
      })
      .catch(() => {
        this._clearCities();
      });
  }

  private _updateCities(cities: any[]): void {
    this.cities = cities;

    const selectedCityIds = this.form.get('cityIds')?.value || [];
    const validCityIds = selectedCityIds.filter((cityId: any) =>
      cities.some((city: any) => city.id === cityId)
    );

    this.form.get('cityIds')?.setValue(validCityIds, { emitEvent: false });
    this._cdr.markForCheck();
  }

  private _clearCities(): void {
    this.cities = [];
    this.form.get('cityIds')?.patchValue([]);
  }

  public markAsTouched(): void {
    this.form.markAllAsTouched();
  }
}
