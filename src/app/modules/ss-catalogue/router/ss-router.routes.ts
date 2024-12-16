import {Routes} from '@angular/router';

import {SsAnnouncementComponent} from '../../ss-shared/components/ss-announcement/ss-announcement.component';
import {SsCataloguePage} from '../pages/ss-catalogue-page/ss-catalogue-page.page';

export const TT_CATALOGUE_ROUTES: Routes = [
  {
    path: '',
    component: SsCataloguePage
  }
];
