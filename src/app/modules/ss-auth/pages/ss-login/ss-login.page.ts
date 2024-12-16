import {ChangeDetectionStrategy, Component, Type, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {DialogService , DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {firstValueFrom} from 'rxjs';
import {SsResetPasswordFormComponent} from 'src/app/modules/ss-catalogue/components/ss-reset-password-form/ss-reset-password-form.component';
import {SwiperOptions} from 'swiper';

import {SsAuthService} from '../../service/ss-auth.service';

@Component({
  selector: 'ss-login',
  templateUrl: './ss-login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService]
})
export class SsLoginPage implements OnInit {

  public images: any[];

  public swiperConfig: SwiperOptions;

  constructor(private _ssAuthService: SsAuthService,
              private _dialogService: DialogService,
              private _router: Router) {
    this.swiperConfig = {
      slidesPerView: 1,
      navigation: false,
      scrollbar: { draggable: true },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      effect: 'slide',
      autoplay: {
        delay: 4000,
        disableOnInteraction: true
      }
    };

    this.images = [
      {
        src: 'https://images.pexels.com/photos/7289716/pexels-photo-7289716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        src: 'https://images.pexels.com/photos/5699182/pexels-photo-5699182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        src: 'https://images.pexels.com/photos/14059722/pexels-photo-14059722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        src: 'https://cdn.pixabay.com/photo/2018/04/13/11/14/shoes-3316260_960_720.jpg'
      },
      {
        src: 'https://cdn.pixabay.com/photo/2013/01/29/10/45/jams-76547_960_720.jpg'
      }
    ];
  }

  public ngOnInit(): void {
    this._redirectIfUserIsAuthenticated();
  }

  public openResetPasswordModal(): void {
    const component: Type<any> = SsResetPasswordFormComponent;
    const dialogConfig: DynamicDialogConfig = {
      data: {
        email: ''
      },
      styleClass: 'p-dialog-center-content'
    };

    const dialogRef: DynamicDialogRef = this._dialogService.open(component, dialogConfig);
  }

  public openWhatsApp(): void {
    const number = "59164942593";

    const whatsAppBaseUrl = 'https://api.whatsapp.com';
    const numberUrl = '/send?phone=' + number;
    const messageUrl ='&text=';
    const message = 'Hola ShoppyStore 👋';

    window.open(whatsAppBaseUrl + numberUrl + messageUrl + encodeURIComponent(message));
  }

  private _redirectIfUserIsAuthenticated(): void {
    firstValueFrom(this._ssAuthService.getAuth())
      .then((isAuth: boolean) => {
        if (isAuth) {
          this._router.navigate(['/dashboard']);
        }
      });
  }
}
