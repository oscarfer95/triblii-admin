import { Routes } from '@angular/router';

import { AccountPage } from '../pages/account-page/account.page';
import { UsersPage } from '../pages/users-page/users.page';
import { UserDetail } from '../pages/user-detail/user-detail.page';
import { EntitiesPage } from '../pages/entities-page/entities-page.page';
import { LogsPage } from '../pages/logs-page/logs-page.page';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'user-entity',
    component: AccountPage
  },
  {
    path: 'logs',
    component: LogsPage
  },
  {
    path: 'users',
    component: UsersPage
  },
  {
    path: 'entities',
    component: EntitiesPage
  },
  {
    path: 'users/:id',
    component: UserDetail
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
