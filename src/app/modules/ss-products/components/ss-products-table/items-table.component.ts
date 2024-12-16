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

import { SsDeleteManyFilesStorageService } from '../../../ss-shared/services/ss-delete-many-files-storage.service';
import { SsLoaderService } from 'src/app/modules/ss-shared/services/ss-loader.service';
import { AttractionsRepositoryService } from '../../../ss-shared/services/ss-products.repository-service';

@Component({
  selector: 'items-table',
  templateUrl: './items-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsProductsTableComponent implements OnInit {
  @Input()
  public itemList!: any[];

  @Input()
  public userData!: any;

  @Input()
  public moduleId!: string;

  @Output()
  public dataChanges: EventEmitter<void>;

  @ViewChild('dt')
  public table!: Table;

  constructor(private _deleteManyFilesStorageService: SsDeleteManyFilesStorageService,
    private _AttractionsRepositoryService: AttractionsRepositoryService,
    private _confirmationService: ConfirmationService,
    private _loaderService: SsLoaderService,
    private _toastService: MessageService,
    private _messageService: MessageService,
    private _router: Router) {
    this.dataChanges = new EventEmitter<void>();
  }

  public ngOnInit(): void {
  }

  public copyItemLink(id: string): void {
    let urlBase: string = 'https://triblii.web.app/';
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

  public confirmDeleteProduct(item: any): void {
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
      this._AttractionsRepositoryService.delete(id)
    );
  }

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public addItem(): void {
    if (this.itemList.length >= 50) {
      // TODO: Cuando se agreguen suscripciones cambiar aqui el control de limite de productos
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
