import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html'
})
export class LocationMapComponent implements AfterViewInit {

  private _map!: L.Map;
  private readonly _baseMapURl: string = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  public mapId: string;

  public currentLocationIcon = new L.Icon({
    iconUrl: 'assets/images/pins/location.svg',
    iconSize: [40, 40]
  });

  @Input()
  public latitude!: number;

  @Input()
  public longitude!: number;

  @Output()
  public mapCenterUpdated: any = new EventEmitter();

  constructor() {
    this.mapId = 'locationMap';
  }

  ngAfterViewInit(): void {
    this._initializeMap();
  }

  private _initializeMap(): void {
    if (!this._map) {
      this._map = new L.Map(this.mapId, { zoomAnimation: true, minZoom: 10 });
      this._map.locate({ setView: true, enableHighAccuracy: true });
      this._map.setView([this.latitude, this.longitude], 15);
      this._listenMapCenter();
  
      L.tileLayer(this._baseMapURl).addTo(this._map);
    } else {
      console.warn('Map is already initialized.');
      return;
    }
  }

  private _listenMapCenter(): void {
    this._map.on('moveend', () => {
      const center = this._map.getCenter();
      this.mapCenterUpdated.emit({ latitude: center.lat, longitude: center.lng });
    });
  }
}
