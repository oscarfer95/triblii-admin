import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { CategoriesRepositoryService } from 'src/app/modules/ss-shared/services/ss-category.repository-service';
import { TagRepositoryService } from 'src/app/modules/ss-shared/services/ss-tag.repository-service';
import { ConfigList } from 'src/framework/repository/config-list.model';

@Component({
  selector: 'options-form',
  templateUrl: './options-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsFormComponent implements OnInit, OnDestroy {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public moduleId!: string;

  public categories: any[];
  public mainCategories: any[];
  public tags: any[];
  public isLoading: boolean = true;

  constructor(private _categoryRepositoryService: CategoriesRepositoryService,
    private _tagRepositoryService: TagRepositoryService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef) {
    this.categories = [];
    this.mainCategories = [];
    this.tags = [];
  }

  ngOnInit() {   
    this._loadInitialData()
      .then(() => {
        this._initForm();
        this.getTags();
      })
      .catch(error => {
        console.error("Error loading initial data:", error);
      });
  }

  ngOnDestroy(): void {
  }

  private async _loadInitialData(): Promise<void> {
    try {
      const [mainCategories, categories] = await Promise.all([
        this._getMainCategories(),
        this._getCategories()
      ]);

      this.mainCategories = mainCategories;
      this.categories = categories;
      this.isLoading = false;
      this._cdr.markForCheck();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  private _initForm(): void {
    this.form.addControl('mainCategories', this._formBuilder.control(this._removeIdsFromArray(this.item.categories, this.categories)));
    this.form.addControl('categories', this._formBuilder.control(this._removeIdsFromArray(this.item.categories, this.mainCategories), [Validators.required]));
    this.form.addControl('tags', this._formBuilder.control(this.item?.tags, [Validators.required]));
    this.form.addControl('isFeatured', this._formBuilder.control(this.item?.isFeatured, [Validators.required]));
    this.form.addControl('available', this._formBuilder.control(this.item?.available, [Validators.required]));
  }

  private async _getMainCategories(): Promise<any[]> {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'type',
          operation: 'in',
          value: ['general']
        }
      ]
    };

    return firstValueFrom(this._categoryRepositoryService.getByQuerys(configList));
  }

  private async _getCategories(): Promise<any[]> {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'type',
          operation: 'in',
          value: [this.moduleId]
        }
      ]
    };

    return firstValueFrom(this._categoryRepositoryService.getByQuerys(configList));
  }

  private _removeIdsFromArray(idArray, objectArray) {
    const objectIds = objectArray.map(obj => obj.id.trim());
    return idArray.filter(id => !objectIds.includes(id.trim()));
}

  public getTags(): void {
    const configList: ConfigList = {
      orderByConfigList: [
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      queryList: [
        {
          field: 'categoryId',
          operation: 'in',
          value: this.form.get('categories')?.value.length > 0
          ? [...this.form.get('categories')?.value]
          : ['none']
        }
      ]
    };

    firstValueFrom(this._tagRepositoryService.getByQuerys(configList))
      .then((tags: any[]) => {
        this.tags = tags;

        this._cdr.markForCheck();
      });
  }
}
