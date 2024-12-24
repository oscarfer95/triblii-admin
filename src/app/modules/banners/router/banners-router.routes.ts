import { Routes } from '@angular/router';
import { BannersPage } from '../pages/banners/banners.page';
import { BannerDetail } from '../pages/banner-detail/banner-detail.page';


export const BANNER_ROUTES: Routes = [
  {
    path: '',
    component: BannersPage,
  },
  {
    path: ':id',
    component: BannerDetail,
  }
];
