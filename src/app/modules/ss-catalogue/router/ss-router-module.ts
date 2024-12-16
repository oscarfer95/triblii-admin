import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TT_CATALOGUE_ROUTES} from './ss-router.routes';

@NgModule({
  imports: [RouterModule.forChild(TT_CATALOGUE_ROUTES)],
  exports: [RouterModule]
})
export class SsCatalogueRouterModule { }
