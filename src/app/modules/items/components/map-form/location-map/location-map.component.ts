import { Component, AfterViewInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html'
})
export class LocationMapComponent implements AfterViewInit {

  public mapId: string;
  private _map!: L.Map;
  private readonly _baseMapURl: string = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

  public currentLocationIcon = new L.Icon({
    iconUrl: 'assets/images/pins/location.svg',
    iconSize: [35, 35]
  });

  @Input()
  public latitude!: number;

  @Input()
  public longitude!: number;

  @Output()
  public mapCenterUpdated: any = new EventEmitter();

  constructor(private _cdr: ChangeDetectorRef) {
    this.mapId = 'locationMap';
  }

  ngAfterViewInit(): void {
    this._initializeMap();
  }

  private _initializeMap(): void {
    let latLng: L.LatLng = new L.LatLng(this.latitude, this.longitude);

    this._map = new L.Map(this.mapId, { zoomAnimation: true, minZoom: 10 });
    this._map.setView(latLng, 13);
    // this._listenMapCenter();

    L.tileLayer(this._baseMapURl).addTo(this._map);
  }

  private _listenMapCenter(): void {
    this._map.on('moveend', () => {
      const center = this._map.getCenter();
      this.mapCenterUpdated.emit({ latitude: center.lat, longitude: center.lng });
    });
  }
}
