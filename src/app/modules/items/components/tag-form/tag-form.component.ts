import { MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { Category } from 'src/app/modules/shared/models/category.model';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';
import { TagRepositoryService } from 'src/app/modules/shared/services/tag.repository-service';
import { CategoriesRepositoryService } from 'src/app/modules/shared/services/category.repository-service';

@Component({
  selector: 'tag-form',
  templateUrl: './tag-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagFormComponent implements OnInit {

  public form!: FormGroup;
  public tag!: any;

  public categories: any[] | null;
  public userDataModel!: any;

  constructor(private _logsRepositoryService: LogsRepositoryService,
    private _tagsRepositoryService: TagRepositoryService,
    private _categoriesRepositoryService: CategoriesRepositoryService,
    private _config: DynamicDialogConfig,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    public _ref: DynamicDialogRef) {
  }

  async ngOnInit(): Promise<any> {
    this._initInputData();

    await this._getCategories();

    this._initForm();
  }

  public saveForm(): any {
    this._loaderService.show = true;
    const tag = { ...this.tag, ...this.form.value };
    
    if (tag.id) {
      delete tag.id;
      this._editItem(tag);
    } else {
      this._createItem(tag);
    }
  }

  private _initInputData() {
    this.userDataModel = this._config?.data.userDataModel;

    if (this._config?.data.tag) {
      this.tag = this._config?.data.tag;
    } else {
      this.tag = new Category();
    };
  }

  private _editItem(item: any): void {
    firstValueFrom(this._tagsRepositoryService.update(item, this.tag.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Etiqueta editada',
          detail: item.name + ' se editó correctamente',
          life: 6000
        });

        let log = getLog(this.tag.id, 'UPDATE', 'tags', this.userDataModel.id);
        this._logsRepositoryService.create({ ...log });

        this._closeModal(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error editando',
          detail: 'Ocurrio un error al guardar la etiqueta',
          life: 6000
        });
        this._closeModal(false);
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _createItem(item: any): void {
    firstValueFrom(this._tagsRepositoryService.create(item))
      .then((id: string) => {
        this._toastService.add({
          severity: 'success',
          summary: 'Etiqueta añadida',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

        let log = getLog(id, 'CREATE', 'tags', this.userDataModel.id);
        this._logsRepositoryService.create({...log});

        this._closeModal(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error creando',
          detail: 'Ocurrio un error al crear la etiqueta',
          life: 6000
        });
        this._closeModal(false);
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _closeModal(refreshList: boolean): void {
    this._ref.close({ refreshList: refreshList });
  }

  private async _getCategories(): Promise<any> {
    firstValueFrom(this._categoriesRepositoryService.list())
      .then((categories: any[]) => {
        this.categories = categories;

        this._cdr.markForCheck();
      })
      .catch(() => {
        this.categories = [];
      });
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      name: new FormControl(this.tag.name, [Validators.required]),
      categoryId: new FormControl(this.tag.categoryId, [Validators.required]),
      available: new FormControl(this.tag.available, [Validators.required])
    });
  }
}
