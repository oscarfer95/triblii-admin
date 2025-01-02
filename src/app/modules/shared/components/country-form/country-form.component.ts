import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { firstValueFrom } from 'rxjs';

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

  public locations: any[] | null;

  constructor(
    private _locationRepositoryService: LocationService,
    private _cdr: ChangeDetectorRef
  ) {
    this.locations = null;
  }

  ngOnInit(): void {
    this._fetchLocations();
  }

  private _fetchLocations(): void {
    firstValueFrom(this._locationRepositoryService.list())
      .then((locations: any[]) => {
        this.locations = locations;
        this._cdr.markForCheck();
      })
      .catch(() => {
        this.locations = [];
      });
  }
}
