import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FoodsRepositoryService } from 'src/app/modules/shared/services/foods.repository-service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';

import { ConfigList } from 'src/framework/repository/config-list.model';

@Component({
  selector: 'foods-form',
  templateUrl: './foods-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodsFormComponent implements OnInit {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public userDataModel!: any;

  public foods: any[] | null;
  public isLoading: boolean = true;

  constructor(private _foodsRepositoryService: FoodsRepositoryService,
    private _loaderService: LoaderService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef) {
    this.foods = null;
  }

  ngOnInit() {
    this._getFoods();
  }

  private async _getFoods(): Promise<void> {
    try {
      this._loaderService.show = true;

      const configList: ConfigList = this._getConfigList();

      const foods: any = await firstValueFrom(this._foodsRepositoryService.getByQuerys(configList));
      this.foods = foods;
    } catch (error) {
      console.error('Error al obtener los ítems:', error);
      this._loaderService.show = false;
    } finally {
      this._initForm();
      this.isLoading = false;
      this._loaderService.show = false;
      this._cdr.markForCheck();
    }
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  private _getConfigList() {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'desc'
        }
      ]
    };

    if (this.userDataModel.role !== 'SUPERADMIN') {
      configList.queryList.push({
          field: 'entitiesId',
          operation: 'array-contains-any',
          value: [this.userDataModel.entity.id]
        })
    }

    return configList;
  }

  private _initForm(): void {
    this.form.addControl('foods', this._formBuilder.control(this.item.foods || []));
  }
}
