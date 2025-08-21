import { Routes } from '@angular/router';
import { Loginpage } from './pages/loginpage/loginpage';
import { Dashboard } from './pages/dashboard/dashboard';
import { Logistics } from './pages/logistics/logistics';

import { Report } from './pages/report/report';
import { Recyclebin } from './pages/recyclebin/recyclebin';
import { Setting } from './pages/setting/setting';
import { Intransit } from './pages/intransit/intransit';
// import { IntransitHistory } from './pages/history/intransitHistory/intransit-history/intransit-history';
// import { LogisticsHistory } from './pages/history/logisticsHistory/logistics-history/logistics-history';


export const routes: Routes = [
  { path: 'login', component: Loginpage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'logistics', component: Logistics },
  // { path: 'intransithistory', component: IntransitHistory },
  //  { path: 'logisticshistory', component: LogisticsHistory },
  { path: 'report', component: Report },
  { path: 'recyclebin', component: Recyclebin },
  { path: 'setting', component: Setting },
  { path: 'intransit', component: Intransit },
];
