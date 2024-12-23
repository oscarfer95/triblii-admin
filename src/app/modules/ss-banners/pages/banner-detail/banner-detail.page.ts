import { MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { BannerRepositoryService } from 'src/app/modules/ss-shared/services/banner.repository-service';
import { Banner } from 'src/app/modules/ss-shared/models/banner.model';
import { BannerResponse } from 'src/app/modules/ss-shared/services/api/responses/banner.response';
import { LoaderService } from 'src/app/modules/ss-shared/services/loader.service';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';

@Component({
  selector: 'banner-detail',
  templateUrl: './banner-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerDetail implements OnInit, OnDestroy {

  public banner: any | null;

  public bannerForm!: FormGroup;

  public userDataModel!: UserDataModel;

  private _unsubscribe: Subject<void>;

  constructor(private _bannersRepositoryService: BannerRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _activatedRoute: ActivatedRoute,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    public location: Location) {
    this.banner = null;

    this.bannerForm = this._formBuilder.group({});

    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._getBanner();
    this._userDataModelListener();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public async saveForm(): Promise<any> {
    this._loaderService.show = true;
    const formValue: any = { ...this.bannerForm.value };
    const banner: any = { ...this.banner, ...formValue };

    if (banner.id) {
      banner?.entitiesId.includes(this.userDataModel.entity.id) ? null : banner?.entitiesId?.push(this.userDataModel.entity.id);
      this._editBanner(banner, banner.id);
    } else {
      banner?.entitiesId?.push(this.userDataModel.entity.id);
      this._createBanner(banner);
    }
    console.log(banner);
    
  }

  private async _editBanner(banner: any, id: string): Promise<any> {
    delete banner.id;
    return firstValueFrom(this._bannersRepositoryService.update(banner, id)).then(() => {
      this._loaderService.show = false;
      this._toastService.add({
        severity: 'success',
        summary: 'Banner editado',
        detail: 'El banner se editó correctamente',
        life: 6000
      });

      this._router.navigate(['/dashboard/banners']);
    }).catch((error: any) => {
      this._loaderService.show = false;
      this._toastService.add({
        severity: 'error',
        summary: 'Error editando banner',
        detail: 'Ocurrio un error al guardar el banner',
        life: 6000
      });

      console.error(error);
    });
  }

  private async _createBanner(banner: any): Promise<any> {
    return firstValueFrom(this._bannersRepositoryService.create(banner)).then(() => {
      this._loaderService.show = false;
      this._toastService.add({
        severity: 'success',
        summary: 'Banner añadido',
        detail: 'El banner se creó correctamente',
        life: 6000
      });

      this._router.navigate(['/dashboard/banners']);
    }).catch(() => {
      this._loaderService.show = false;
      this._toastService.add({
        severity: 'error',
        summary: 'Error creando banner',
        detail: 'Ocurrio un error al crear el banner',
        life: 6000
      });
    });
  }

  private _getBanner(): void {
    if (this._activatedRoute.snapshot.params['id'] === 'new') {
      this.banner = new Banner();
    } else {
      firstValueFrom(this._bannersRepositoryService.getById(this._activatedRoute.snapshot.params['id']))
        .then((banner: BannerResponse) => {
          this.banner = banner;

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
    return (this.bannerForm.invalid);
  }
}
