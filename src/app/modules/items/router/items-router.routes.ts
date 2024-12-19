import { Routes } from '@angular/router';

import { ItemDetail } from '../pages/item-detail/item-detail.page';
import { ItemsPage } from '../pages/items-page/items.page';
import { CheckDirtyFormGuard } from './guards/check-dirty-form.guard';

export const ITEMS_ROUTES: Routes = [
  {
    path: ':id',
    component: ItemsPage,
  },
  {
    path: ':moduleId/:id',
    component: ItemDetail,
    canDeactivate: [CheckDirtyFormGuard]
  }
];
