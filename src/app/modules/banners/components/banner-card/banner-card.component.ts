import { ChangeDetectionStrategy, Component, Input, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { BannerRepositoryService } from 'src/app/modules/shared/services/banner.repository-service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
@Component({
  selector: 'banner-card',
  templateUrl: './banner-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerCardComponent implements OnInit {

  @Input()
  public banner!: any;

  @Output()
  public bannerDeleted: EventEmitter<void>;

  constructor(private _bannerRepositoryService: BannerRepositoryService,
              private _confirmationService: ConfirmationService,
              private _loaderService: LoaderService,
              private _toastService: MessageService) {
    this.bannerDeleted = new EventEmitter<void>();
  }

  ngOnInit(): void {
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

            this.bannerDeleted.emit();

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
}
