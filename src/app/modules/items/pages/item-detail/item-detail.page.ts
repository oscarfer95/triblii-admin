import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';

import { DeleteManyFilesStorageService } from '../../../shared/services/delete-many-files-storage.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import CanDeactivateComponent from '../../../shared/models/router/can-deactivate-component';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { RepositoryFactoryService } from 'src/app/modules/shared/services/repository-factory.service';
import { getTabItemsById } from 'src/app/modules/shared/utils/tabs-config';
import { createEmptyItemForm } from 'src/app/modules/shared/utils/item-forms-config';
import { Item } from 'src/app/modules/shared/models/item.model';
import { LogsRepositoryService } from 'src/app/modules/shared/services/logs.repository-service';
import { getLog } from 'src/app/modules/shared/utils/get-log.util';

@Component({
  selector: 'item-detail',
  templateUrl: './item-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetail implements CanDeactivateComponent, OnInit, OnDestroy {
  public tabItems: MenuItem[];
  public activeTab: MenuItem;

  public item: any | null;
  public itemForm!: FormGroup;
  private _itemFormSaved: boolean;

  public userDataModel!: UserDataModel;

  private _confirmDeactivate$: Subject<boolean>;

  private _unsubscribe: Subject<void>;
  public moduleId: string;
  private _service: any;

  constructor(private _deleteManyFilesStorageService: DeleteManyFilesStorageService,
    private _logsRepositoryService: LogsRepositoryService,
    private _repositoryService: RepositoryFactoryService,
    private _userDataModelService: UserDataModelService,
    private _confirmationService: ConfirmationService,
    private _activatedRoute: ActivatedRoute,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    public location: Location) {
    this._itemFormSaved = false;

    this._confirmDeactivate$ = new Subject();

    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._getModuleParam();
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public get informationForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('informationForm');
  }

  public get optionsForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('optionsForm');
  }

  public get galleryForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('galleryForm');
  }

  public get locationForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('locationForm');
  }

  public get foodsForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('foodsForm');
  }

  public get scheduleForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('scheduleForm');
  }

  public get contactForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('contactForm');
  }

  public get datesForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('datesForm');
  }

  public get servicesForm(): FormGroup {
    return <FormGroup>this.itemForm?.get('servicesForm');
  }

  public changeTab(event: any): void {
    const index = this.tabItems.findIndex(tab => tab.label === event.target.innerText);

    if (index !== -1) {
      this.activeTab = this.tabItems[index];
    }
  }

  public saveForm(): void {
    this._loaderService.show = true;

    const subFormNames = Object.keys(this.itemForm.controls);
    const formValue: any = {};

    for (const subFormName of subFormNames) {

      const subFormValue = this.itemForm.get(subFormName)?.value;

      switch (subFormName) {
        case 'galleryForm':
          formValue['gallery'] = subFormValue.imageIdList;
          break;

        case 'optionsForm':
          formValue['categories'] = [
            ...(subFormValue.categories || []),
            ...(subFormValue.mainCategories || [])
          ];

          formValue['tags'] = subFormValue.tags || [];
          formValue['isFeatured'] = subFormValue.isFeatured;
          formValue['available'] = subFormValue.available;

          delete subFormValue.categories;
          delete subFormValue.mainCategories;
          delete subFormValue.tags;
          delete subFormValue.isFeatured;
          delete subFormValue.available;
          break;

        case 'locationForm':
          formValue['location'] = subFormValue;
          break;

        case 'scheduleForm':
          formValue['schedule'] = subFormValue;
          break;

        case 'dateForm':
          formValue['dates'] = subFormValue;
          break;

        case 'contactForm':
          formValue['contact'] = subFormValue;
          break;

        case 'servicesForm':
          formValue['services'] = subFormValue.services;
          break;

        case 'datesForm':
          formValue['dates'] = subFormValue;
          break;

        default:
          Object.assign(formValue, subFormValue);
          break;
      }
    }
    const item: any = { ...this.item, ...formValue };

    if (item.id) {
      delete item.id;
      item?.entitiesId?.includes(this.userDataModel.entity.id) ? null : item?.entitiesId?.push(this.userDataModel.entity.id);
      this._editItem(item);
    } else {
      item?.entitiesId?.push(this.userDataModel.entity.id);
      this._createItem(item);
    }
  }

  private _editItem(item: any): void {
    firstValueFrom(this._service.update(item, this.item.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item editado',
          detail: item.name + ' se editó correctamente',
          life: 6000
        });

        let log = getLog(this.item.id, 'UPDATE', this.moduleId, this.userDataModel.id);
        this._logsRepositoryService.create({...log});

        const imageUrlListToDelete: string[] = this.galleryForm.value.removedImageIdList;
        this._removeImagesByUrlList(imageUrlListToDelete);

        this._itemFormSaved = true;
        this._loaderService.show = false;
        this._router.navigate([`/dashboard/items/${this.moduleId}`]);
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error editando',
          detail: 'Ocurrio un error al guardar el item',
          life: 6000
        });

        this._itemFormSaved = false;
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _createItem(item: any): void {
    firstValueFrom(this._service.create(item))
      .then((id: any) => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item añadido',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

        let log = getLog(id, 'CREATE', this.moduleId, this.userDataModel.id);
        this._logsRepositoryService.create({...log});

        const imageUrlListToDelete: string[] = this.galleryForm.value.removedImageIdList;
        this._removeImagesByUrlList(imageUrlListToDelete);

        this._itemFormSaved = true;
        this._loaderService.show = false;
        this._router.navigate([`/dashboard/items/${this.moduleId}`]);
      }).catch((error: any) => {
        this._toastService.add({
          severity: 'error',
          summary: 'Error creando',
          detail: 'Ocurrio un error al crear el item',
          life: 6000
        });

        this._itemFormSaved = false;
        this._loaderService.show = false;
        console.error(error);
      });
  }

  private _removeImagesByUrlList(urlList: string[]): void {
    if (urlList.length > 0) {
      this._deleteManyFilesStorageService.execute(urlList);
    }
  }

  private _getItem(): void {
    if (this._activatedRoute.snapshot.params['id'] === 'new') {
      this.item = Item.createInstance(this.moduleId);
    } else {
      firstValueFrom(this._service.getById(this._activatedRoute.snapshot.params['id']))
        .then((item: any) => {
          this.item = item;
          let log = getLog(item.id, 'READ', this.moduleId, this.userDataModel.id);
          this._logsRepositoryService.create({...log});

          this._cdr.markForCheck();
        });
    }
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel.accountId) {
          this.userDataModel = userDataModel;

          this._getItem();
          this._cdr.markForCheck();
        }
      });
  }

  private _getModuleParam() {
    this._activatedRoute.params.subscribe((params) => {
      this.moduleId = params['moduleId'];

      this._initModuleConfig();
    });
  }

  private _initModuleConfig() {
    this._service = this._repositoryService.getServiceById(this.moduleId);
    this.tabItems = getTabItemsById(this.moduleId);
    this.itemForm = createEmptyItemForm(this.moduleId, this._formBuilder);
    this.activeTab = this.tabItems[0];
  }

  public isFormValid(): boolean {
    return (this.informationForm.invalid);
  }

  public canDeactivate(): boolean | Observable<boolean> {
    if (!this.itemForm.dirty ||
      (this.itemForm.dirty && this._itemFormSaved)) {
      return true;
    }

    this._openConfirmationModal();
    return this._confirmDeactivate$.asObservable();
  }

  private _openConfirmationModal(): void {
    this._confirmationService.confirm({
      message: 'Seguro que deseas salir sin guardar los cambios?',
      header: 'Cambios sin guardar',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      closeOnEscape: true,
      dismissableMask: true,
      rejectButtonStyleClass: 'ss-button--clear ss-txt--black-lighten',
      acceptButtonStyleClass: 'ss-button--red',
      rejectIcon: '',
      acceptIcon: '',
      accept: () => {
        if (this.item?.id) {
          this._deleteUnconfirmedImagesOfUpdateForm();
        } else {
          this._deleteUnconfirmedImagesOfCreateForm();
        }

        this._confirmDeactivate$.next(true);
      },
      reject: () => {
        this._confirmDeactivate$.next(false);
      }
    });
  }

  private _deleteUnconfirmedImagesOfCreateForm(): void {
    const { removedImageIdList, imageIdList } = this.galleryForm.value;
    const imagesUrlListToDelete: string[] = [...removedImageIdList, ...imageIdList];
    if (this.informationForm.value.photoUrl) {
      imagesUrlListToDelete.push(this.informationForm.value.photoUrl);
    }

    this._removeImagesByUrlList(imagesUrlListToDelete);
  }

  private _deleteUnconfirmedImagesOfUpdateForm(): void {
    const { photoUrl, gallery } = this.item;

    const confirmedOldImageUrlList: string[] = [photoUrl, ...(Array.isArray(gallery) ? gallery : [])];

    const { removedImageIdList, imageIdList } = this.galleryForm.value;
    const actualImageUrlList: string[] = [...removedImageIdList, ...(Array.isArray(imageIdList) ? imageIdList : [])];
    if (this.informationForm.value.photoUrl) {
      actualImageUrlList.push(this.informationForm.value.photoUrl);
    }

    const imagesUrlListToDelete: string[] = this._filterOnlyDiffImageUrls(confirmedOldImageUrlList, actualImageUrlList);
    this._removeImagesByUrlList(imagesUrlListToDelete);
  }

  private _filterOnlyDiffImageUrls(oldImageUrlList: string[], actualImageUrlList: string[]): string[] {
    const imageUrlList: string[] = [];
    actualImageUrlList.forEach(
      (actualImageUrlList: string) => {
        if (!oldImageUrlList.includes(actualImageUrlList)) {
          imageUrlList?.push(actualImageUrlList);
        }
      }
    );

    return imageUrlList;
  }
}
