import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { DeleteManyFilesStorageService } from '../../../shared/services/delete-many-files-storage.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminEntityFormComponent } from '../admin-entity-form/admin-entity-form.component';
import { EntitiesRepositoryService } from 'src/app/modules/shared/services/entities.repository-service';

@Component({
  selector: 'entities-table',
  templateUrl: './entities-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class EntitiesTableComponent implements OnInit {

  @Input()
  public entitiesList!: any[];

  @Input()
  public userData!: any;

  @Output()
  public dataChanges: EventEmitter<void>;

  @ViewChild('dt')
  public table!: Table;

  constructor(private _entitiesRepositoryService: EntitiesRepositoryService,
    private _deleteManyFilesStorageService: DeleteManyFilesStorageService,
    private _confirmationService: ConfirmationService,
    private _dialogService: DialogService,
    private _loaderService: LoaderService,
    private _toastService: MessageService) {
    this.dataChanges = new EventEmitter<void>();
  }

  public ngOnInit(): void {
  }

  public confirmDeleteItem(item: any): void {
    this._confirmationService.confirm({
      message: 'Seguro que deseas eliminar esta entidad?',
      header: 'Eliminar',
      acceptLabel: 'Confirmar',
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
          this._deleteEntity(item.id as string).then(() => {
            this._toastService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Locación eliminada correctamente',
              life: 6000
            });

            if (item?.gallery && item?.gallery.length > 0) {
              this._deleteManyFilesStorageService.execute(item.gallery);

              this._loaderService.show = false;
              this.dataChanges.emit();
            } else {
              this._loaderService.show = false;
              this.dataChanges.emit();
            }
          });
        } catch (error) {
          this._toastService.add({
            severity: 'error',
            summary: 'Error al eliminar',
            detail: 'Contacta con soporte',
            life: 6000
          });

          this._loaderService.show = false;
        }
      }
    });
  }

  private _deleteEntity(id: string): Promise<any> {
    return firstValueFrom(
      this._entitiesRepositoryService.delete(id)
    );
  }

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public addEntity(): void {
    if (this.entitiesList.length >= 50) {
      // TODO: Cuando se agreguen suscripciones cambiar aqui el control de limite de items
      this._toastService.add({
        severity: 'error',
        summary: 'Límite alzanzado',
        detail: 'Contacta con servicio al cliente para ampliar tu suscripción',
        life: 6000
      });
    } else {
      this.openEntityFormModal(null);
    }

  }

  public openEntityFormModal(entity: any) {
    const component: Type<any> = AdminEntityFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        entity: entity
      },
      header: 'Entidad'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
    dialogRef.onClose.subscribe((refreshList) => {
      if (refreshList) {
        this.dataChanges.emit();
      }
    });
  }
}
