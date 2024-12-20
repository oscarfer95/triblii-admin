import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';

import { SsDeleteManyFilesStorageService } from '../../../ss-shared/services/ss-delete-many-files-storage.service';
import { SsLoaderService } from 'src/app/modules/ss-shared/services/ss-loader.service';
import CanDeactivateComponent from '../../../ss-shared/models/router/can-deactivate-component';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { RepositoryFactoryService } from 'src/app/modules/ss-shared/services/repository-factory.service';
import { getTabItemsById } from 'src/app/modules/ss-shared/utils/tabs-config';
import { createEmptyItemForm } from 'src/app/modules/ss-shared/utils/item-forms-config';
import { Item } from 'src/app/modules/ss-shared/models/item.model';

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

  constructor(private _deleteManyFilesStorageService: SsDeleteManyFilesStorageService,
    private _repositoryService: RepositoryFactoryService,
    private _userDataModelService: UserDataModelService,
    private _confirmationService: ConfirmationService,
    private _activatedRoute: ActivatedRoute,
    private _loaderService: SsLoaderService,
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
    this._getItem();
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

        case 'locationForm':
          formValue['location'] = subFormValue;
          break;

        case 'scheduleForm':
          formValue['schedule'] = subFormValue;
          break;

        case 'dateSettingForm':
          formValue['dateSetting'] = subFormValue;
          break;

        default:
          Object.assign(formValue, subFormValue);
          break;
      }
    }

    const item: any = { ...this.item, ...formValue };

    if (item.id) {
      delete item.id;
      item.entitiesId.includes(this.userDataModel.entity.id) ? null : item.entitiesId.push(this.userDataModel.entity.id);
      this._editItem(item);
      console.log(item);
    } else {
      item.entitiesId.push(this.userDataModel.entity.id);
      this._createItem(item);
      console.log(item);
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
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item añadido',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

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
        .then((item: any[]) => {
          this.item = item;

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
    this.item = null;
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
        if (this.item.id) {
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
    const confirmedOldImageUrlList: string[] = [photoUrl, ...gallery];

    const { removedImageIdList, imageIdList } = this.galleryForm.value;
    const actualImageUrlList: string[] = [...removedImageIdList, ...imageIdList];
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
          imageUrlList.push(actualImageUrlList);
        }
      }
    );

    return imageUrlList;
  }
}
