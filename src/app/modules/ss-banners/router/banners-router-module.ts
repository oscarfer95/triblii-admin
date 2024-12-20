import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {BANNER_ROUTES} from './banners-router.routes';

@NgModule({
  imports: [RouterModule.forChild(BANNER_ROUTES)],
  exports: [RouterModule]
})
export class SsRouterModule { }
