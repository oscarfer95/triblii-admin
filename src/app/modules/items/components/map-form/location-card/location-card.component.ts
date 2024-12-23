import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LoaderService } from 'src/app/modules/ss-shared/services/loader.service';
import { LocationService } from 'src/app/modules/ss-shared/services/location.repository-service';
import { LocationFormComponent } from '../location-form/location-form.component';

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html'
})
export class LocationCardComponent implements OnInit {

  @ViewChild('op')
  public op!: OverlayPanel;

  @Input()
  edit: boolean = true;

  @Input()
  data: any;

  public items!: MenuItem[];
  private _ref: DynamicDialogRef | undefined;

  constructor(private _confirmationService: ConfirmationService,
              private _locationService: LocationService,
              private _loaderService: LoaderService,
              private _dialogService: DialogService) {
  }

  ngOnInit() {
    this.items = [
      { label: 'Editar', icon: 'pi pi-file-edit', command: () => this._openEditDetailModal() },
      { label: 'Eliminar', icon: 'pi pi-fw pi-trash', command: () => this._deleteLocation() }
    ];
  }

  private async _openEditDetailModal() {
    this.op.hide();
    this._ref = this._dialogService.open(
      LocationFormComponent,
      {
        header: 'Cambiar dirección',
        data: {
          data: this.data,
          edit: true
        }
      }
    );

    this._ref.onClose.subscribe((data: any) => {
      if (data) {
        this._editLocation(data);
      }
    });
  }

  private async _deleteLocation() {
    this._confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta dirección de tu lista?',
      header: 'Eliminar dirección',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      closeOnEscape: true,
      dismissableMask: true,
      rejectButtonStyleClass: 'ss-button--clear ss-txt--black-lighten',
      acceptButtonStyleClass: 'ss-button--red',
      rejectIcon: 'asd',
      acceptIcon: 'asd',
      accept: () => {
        this._loaderService.show = true;
        try {
          this._locationService.delete(this.data.id).subscribe(() => {
            this._loaderService.show = false;
          });
        } catch (error) {
          this._loaderService.show = false;
        }
        this.op.hide();
      }
    });
  }

  private async _editLocation(data: any) {
    this._loaderService.show = true;
    let id = data.id;
    delete data.id

    try {
      this._locationService.update(data, id).subscribe(() => {
        this._loaderService.show = false;
      });
    } catch (error) {
      this._loaderService.show = false;
    }
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
}
