import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Location} from '@angular/common';
import {firstValueFrom, Observable, Subject, takeUntil} from 'rxjs';

import {SsDeleteManyFilesStorageService} from '../../../ss-shared/services/ss-delete-many-files-storage.service';
import {SsLoaderService} from 'src/app/modules/ss-shared/services/ss-loader.service';
import {AttractionsRepositoryService} from 'src/app/modules/ss-shared/services/ss-products.repository-service';
import {Attraction} from 'src/app/modules/ss-shared/models/ss-product.model';
import CanDeactivateComponent from '../../../ss-shared/models/router/can-deactivate-component';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';
import { UserDataModelService } from 'src/app/modules/ss-auth/storage/user-data-model.service';

@Component({
  selector: 'ss-product-detail',
  templateUrl: './ss-product-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsProductDetail implements CanDeactivateComponent, OnInit, OnDestroy {
  public tabItems: MenuItem[];
  public activeTab: MenuItem;

  public item: any | null;
  public productForm!: FormGroup;
  private _productFormSaved: boolean;

  public userDataModel!: UserDataModel;

  private _confirmDeactivate$: Subject<boolean>;

  private _unsubscribe: Subject<void>;

  constructor(private _deleteManyFilesStorageService: SsDeleteManyFilesStorageService,
              private _productsRepositoryService: AttractionsRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _confirmationService: ConfirmationService,
              private _activatedRoute: ActivatedRoute,
              private _loaderService: SsLoaderService,
              private _toastService: MessageService,
              private _formBuilder: FormBuilder,
              private _cdr: ChangeDetectorRef,
              private _router: Router,
              public location: Location) {
    this.tabItems = [
      {label: 'Información', icon: 'pi pi-book'},
      {label: 'Opciones', icon: 'pi pi-fw pi-check-square'},
      {label: 'Locación', icon: 'pi pi-map'},
      {label: 'Galería', icon: 'pi pi-fw pi-images'}
    ];
    this.activeTab = this.tabItems[0];

    this.item = null;
    this.productForm = this._formBuilder.group({
      galleryForm: this._formBuilder.group({}),
      informationForm: this._formBuilder.group({}),
      optionsForm: this._formBuilder.group({})
    });
    this._productFormSaved = false;

    this._confirmDeactivate$ = new Subject();

    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._getProduct();
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public get informationForm(): FormGroup {
    return <FormGroup>this.productForm.get('informationForm');
  }

  public get optionsForm(): FormGroup {
    return <FormGroup>this.productForm.get('optionsForm');
  }

  public get galleryForm(): FormGroup {
    return <FormGroup>this.productForm.get('galleryForm');
  }

  public changeTab(target: any): void {
    switch (target.innerText) {
      case 'Información':
        this.activeTab = this.tabItems[0];
        break;

      case 'Opciones':
        this.activeTab = this.tabItems[1];
        break;

      case 'Locación':
        this.activeTab = this.tabItems[2];
        break;

      case 'Galería':
        this.activeTab = this.tabItems[3];
        break;
    }
  }

  public saveForm(): void {
    this._loaderService.show = true;
    const formValue: any = {
      gallery: this.galleryForm.value.imageIdList,
      ...this.informationForm.value,
      ...this.optionsForm.value
    };
    const item: any = {...this.item, ...formValue};

    if (item.id) {
      delete item.id;
      item.entitiesId.includes(this.userDataModel.entity.id) ? null : item.entitiesId.push(this.userDataModel.entity.id);
      this._editProduct(item);
    } else {
      item.entitiesId.push(this.userDataModel.entity.id);
      this._createProduct(item);
    }
  }

  private _editProduct(item: any): void {
    firstValueFrom(this._productsRepositoryService.update(item, this.item.id as string))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item editado',
          detail: item.name + ' se editó correctamente',
          life: 6000
        });

        const imageUrlListToDelete: string [] = this.galleryForm.value.removedImageIdList;
        this._removeImagesByUrlList(imageUrlListToDelete);

        this._productFormSaved = true;
        this._loaderService.show = false;
        this._router.navigate([`/dashboard/items/attractions`]);
      }).catch((error: any) => {
      this._toastService.add({
        severity: 'error',
        summary: 'Error editando',
        detail: 'Ocurrio un error al guardar el item',
        life: 6000
      });

      this._productFormSaved = false;
      this._loaderService.show = false;
      console.error(error);
    });
  }

  private _createProduct(item: any): void {
    firstValueFrom(this._productsRepositoryService.create(item))
      .then(() => {
        this._toastService.add({
          severity: 'success',
          summary: 'Item añadido',
          detail: item.name + ' se creó correctamente',
          life: 6000
        });

        const imageUrlListToDelete: string [] = this.galleryForm.value.removedImageIdList;
        this._removeImagesByUrlList(imageUrlListToDelete);

        this._productFormSaved = true;
        this._loaderService.show = false;
        this._router.navigate([`/dashboard/items/attractions`]);
      }).catch((error: any) => {
      this._toastService.add({
        severity: 'error',
        summary: 'Error creando',
        detail: 'Ocurrio un error al crear el item',
        life: 6000
      });

      this._productFormSaved = false;
      this._loaderService.show = false;
      console.error(error);
    });
  }

  private _removeImagesByUrlList(urlList: string []): void {
    if (urlList.length > 0) {
      this._deleteManyFilesStorageService.execute(urlList);
    }
  }

  private _getProduct(): void {
    if (this._activatedRoute.snapshot.params['id'] === 'new') {
      this.item = new Attraction();
    } else {
      firstValueFrom(this._productsRepositoryService.getById(this._activatedRoute.snapshot.params['id']))
        .then((product: any[]) => {
          this.item = product;

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
        this.userDataModel = userDataModel;

        this._cdr.markForCheck();
      });
  }

  public isFormValid(): boolean {
    return (this.informationForm.invalid);
  }

  public canDeactivate(): boolean | Observable<boolean> {
    if (!this.productForm.dirty ||
       (this.productForm.dirty && this._productFormSaved)) {
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
    const imagesUrlListToDelete: string [] = [...removedImageIdList, ...imageIdList];
    if (this.informationForm.value.photoUrl) {
      imagesUrlListToDelete.push(this.informationForm.value.photoUrl);
    }

    this._removeImagesByUrlList(imagesUrlListToDelete);
  }

  private _deleteUnconfirmedImagesOfUpdateForm(): void {
    const { photoUrl, gallery } = this.item;
    const confirmedOldImageUrlList: string [] = [photoUrl, ...gallery];

    const { removedImageIdList, imageIdList } = this.galleryForm.value;
    const actualImageUrlList: string [] = [...removedImageIdList, ...imageIdList];
    if (this.informationForm.value.photoUrl) {
      actualImageUrlList.push(this.informationForm.value.photoUrl);
    }

    const imagesUrlListToDelete: string [] = this._filterOnlyDiffImageUrls(confirmedOldImageUrlList, actualImageUrlList);
    this._removeImagesByUrlList(imagesUrlListToDelete);
  }

  private _filterOnlyDiffImageUrls(oldImageUrlList: string [], actualImageUrlList: string []): string [] {
    const imageUrlList: string [] = [];
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
