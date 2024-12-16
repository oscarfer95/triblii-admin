import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

import {SsProductDetail} from '../../pages/ss-product-detail/ss-product-detail.page';

@Injectable({
  providedIn: 'root'
})
export class CheckDirtyFormGuard implements CanDeactivate<SsProductDetail> {
  public canDeactivate(
    component: SsProductDetail,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
