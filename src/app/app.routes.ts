import { Routes } from '@angular/router';
import { Services } from './Components/services/services';
import { Events } from './Components/events/events';
import { Dashboard } from './Components/dashboard/dashboard';
import { NotFound } from './Components/not-found/not-found';
import { AddEvent } from './Components/add-event/add-event';
import { AddService } from './Components/add-service/add-service';
import { Users } from './Components/users/users';
import { AddUser } from './Components/add-user/add-user';
import { Login } from './Components/login/login';
import { AuthGuard } from './Guards/auth-guard';
import { Layout } from './Components/layout/layout';
import { UsersMessages } from './Components/users-messages/users-messages';
import { Categories } from './Components/categories/categories';
import { AddCategory } from './Components/add-category/add-category';
import { Lessons } from './Components/lessons/lessons';
import { Settings } from './Components/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: 'layout',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
      { path: 'users', component: Users, title: 'Users' },
      { path: 'addUser', component: AddUser, title: 'Add User' },
      { path: 'editUser/:id', component: AddUser, title: 'Edit User' },
      { path: 'categories', component: Categories, title: 'Categories' },
      { path: 'addCategory', component: AddCategory, title: 'Add Category' },
      { path: 'editCategory/:id', component: AddCategory, title: 'Edit Category' },
      { path: 'services', component: Services, title: 'Services' },
      { path: 'addService', component: AddService, title: 'Add Service' },
      { path: 'editService/:id', component: AddService, title: 'Edit Service' },
      { path: 'events', component: Events, title: 'Events' },
      { path: 'addEvent', component: AddEvent, title: 'Add Event' },
      { path: 'editEvent/:id', component: AddEvent, title: 'Edit Event' },
      { path: 'usersMessages', component: UsersMessages, title: 'Users Messages' },
      {path: 'settings', component: Settings, title: 'Settings' },
      { path: 'lessons', component: Lessons, title: 'Lessons' },
    ],
  },

  { path: '**', component: NotFound, title: '404 - Page Not Found' },
];
