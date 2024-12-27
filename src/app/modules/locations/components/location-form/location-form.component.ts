import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Location } from 'src/app/modules/shared/models/location.model';

@Component({
  selector: 'location-form',
  templateUrl: './location-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationFormComponent implements OnInit {

  public form!: FormGroup;
  public location!: any;

  public locationList!: any[];

  constructor(private _config: DynamicDialogConfig,
    private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._formBuilder.group({});
    if (this._config?.data.location) {
      this.location = this._config?.data.location;
    } else {
      this.location = new Location();
    };
    this.locationList = this._config?.data.locationList || [];

    this._initForm();
  }

  public saveForm() {
    // todo COMPLETAR
    // TODO LOGS
  }

  private _initForm(): void {
    this.form?.addControl('name', this._formBuilder.control(this.location.name, [Validators.required, Validators.min(1), Validators.max(20)]));
    this.form?.addControl('description', this._formBuilder.control(this.location.description));
    this.form?.addControl('parentId', this._formBuilder.control(this.location.parentId));
    this.form?.addControl('order', this._formBuilder.control(this.location.order, [Validators.required]));
    this.form?.addControl('isFeatured', this._formBuilder.control(this.location.isFeatured, [Validators.required]));
    this.form?.addControl('available', this._formBuilder.control(this.location.available, [Validators.required]));
    this.form?.addControl('flag', this._formBuilder.control(this.location.flag));
    this.form?.addControl('photoUrl', this._formBuilder.control(this.location.photoUrl));
  }
}
