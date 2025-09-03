import { Routes } from '@angular/router';
import { Loginpage } from './app/pages/loginpage/loginpage';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Logistics } from './app/pages/logistics/logistics';
import { Report } from './app/pages/report/report';
import { Recyclebin } from './app/pages/recyclebin/recyclebin';
import { Setting } from './app/pages/setting/setting';
import { Intransit } from './app/pages/intransit/intransit';

import { DoneintransitHistory } from './app/pages/history/doneintransit-history/doneintransit-history';
import { DonelogisticsHistory } from './app/pages/history/donelogistics-history/donelogistics-history';
import { CanclledlogisticsHistory } from './app/pages/history/canclledlogistics-history/canclledlogistics-history';
import { CancelledIntransitHistory } from './app/pages/history/canclledintransit-history/canclledintransit-history';

import { IntransitCancelledResolverService } from './app/services/resolver/intransit/intransitCancelled/intransitcancelled-resolver.service';
import { IntransitDoneResolverService } from './app/services/resolver/intransit/intransitDone/intransitdone-resolver.service';
import { IntransitResolverService } from './app/services/resolver/intransit/intransit/intransit-resolver.service';

import { LogisticsResolverService } from './app/services/resolver/logistics/logistics/logistics-resolver.service';
import { LogisticsCancelledResolverService } from './app/services/resolver/logistics/logisticscancell/logisticscancelled-resolver.service';
import { LogisticsDoneResolverService } from './app/services/resolver/logistics/logisticsdone/logisticsdone-resolver.service';

export const routes: Routes = [
  { path: 'login', component: Loginpage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },

  {
    path: 'logistics',
    component: Logistics,
    resolve: { tableData: LogisticsResolverService }, // ✅ use resolver
  },
  {
    path: 'intransit',
    component: Intransit,
    resolve: { tableData: IntransitResolverService }, // ✅ use resolver
  },
  {
    path: 'doneintransithistory',
    component: DoneintransitHistory,
    resolve: { tableData: IntransitDoneResolverService }, // ✅ use resolver
  },
  {
    path: 'cancelledintransithistory',
    component: CancelledIntransitHistory,
    resolve: { tableData: IntransitCancelledResolverService }, // ✅ use resolver
  },
  {
    path: 'cancelledlogisticshistory',
    component: CanclledlogisticsHistory,
    resolve: { tableData: LogisticsCancelledResolverService }, // ✅ use resolver
  },
  {
    path: 'donelogisticshistory',
    component: DonelogisticsHistory,
    resolve: { tableData: LogisticsDoneResolverService }, // ✅ use resolver
  },

  { path: 'report', component: Report },
  { path: 'recyclebin', component: Recyclebin },
  { path: 'setting', component: Setting },
];
