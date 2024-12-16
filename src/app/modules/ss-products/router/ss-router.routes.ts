import {Routes} from '@angular/router';

import {SsProductDetail} from '../pages/ss-product-detail/ss-product-detail.page';
import {ItemsPage} from '../pages/ss-products/items.page';
import {CheckDirtyFormGuard} from './guards/check-dirty-form.guard';

export const SS_USERS_ROUTES: Routes = [
  {
    path: ':id',
    component: ItemsPage,
  },
  {
    path: 'attractions/:id',
    component: SsProductDetail,
    canDeactivate: [CheckDirtyFormGuard]
  },
  {
    path: 'restaurants/:id',
    component: SsProductDetail,
    canDeactivate: [CheckDirtyFormGuard]
  }
];
