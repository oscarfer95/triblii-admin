import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  constructor(private _domSanitizer: DomSanitizer) {
  }

  public transform(value: string, type: SsSanitizeType): SsSanitizeSafeOutput {
    switch (type) {
      case 'html':
        return this._domSanitizer.bypassSecurityTrustHtml(value);

      case 'style':
        return this._domSanitizer.bypassSecurityTrustStyle(value);

      case 'script':
        return this._domSanitizer.bypassSecurityTrustScript(value);

      case 'url':
        return this._domSanitizer.bypassSecurityTrustUrl(value);

      case 'resourceUrl':
        return this._domSanitizer.bypassSecurityTrustResourceUrl(value);

      default:
        return this._domSanitizer.bypassSecurityTrustHtml(value);
    }
  }
}

export type SsSanitizeType = 'html' | 'resourceUrl' | 'script' | 'style' | 'url';
export type SsSanitizeSafeOutput = SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl;
