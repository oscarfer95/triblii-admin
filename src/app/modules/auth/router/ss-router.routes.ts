import {Routes} from '@angular/router';

import {SsLoginPage} from '../pages/ss-login/ss-login.page';

export const SS_AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: SsLoginPage
    },
    {
      path: '',
      redirectTo: 'login'
    }
];
