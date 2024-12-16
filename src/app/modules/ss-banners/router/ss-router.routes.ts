import { Routes } from '@angular/router';

import { SsBannerDetail } from '../pages/ss-banner-detail/ss-banner-detail.page';
import { SsBannersPage } from '../pages/ss-banners/ss-banners.page';

export const SS_BANNER_ROUTES: Routes = [
  {
    path: '',
    component: SsBannersPage,
  },
  {
    path: ':id',
    component: SsBannerDetail,
  }
];
