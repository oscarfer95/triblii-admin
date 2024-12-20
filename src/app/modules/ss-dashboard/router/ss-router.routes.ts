import { Routes } from '@angular/router';

import { SsDashboardPage } from '../pages/ss-dashboard/ss-dashboard.page';
import { SsAnnouncementComponent } from '../../ss-shared/components/ss-announcement/ss-announcement.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: SsDashboardPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../../ss-home/ss-home.module')
          .then((module: any) => module.SsHomeModule)
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
        loadChildren: () => import('../../ss-banners/banners.module')
          .then((module: any) => module.BannersModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../../statistics/statistics.module')
          .then((module: any) => module.StatisticsModule)
      },
      {
        path: 'coming-soon',
        component: SsAnnouncementComponent
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
