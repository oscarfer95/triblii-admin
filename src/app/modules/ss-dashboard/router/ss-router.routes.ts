import {Routes} from '@angular/router';

import {SsDashboardPage} from '../pages/ss-dashboard/ss-dashboard.page';
import {SsAnnouncementComponent} from '../../ss-shared/components/ss-announcement/ss-announcement.component';

export const TT_DASHBOARD_ROUTES: Routes = [
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
        loadChildren: () => import('../../ss-products/ss-products.module')
          .then((module: any) => module.SsProductsModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../../ss-catalogue/ss-catalogue.module')
          .then((module: any) => module.SsCatalogueModule)
      },
      {
        path: 'banners',
        loadChildren: () => import('../../ss-banners/ss-banners.module')
          .then((module: any) => module.SsBannersModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../../ss-statistics/ss-statistics.module')
          .then((module: any) => module.SsStatisticsModule)
      },
      {
        path: 'locations',
        loadChildren: () => import('../../ss-locations/ss-locations.module')
          .then((module: any) => module.SsLocationModule)
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
