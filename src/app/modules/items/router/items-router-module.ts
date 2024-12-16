import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ITEMS_ROUTES } from './items-router.routes';

@NgModule({
  imports: [RouterModule.forChild(ITEMS_ROUTES)],
  exports: [RouterModule]
})
export class ItemsRouterModule { }
