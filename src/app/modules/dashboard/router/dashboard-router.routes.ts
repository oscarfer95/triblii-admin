import { Routes } from '@angular/router';

import { DashboardPage } from '../pages/dashboard/dashboard.page';
import { AnnouncementComponent } from '../../shared/components/announcement/announcement.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../../home/home.module')
          .then((module: any) => module.HomeModule)
      },
      {
        path: 'items',
        loadChildren: () => import('../../items/items.module')
          .then((module: any) => module.ItemsModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../../account/account.module')
          .then((module: any) => module.AccountModule)
      },
      {
        path: 'banners',
        loadChildren: () => import('../../banners/banners.module')
          .then((module: any) => module.BannersModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../../statistics/statistics.module')
          .then((module: any) => module.StatisticsModule)
      },
      {
        path: 'locations',
        loadChildren: () => import('../../locations/locations.module')
          .then((module: any) => module.LocationsModule)
      },
      {
        path: 'coming-soon',
        component: AnnouncementComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];
