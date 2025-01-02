import { Routes } from '@angular/router';

import { ItemDetail } from '../pages/item-detail/item-detail.page';
import { ItemsPage } from '../pages/items-page/items.page';
import { CheckDirtyFormGuard } from './guards/check-dirty-form.guard';
import { CategoriesPage } from '../pages/categories-page/categories-page.page';
import { TagsPage } from '../pages/tags-page/tags-page.page';

export const ITEMS_ROUTES: Routes = [
  {
    path: ':id',
    component: ItemsPage,
  },
  {
    path: ':moduleId/:id',
    component: ItemDetail,
    canDeactivate: [CheckDirtyFormGuard]
  },
  {
    path: 'superadmin/module/categories',
    component: CategoriesPage
  },
  {
    path: 'superadmin/module/tags',
    component: TagsPage
  }
];
