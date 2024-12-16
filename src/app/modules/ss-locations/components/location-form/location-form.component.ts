import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationMapComponent } from '../location-map/location-map.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html'
})
export class LocationFormComponent implements OnInit {

  @ViewChild('locationMap')
  public locationMap!: LocationMapComponent;

  @Input()
  edit: boolean = false;

  @Input()
  data: any;

  public location: any | null = null;
  public locationType: string | null = null;
  public isLocationMapConfirmed: boolean = false;
  public isAddressLoading: boolean = false;

  public locationForm!: FormGroup;

  constructor(private _config: DynamicDialogConfig,
              private _formBuilder: FormBuilder,
              private _ref: DynamicDialogRef
  ) { }

  ngOnInit() {
    if (this._config?.data) {
      this.data = this._config.data.data;
      this.edit = this._config.data.edit;
      this._initFields();
    }

    this._initForm();
  }

  private _initFields() {
    this.locationType = this.data.locationType;
    this.location = this.data.location;
    this.isLocationMapConfirmed = true;
  }

  private _initForm() {
    this.locationForm = this._formBuilder.group({
      location: [this.data?.location || this.location, [Validators.required]],
      address: [this.data?.address || '', [Validators.required, Validators.minLength(5)]],
      number: [this.data?.number || '', [Validators.required]],
      reference: [this.data?.reference || '', [Validators.maxLength(100)]],
      contact: [this.data?.contact || ''],
      locationType: [this.data?.locationType || this.locationType]
    });
  }

  public saveLocation(): void {
    this._ref.close(this.locationForm.value);
  }

  public editLocation(): void {
    let location = this.locationForm.value;
    location.accountId = this.data.accountId;
    location.id = this.data.id;

    this._ref.close(this.locationForm.value);
  }

  public confirmLocation():void {
    this.locationMap.saveLocation();

    this.location = {
      latitude: this.locationMap.latitude,
      longitude: this.locationMap.longitude
    };

    this._setLocationFieldForm();
    this.isLocationMapConfirmed = true;
    this._reverseGeocode();
  }

  public async getLocation() {
    try {
      if (this.location) {
        this.isLocationMapConfirmed = false;
      } else {
        const coordinates = await this.getBrowserLocation();

        this.location = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        };
        this.isLocationMapConfirmed = false;
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  public setLocationType(type: string) {
    this.locationType = type;
    this.locationForm.patchValue({ locationType: this.locationType });
  }

  public _setLocationFieldForm() {
    this.locationForm.patchValue({ location: this.location });
  }

  private _setAddressFieldForm(address: string) {
    this.locationForm.patchValue({ address: address });
  }

  public removeType() {
    this.locationType = null;
  }

  public getLocationTypeText(type: string): string {
    let text = '';

    switch (type) {
      case 'HOME':
        text = 'Casa';
        break;

      case 'WORK':
        text = 'Trabajo';
      break;

      case 'OTHER':
        text = 'Otro';
      break;

      case 'APARTMENT':
        text = 'Departamento';
      break;
    }

    return text;
  }

  private _reverseGeocode(): void {
    this.isAddressLoading = true;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.location.latitude}&lon=${this.location.longitude}&zoom=18&addressdetails=1`;

    try {
      fetch(url)
      .then(response => response.json())
      .then(data => {
        this._setAddressFieldForm(data.address.road);
        this.isAddressLoading = false;
      });
    } catch (error) {
      this._setAddressFieldForm('');
      this.isAddressLoading = false;
    }
  }

  private getBrowserLocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error)
        );
      } else {
        reject(new Error("La geolocalización no es compatible con este navegador."));
      }
    });
  }
}
