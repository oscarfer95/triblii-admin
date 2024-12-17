import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationMapComponent } from '../location-map/location-map.component';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html'
})
export class LocationFormComponent implements OnInit {

  @ViewChild('locationMap')
  public locationMap!: LocationMapComponent;

  @Input()
  public itemLocation: any;

  public location: any | null = null;
  public isAddressLoading: boolean = false;
  public auxReady: boolean = false;

  public locationForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._initForm();

    if (this.itemLocation.coords.lat) {
      this._initFields();
    }
  }

  private _initFields() {
    this.location = {
      latitude: this.itemLocation.coords.lat,
      longitude: this.itemLocation.coords.lng
    }
  }

  private _initForm() {
    this.locationForm = this._formBuilder.group({
      location: [this.itemLocation?.location || null, [Validators.required]],
      address: [this.itemLocation?.address || '', [Validators.required, Validators.minLength(5)]],
      number: [this.itemLocation?.number || '', [Validators.maxLength(10)]],
      reference: [this.itemLocation?.reference || '', [Validators.maxLength(50)]]
    });
  }

  public async getLocation() {
    try {
      if (!this.location) {
        const coordinates = await this._getBrowserLocation();

        this.location = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        };
        this._reverseGeocode();
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  public _setLocationFieldForm() {
    this.locationForm.patchValue({ location: this.location });
  }

  public onMapCenterUpdated(event: { lat: number; lng: number }): void {
    if (event !== this.location) {
      this.location = event;
      this._reverseGeocode();
    }
  }

  private _setAddressFieldForm(address: string) {
    this.locationForm.patchValue({ address: address });
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
        this._cdr.detectChanges();
      });
    } catch (error) {
      this._setAddressFieldForm('');
      this.isAddressLoading = false;
      this._cdr.detectChanges();
    }
  }

  private _getBrowserLocation(): Promise<GeolocationCoordinates> {
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
