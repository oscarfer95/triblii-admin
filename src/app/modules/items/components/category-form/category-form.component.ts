import { MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { CategoriesRepositoryService } from 'src/app/modules/shared/services/category.repository-service';
import { Category } from 'src/app/modules/shared/models/category.model';
import { CATEGORY_MODULES_LIST } from 'src/app/modules/shared/constants/modules.constant';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';

@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormComponent implements OnInit {

  public form!: FormGroup;
  public category!: any;

  public categories: any[] | null;
  public parentCategories: any[] | null;
  public modules: any[] | null = CATEGORY_MODULES_LIST;
  public userDataModel!: any;

  constructor(private _logsRepositoryService: LogsRepositoryService,
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
    const category = { ...this.category, ...this.form.value };
    
    if (category.id) {
      delete category.id;
      this._editItem(category);
    } else {
      this._createItem(category);
    }
  }

  private _initInputData() {
    this.userDataModel = this._config?.data.userDataModel;

    if (this._config?.data.category) {
      this.category = this._config?.data.category;
    } else {
      this.category = new Category();
    };
  }

  private _editItem(item: any): void {
    firstValueFrom(this._categoriesRepositoryService.update(item, this.category.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Categoría editada',
          detail: item.name + ' se editó correctamente',
          life: 6000
        });

        let log = getLog(this.category.id, 'UPDATE', 'categories', this.userDataModel.id);
        this._logsRepositoryService.create({ ...log });

        this._closeModal(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error editando',
          detail: 'Ocurrio un error al guardar la categoría',
          life: 6000
        });
        this._closeModal(false);
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _createItem(item: any): void {
    firstValueFrom(this._categoriesRepositoryService.create(item))
      .then((id: string) => {
        this._toastService.add({
          severity: 'success',
          summary: 'Categoría añadida',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

        let log = getLog(id, 'CREATE', 'categories', this.userDataModel.id);
        this._logsRepositoryService.create({...log});

        this._closeModal(true);
        this._loaderService.show = false;
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error creando',
          detail: 'Ocurrio un error al crear la categoría',
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
        this.parentCategories = categories.filter(item => item.parentId === '');

        this._cdr.markForCheck();
      })
      .catch(() => {
        this.categories = [];
      });
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      name: new FormControl(this.category.name, [Validators.required]),
      iconClass: new FormControl(this.category.iconClass),
      isFeatured: new FormControl(this.category.isFeatured, [Validators.required]),
      order: new FormControl(this.category.order, [Validators.required]),
      parentId: new FormControl(this.category.parentId),
      available: new FormControl(this.category.available, [Validators.required]),
      photoUrl: new FormControl(this.category.photoUrl),
      type: new FormControl(this.category.type || 'general', [Validators.required])
    });
  }
}
