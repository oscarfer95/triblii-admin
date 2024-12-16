import {MessageService} from 'primeng/api';

import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'ss-qr',
  templateUrl: './ss-qr.component.html'
})
export class SsQrComponent implements OnInit {

  @Input()
  public qrData: any;

  public qrCodeDownloadLink: SafeUrl;

  constructor(private _toastService: MessageService,
              private _renderer2: Renderer2,
              private _router: Router) {
    this.qrData = null;
    this.qrCodeDownloadLink = '';
  }

  ngOnInit(): void {
  }

  public goToRoute(route: string): void {
    this._router.navigate([route]);
  }

  public onChangeURL(url: SafeUrl): void {
    this.qrCodeDownloadLink = url;
  }

  public sharedLink(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Compartir',
        url: this.qrData.link
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else {
      this._copyToClipboard();
    }
  }

  private _copyToClipboard(): void {
    if(this._isOS()) {
      const input: HTMLInputElement = this._renderer2.createElement('input');

      this._renderer2.setAttribute(input, 'value', this._router.url);
      this._renderer2.setAttribute(input, 'type', 'text ');

      let range = document.createRange();
      range.selectNodeContents(input);

      let selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      input?.setSelectionRange(0, 999999);
      document.execCommand("copy");
    } else {
      navigator.clipboard.writeText(this._router.url);
    };

    this._toastService.add({severity:'success', summary:'Link copiado al portapapeles!', detail:'', life: 3000});
  }

  private _isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }
}
