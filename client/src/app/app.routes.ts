import { Routes } from '@angular/router';
import { Loginpage } from './pages/loginpage/loginpage';
import { Dashboard } from './pages/dashboard/dashboard';
import { Logistics } from './pages/logistics/logistics';

import { Report } from './pages/report/report';
import { Recyclebin } from './pages/recyclebin/recyclebin';
import { Setting } from './pages/setting/setting';
import { Intransit } from './pages/intransit/intransit';
import { DoneintransitHistory } from './pages/history/doneintransit-history/doneintransit-history';
import { DonelogisticsHistory } from './pages/history/donelogistics-history/donelogistics-history';


import { CanclledlogisticsHistory } from './pages/history/canclledlogistics-history/canclledlogistics-history';
import { CancelledIntransitHistory } from './pages/history/canclledintransit-history/canclledintransit-history';



export const routes: Routes = [
  { path: 'login', component: Loginpage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'logistics', component: Logistics },
  { path: 'doneintransithistory', component: DoneintransitHistory },
   { path: 'donelogisticshistory', component: DonelogisticsHistory },
   { path: 'cancelledintransithistory', component: CancelledIntransitHistory },
   { path: 'cancelledlogisticshistory', component: CanclledlogisticsHistory },
  { path: 'report', component: Report },
  { path: 'recyclebin', component: Recyclebin },
  { path: 'setting', component: Setting },
  { path: 'intransit', component: Intransit },
];
