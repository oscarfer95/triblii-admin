import {Routes} from '@angular/router';

import {AttractionDetail} from '../pages/attraction-detail/attraction-detail.page';
import {ItemsPage} from '../pages/items-page/items.page';
import {CheckDirtyFormGuard} from './guards/check-dirty-form.guard';

export const ITEMS_ROUTES: Routes = [
  {
    path: ':id',
    component: ItemsPage,
  },
  {
    path: 'attractions/:id',
    component: AttractionDetail,
    canDeactivate: [CheckDirtyFormGuard]
  },
  {
    path: 'restaurants/:id',
    component: AttractionDetail,
    canDeactivate: [CheckDirtyFormGuard]
  }
];
