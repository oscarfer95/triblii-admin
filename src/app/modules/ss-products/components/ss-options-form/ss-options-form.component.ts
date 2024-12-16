import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

import {CategoriesRepositoryService} from 'src/app/modules/ss-shared/services/ss-category.repository-service';
import { SsTagRepositoryService } from 'src/app/modules/ss-shared/services/ss-tag.repository-service';
import {ConfigList} from 'src/framework/repository/config-list.model';

@Component({
  selector: 'ss-options-form',
  templateUrl: './ss-options-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsOptionsFormComponent implements OnInit, OnDestroy {

  @Input()
  public form!: FormGroup;

  @Input()
  public item!: any;

  @Input()
  public moduleId!: string;

  public categories: any[];
  public tags: any[];

  constructor(private _categoryRepositoryService: CategoriesRepositoryService,
              private _tagRepositoryService: SsTagRepositoryService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef) {
    this.categories = [];
    this.tags = [];
  }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this.getTags();
  }

  ngOnDestroy(): void {
  }

  public markAsTouched(): void {
    this.form.markAsTouched();
  }

  private _initForm(): void {
    this.form.addControl('categories', this._formBuilder.control(this.item?.categories, [Validators.required]));
    this.form.addControl('tags', this._formBuilder.control(this.item?.tags, [Validators.required]));
    this.form.addControl('isFeatured', this._formBuilder.control(this.item?.isFeatured, [Validators.required]));
    this.form.addControl('available', this._formBuilder.control(this.item?.available, [Validators.required]));
  }

  private _getCategories(): void {
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
          operation: '==',
          value: this.moduleId
        }
      ]
    };

    firstValueFrom(this._categoryRepositoryService.getByQuerys(configList))
      .then((categories: any[]) => {
        this.categories = categories;

        this._cdr.markForCheck();
      });
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
