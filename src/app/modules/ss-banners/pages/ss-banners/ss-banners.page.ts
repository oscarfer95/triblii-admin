import SwiperCore, { EffectCards, SwiperOptions } from 'swiper';
SwiperCore.use([EffectCards]);

import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {firstValueFrom, Subject, takeUntil} from 'rxjs';

import {SsBannerRepositoryService} from 'src/app/modules/ss-shared/services/ss-banner.repository-service';
import { Router } from '@angular/router';
import { SsLoaderService } from 'src/app/modules/ss-shared/services/ss-loader.service';
import { UserDataModelService } from 'src/app/modules/auth/storage/user-data-model.service';
import { UserDataModel } from 'src/app/modules/ss-shared/models/user-data-model.model';

@Component({
  selector: 'ss-banners-page',
  templateUrl: './ss-banners.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsBannersPage implements OnInit, OnDestroy {

  public bannerList: any[] | null;

  public items: MenuItem[];

  public swiperConfig: SwiperOptions;

  private _unsubscribe: Subject<void>;

  public userDataModel!: UserDataModel;

  constructor(private _bannerRepositoryService: SsBannerRepositoryService,
              private _userDataModelService: UserDataModelService,
              private _confirmationService: ConfirmationService,
              private _loaderService: SsLoaderService,
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

  public confirmDeleteProduct(banner: any): void {
    this._confirmationService.confirm({
      message: 'Seguro que deseas eliminar este banner?',
      header: 'Eliminar banner',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      closeOnEscape: true,
      dismissableMask: true,
      rejectButtonStyleClass: 'ss-button--clear ss-txt--black-lighten',
      acceptButtonStyleClass: 'ss-button--red',
      rejectIcon: 'asd',
      acceptIcon: 'asd',
      accept: () => {
        this._loaderService.show = true;

        try {
          this._deleteBanner(banner.id as string).then(() => {
            this._toastService.add({
              severity: 'success',
              summary: 'Banner eliminado',
              detail: 'El banner se eliminó correctamente',
              life: 6000
            });

            this._getBanners();

            this._loaderService.show = false;
          });
        } catch (error) {
          this._toastService.add({
            severity: 'error',
            summary: 'Error al eliminar',
            detail: 'Contacta con soporte',
            life: 6000
          });

          this._loaderService.show = false;
        }
      }
    });
  }

  private _deleteBanner(id: string): Promise<any> {
    return firstValueFrom(
      this._bannerRepositoryService.delete(id)
    );
  }

  private _getBanners(): void {
    // if (this.userDataModel.catalogueList.length > 0) {
    //   firstValueFrom(this._bannerRepositoryService.getByCatalogueId(this.userDataModel.catalogueList[0].id))
    //     .then((banners: any[]) => {
    //       this.bannerList = this._buildBannerList(banners);

    //       this._cdr.markForCheck();
    //     });
    //   }
  }

  private _buildBannerList(products: any []): any [] {
    const bannerList: any [] = [];

    products.forEach((product: any) => {
      bannerList?.push(product);
    });

    return bannerList;
  }

  private _userDataModelListener() {
    this._userDataModelService.userDataModelListener()
      .pipe(
        takeUntil(this._unsubscribe)
      )
      .subscribe((userDataModel: UserDataModel) => {
        if (userDataModel) {
          this.userDataModel = userDataModel;

          this._getBanners();
        }

        this._cdr.markForCheck();
      });
  }
}
