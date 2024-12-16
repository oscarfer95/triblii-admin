import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

import {AttractionDetail} from '../../pages/attraction-detail/attraction-detail.page';

@Injectable({
  providedIn: 'root'
})
export class CheckDirtyFormGuard implements CanDeactivate<AttractionDetail> {
  public canDeactivate(
    component: AttractionDetail,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
