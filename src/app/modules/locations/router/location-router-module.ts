import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LOCATION_ROUTES} from './location-router.routes';

@NgModule({
  imports: [RouterModule.forChild(LOCATION_ROUTES)],
  exports: [RouterModule]
})
export class LocationRouterModule { }
