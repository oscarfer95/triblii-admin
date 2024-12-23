import {AngularFireAuth} from '@angular/fire/compat/auth';

import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, switchMap, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _angularFireAuth: AngularFireAuth,
              private _router: Router) {
  }

  public canActivate(next: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this._angularFireAuth.authState
      .pipe(
        take(1),
        switchMap(async (authState: any) => {
          if (!authState) {
            this._router.navigate(['/public']);
            return false;
          }

          return true;
        })
      );
  }
}
