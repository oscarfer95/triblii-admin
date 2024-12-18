import { Component, AfterViewInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation, HostListener } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LocationMapComponent implements AfterViewInit, OnChanges {

  @Input() latitude!: number;
  @Input() longitude!: number;
  @Output() mapCenterUpdated = new EventEmitter<{ latitude: number; longitude: number }>();

  public mapId: string;
  private _map!: L.Map;
  private readonly _baseMapURL: string = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  public mapInitialized: boolean = false;
  public isLocked: boolean = true;

  constructor(private _cdr: ChangeDetectorRef) {
    this.mapId = 'locationMap';
  }

  ngAfterViewInit(): void {
    if (!this._map) {
      this.initializeMap();
    } else {
      this.updateMapView();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mapInitialized) {
      if ((changes['latitude'] || changes['longitude']) && this._isValidCoords(this.latitude, this.longitude)) {
        this.updateMapView();
      }
    }
  }

  public unlockMap() {
    if (!this._isValidCoords(this.latitude, this.longitude)) {
      this._refreshMap();
    } else {
      this._map.invalidateSize();
    }
    this.isLocked = false;
  }

  private initializeMap(defaultLat?: number, defaultLng?: number): void {
    const lat = defaultLat !== undefined ? defaultLat : this.latitude;
    const lng = defaultLng !== undefined ? defaultLng : this.longitude;

    this._map = L.map(this.mapId, {
      zoomAnimation: true,
      minZoom: 8,
      center: [lat, lng],
      zoom: 18
    });

    L.tileLayer(this._baseMapURL).addTo(this._map);

    this._map.on('moveend', () => {
      const center = this._map.getCenter();
      this._refreshMap();
      this.mapCenterUpdated.emit({ latitude: center.lat, longitude: center.lng });
    });

    this._map.on('load', () => {
      setTimeout(() => {
        this._refreshMap();
      }, 0);
    });

    this.mapInitialized = true;
  }

  private updateMapView(): void {
    this._map.setView([this.latitude, this.longitude], 18);
    this._refreshMap();
  }

  private _refreshMap(): void {
    setTimeout(() => {
      this._map.invalidateSize();
      this._cdr.detectChanges();
    }, 0);
  }

  private _isValidCoords(lat: any, lng: any): boolean {
    return typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng);
  }
}
