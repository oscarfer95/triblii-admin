import {ExtraOptions, Routes} from '@angular/router';

import {AuthGuard} from '../modules/shared/guards/auth.guard';

export const MAIN_ROUTES: Routes = [
  {
    canActivate: [AuthGuard],
    path: 'dashboard',
    loadChildren: () => import('../modules/dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'public',
    loadChildren: () => import('../modules/auth/auth.module')
      .then(m => m.AuthModule)
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

export const ROUTER_CONFIG: ExtraOptions = {
  initialNavigation: 'enabled',
  scrollPositionRestoration: 'enabled'
};
