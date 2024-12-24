import SwiperCore, { EffectCards, SwiperOptions } from 'swiper';
SwiperCore.use([EffectCards]);

import { MenuItem, MessageService } from 'primeng/api';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { BannerRepositoryService } from 'src/app/modules/shared/services/banner.repository-service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UserDataModel } from 'src/app/modules/shared/models/user-data-model.model';
import { ConfigList } from 'src/framework/repository/config-list.model';

@Component({
  selector: 'banners-page',
  templateUrl: './banners.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersPage implements OnInit, OnDestroy {

  public bannerList: any[] | null;

  public items: MenuItem[];

  public swiperConfig: SwiperOptions;

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;

  constructor(private _bannerRepositoryService: BannerRepositoryService,
    private _userDataModelService: UserDataModelService,
    private _loaderService: LoaderService,
    private _toastService: MessageService,
    private _cdr: ChangeDetectorRef,
    private _router: Router) {
    this.bannerList = null;
    this._unsubscribe = new Subject<void>();

    this.swiperConfig = {
      slidesPerView: 1,
      navigation: false,
      scrollbar: { draggable: true },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      effect: 'cards'
    };

    this.items = [
      {
        icon: 'pi pi-pencil'
      },
      {
        icon: 'pi pi-refresh'
      },
      {
        icon: 'pi pi-trash'
      },
      {
        icon: 'pi pi-upload',
        routerLink: ['/fileupload']
      },
      {
        icon: 'pi pi-external-link',
        url: 'http://angular.io'
      }
    ];
  }

  ngOnInit(): void {
    this._userDataModelListener();
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public addBanner(): void {
    if (this.bannerList && this.bannerList.length >= 5) {
      // TODO: Cuando se agreguen suscripciones cambiar aqui el control de limite de productos
      this._toastService.add({
        severity: 'error',
        summary: 'Límite de banners alzanzado',
        detail: 'Contacta con servicio al cliente para ampliar tu suscripción',
        life: 6000
      });
    } else {
      this._router.navigate(['/dashboard/banners/new']);
    }
  }

  public updateAfterDelete() {
    this._getBanners();
  }

  private async _getBanners(): Promise<void> {
    try {
      this._loaderService.show = true;

      if (!this.userDataModel?.entity?.id) {
        console.warn('El ID de la entidad no está disponible.');
        this._loaderService.show = false;
        return;
      }

      const configList: ConfigList = this._getConfigList();

      const items: any = await firstValueFrom(this._bannerRepositoryService.getByQuerys(configList));

      this.bannerList = items;
    } catch (error) {
      console.error('Error al obtener los ítems:', error);
    } finally {
      this._cdr.markForCheck();
      this._loaderService.show = false;
    }
  }

  private _getConfigList() {
    let configList: ConfigList;

    if (this.userDataModel.role !== 'SUPERADMIN') {
      configList = {
        queryList: [
          {
            field: 'entitiesId',
            operation: 'array-contains-any',
            value: [this.userDataModel.entity.id]
          }
        ]
      };
    } else {
      configList = {};
    };

    return configList;
  }


  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel?.entity?.id) {
          this.userDataModel = userDataModel;

          this._getBanners();
        }

        this._cdr.markForCheck();
      });
  }
}
