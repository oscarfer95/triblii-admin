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
import { CategoriesRepositoryService } from 'src/app/modules/shared/services/category.repository-service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'categories-table',
  templateUrl: './categories-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class CategoriesTableComponent implements OnInit {

  @Input()
  public categoryList!: any[];

  @Input()
  public userData!: any;

  @Output()
  public dataChanges: EventEmitter<void>;

  @ViewChild('dt')
  public table!: Table;

  constructor(private _categoriesRepositoryService: CategoriesRepositoryService,
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
          this._deleteCategory(item.id as string).then(() => {
            this._toastService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'El item se eliminó correctamente',
              life: 6000
            });

            let log = getLog(item.id, 'DELETE', 'categories', this.userData.id);
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

  private _deleteCategory(id: string): Promise<any> {
    return firstValueFrom(
      this._categoriesRepositoryService.delete(id)
    );
  }

  public applyFilterGlobal(event: any, stringVal: string): void {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  public openEntityFormModal(category: any) {
    const component: Type<any> = CategoryFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        category: category,
        userDataModel: this.userData
      },
      header: 'Categoría'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
    dialogRef.onClose.subscribe((refreshList: any) => {
      if (refreshList) {
        this.dataChanges.emit();
      }
    });
  }
}
