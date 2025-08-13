import { Routes } from '@angular/router';
import { Loginpage } from './pages/loginpage/loginpage';
import { Dashboard } from './pages/dashboard/dashboard';
import { Logistics } from './pages/logistics/logistics';
import { History } from './pages/history/history';
import { Report } from './pages/report/report';
import { Recyclebin } from './pages/recyclebin/recyclebin';
import { Setting } from './pages/setting/setting';

export const routes: Routes = [
  { path: 'login', component: Loginpage, },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'dashboard',component: Dashboard},
  {path:'logistics',component: Logistics},
  {path:'history',component: History},
  {path:'report',component: Report},
  {path:'recyclebin',component: Recyclebin},
  {path:'setting',component: Setting},
    
];


