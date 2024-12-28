import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';
import { Location } from 'src/app/modules/shared/models/location.model';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { LocationService } from 'src/app/modules/shared/services/location.repository-service';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';

@Component({
  selector: 'location-form',
  templateUrl: './location-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationFormComponent implements OnInit {

  public form!: FormGroup;
  public location!: any;
  public userData!: any;

  public locationList!: any[];

  constructor(private _locationRepositoryService: LocationService,
    private _logsRepositoryService: LogsRepositoryService,
    private _toastService: MessageService,
    private _loaderService: LoaderService,
    private _config: DynamicDialogConfig,
    private _formBuilder: FormBuilder,
    private _ref: DynamicDialogRef) {
  }

  ngOnInit() {
    this.form = this._formBuilder.group({});
    if (this._config?.data.location) {
      this.location = this._config?.data.location;
    } else {
      this.location = new Location();
    };
    this.locationList = this._config?.data.locationList || [];
    this.userData = this._config?.data.userData;

    this._initForm();
  }


  public saveForm(): void {
    this._loaderService.show = true;
    const location: any = { ...this.location, ...this.form.value };

    if (location.id) {
      delete location.id;
      this._editItem(location);
    } else {
      this._createItem(location);
    }
  }

  private _editItem(item: any): void {
    firstValueFrom(this._locationRepositoryService.update(item, this.location.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item editado',
          detail: item.name + ' se editó correctamente',
          life: 6000
        });

        let log = getLog(this.location.id, 'UPDATE', 'locations', this.userData.id);
        this._logsRepositoryService.create({...log});

        this._ref.close(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error editando',
          detail: 'Ocurrio un error al guardar el item',
          life: 6000
        });

        this._ref.close(false);
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _createItem(item: any): void {
    firstValueFrom(this._locationRepositoryService.create(item))
      .then((id: any) => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item añadido',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

        let log = getLog(id, 'CREATE', 'locations', this.userData.id);
        this._logsRepositoryService.create({...log});

        this._ref.close(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error creando',
          detail: 'Ocurrio un error al crear el item',
          life: 6000
        });

        this._ref.close(false);
        this._loaderService.show = false;
        console.error(error);
      });
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
