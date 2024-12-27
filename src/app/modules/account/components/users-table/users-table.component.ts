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
import { UsersRepositoryService } from 'src/app/modules/shared/services/users.repository-service';
import { deleteUser, getAuth } from '@angular/fire/auth';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent implements OnInit {

  @Input()
  public userList!: any[];

  @Input()
  public userData!: any;

  @Output()
  public dataChanges: EventEmitter<void>;

  @ViewChild('dt')
  public table!: Table;

  private _authService: any;

  constructor(private _usersRepositoryService: UsersRepositoryService,
    private _deleteManyFilesStorageService: DeleteManyFilesStorageService,
    private _logsRepositoryService: LogsRepositoryService,
    private _confirmationService: ConfirmationService,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _router: Router) {
    this.dataChanges = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    this._authService = getAuth();
  }

  public confirmDeleteItem(item: any): void {
    this._confirmationService.confirm({
      message: 'Seguro que deseas eliminar este usuario?',
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
          this._deleteUser(item.id as string, item.accountId as string).then(() => {
            this._toastService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'El usuario se eliminó correctamente',
              life: 6000
            });

            let log = getLog(item.id, 'DELETE', 'users', this.userData.id);
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

private async _deleteUser(id: string, uid: string): Promise<void> {
  try {
    await firstValueFrom(this._usersRepositoryService.delete(id));
  } catch (error) {
    console.error('Error al eliminar usuario', error);
    throw error;
  }
}

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public addItem(): void {
    if (this.userList.length >= 50) {
      // TODO: Cuando se agreguen suscripciones cambiar aqui el control de limite de items
      this._toastService.add({
        severity: 'error',
        summary: 'Límite alzanzado',
        detail: 'Contacta con servicio al cliente para ampliar tu suscripción',
        life: 6000
      });
    } else {
      this._router.navigate([`/dashboard/account/users/new`]);
    }
  }
}
