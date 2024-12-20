import {MessageService} from 'primeng/api';

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Location} from '@angular/common';
import {firstValueFrom, Subject, takeUntil} from 'rxjs';

import {SsBannerRepositoryService} from 'src/app/modules/ss-shared/services/ss-banner.repository-service';
import {SsBanner} from 'src/app/modules/ss-shared/models/ss-banner.model';
import {BannerResponse} from 'src/app/modules/ss-shared/services/api/responses/banner.response';
import {SsLoaderService} from 'src/app/modules/ss-shared/services/ss-loader.service';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';

@Component({
  selector: 'ss-banner-detail',
  templateUrl: './ss-banner-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsBannerDetail implements OnInit, OnDestroy {

  public banner: any | null;

  public bannerForm!: FormGroup;

  public userDataModel!: UserDataModel;

  private _unsubscribe: Subject<void>;

  constructor(private _bannersRepositoryService: SsBannerRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _activatedRoute: ActivatedRoute,
              private _loaderService: SsLoaderService,
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

  public saveForm(): Promise<any> {
    this._loaderService.show = true;
    const formValue: any = { ...this.bannerForm.value };
    const newBanner: BannerResponse = {...this.banner, ...formValue};

    if (newBanner.id) {
      return firstValueFrom(this._bannersRepositoryService.update(newBanner, newBanner.id)).then(() => {
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
    } else {
      // newBanner.catalogueId = this.userDataModel.catalogueList[0].id;

      return firstValueFrom(this._bannersRepositoryService.create(newBanner)).then(() => {
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
  }

  private _getBanner(): void {
    if (this._activatedRoute.snapshot.params['id'] === 'new') {
      this.banner = new SsBanner();
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
