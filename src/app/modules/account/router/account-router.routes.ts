import { Routes } from '@angular/router';

import { AccountPage } from '../pages/account-page/account.page';
import { UsersPage } from '../pages/users-page/users.page';
import { UserDetail } from '../pages/user-detail/user-detail.page';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: 'user-entity',
    component: AccountPage
  },
  {
    path: 'users',
    component: UsersPage
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
