import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {SsAuthService} from 'src/app/modules/ss-auth/service/ss-auth.service';

@Component({
  selector: 'ss-navbar',
  templateUrl: './ss-navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SsNavbarComponent implements OnInit, OnDestroy {

  @Output()
  public clickMenuButton: EventEmitter<void>;

  constructor(private _ssAuthService: SsAuthService,
              private _router: Router) {
    this.clickMenuButton = new EventEmitter();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public onClickMenuButton(): void {
    this.clickMenuButton.emit();
  }

  public logout(): void {
    this._ssAuthService.logout()
      .then(() => {
        this._router.navigate(['/public/login']);
      });
  }
}
