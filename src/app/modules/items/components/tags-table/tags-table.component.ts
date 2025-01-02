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

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TagRepositoryService } from 'src/app/modules/shared/services/tag.repository-service';
import { TagFormComponent } from '../tag-form/tag-form.component';

@Component({
  selector: 'tags-table',
  templateUrl: './tags-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class TagsTableComponent implements OnInit {

  @Input()
  public tagList!: any[];

  @Input()
  public userData!: any;

  @Output()
  public dataChanges: EventEmitter<void>;

  @ViewChild('dt')
  public table!: Table;

  constructor(private _tagsRepositoryService: TagRepositoryService,
    private _dialogService: DialogService,
    private _logsRepositoryService: LogsRepositoryService,
    private _confirmationService: ConfirmationService,
    private _loaderService: LoaderService,
    private _toastService: MessageService) {
    this.dataChanges = new EventEmitter<void>();
  }

  public ngOnInit(): void {
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
          this._deleteTag(item.id as string).then(() => {
            this._toastService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'El item se eliminó correctamente',
              life: 6000
            });

            let log = getLog(item.id, 'DELETE', 'tags', this.userData.id);
            this._logsRepositoryService.create({ ...log });

            this._loaderService.show = false;
            this.dataChanges.emit();
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

  private _deleteTag(id: string): Promise<any> {
    return firstValueFrom(
      this._tagsRepositoryService.delete(id)
    );
  }

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public openEntityFormModal(tag: any) {
    const component: Type<any> = TagFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        tag: tag,
        userDataModel: this.userData
      },
      header: 'Etiqueta'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
    dialogRef.onClose.subscribe((refreshList: any) => {
      if (refreshList) {
        this.dataChanges.emit();
      }
    });
  }
}
