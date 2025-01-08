import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DeleteManyFilesStorageService } from '../../../shared/services/delete-many-files-storage.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { Log } from 'src/app/modules/shared/models/log.model';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';

@Component({
  selector: 'items-table',
  templateUrl: './items-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsTableComponent implements OnInit {

  @Input()
  public itemList!: any[];

  @Input()
  public userData!: any;

  @Input()
  public moduleId!: string;

  @Input()
  public service!: any;

  @Output()
  public dataChanges: EventEmitter<void>;

  @ViewChild('dt')
  public table!: Table;

  constructor(private _deleteManyFilesStorageService: DeleteManyFilesStorageService,
    private _logsRepositoryService: LogsRepositoryService,
    private _confirmationService: ConfirmationService,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _router: Router) {
    this.dataChanges = new EventEmitter<void>();
  }

  public ngOnInit(): void {
  }

  public copyItemLink(id: string): void {
    let urlBase: string = 'https://ucityhub.web.app/detail/';
    let param: string = `${this.moduleId}/${id}?entity-selected=${this.userData.entity.id}`;

    if (id) {
      const link = urlBase + param;

      navigator.clipboard.writeText(link)

      this._toastService.add({
        severity: 'success',
        summary: 'Link copiado correctamente',
        life: 3000
      });
    }
  }

  public confirmDeleteItem(item: any): void {
    this._confirmationService.confirm({
      message: 'Seguro que deseas eliminar este item?',
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
          this._deleteProduct(item.id as string).then(() => {
            this._toastService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'El item se eliminó correctamente',
              life: 6000
            });

            let log = getLog(item.id, 'DELETE', this.moduleId, this.userData.id);
            this._logsRepositoryService.create({...log});

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

  private _deleteProduct(id: string): Promise<any> {
    return firstValueFrom(
      this.service.delete(id)
    );
  }

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public addItem(): void {
    if (this.itemList.length >= 50) {
      // TODO: Cuando se agreguen suscripciones cambiar aqui el control de limite de items
      this._toastService.add({
        severity: 'error',
        summary: 'Límite alzanzado',
        detail: 'Contacta con servicio al cliente para ampliar tu suscripción',
        life: 6000
      });
    } else {
      this._router.navigate([`/dashboard/items/${this.moduleId}/new`]);
    }
  }
}
