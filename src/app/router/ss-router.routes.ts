import {ExtraOptions, Routes} from '@angular/router';

import {SsAuthGuard} from '../modules/ss-shared/guards/ss-auth.guard';

export const SS_MAIN_ROUTES: Routes = [
  {
    canActivate: [SsAuthGuard],
    path: 'dashboard',
    loadChildren: () => import('../modules/ss-dashboard/ss-dashboard.module')
      .then(m => m.SsDashboardModule)
  },
  {
    path: 'public',
    loadChildren: () => import('../modules/ss-auth/ss-auth.module')
      .then(m => m.SsAuthModule)
  },
  {
    path: '',
    redirectTo: 'dashboard/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard/home'
  }
];

export const SS_ROUTER_CONFIG: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'enabled'
};
