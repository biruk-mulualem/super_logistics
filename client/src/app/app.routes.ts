import { Routes } from '@angular/router';
import { Loginpage } from './pages/loginpage/loginpage';
import { Dashboard } from './pages/dashboard/dashboard';
import { Logistics } from './pages/logistics/logistics';
import { Recyclebin } from './pages/recyclebin/recyclebin';
import { Setting } from './pages/setting/setting';
import { Intransit } from './pages/intransit/intransit';
import { DoneintransitHistory } from './pages/history/doneintransit-history/doneintransit-history';
import { DonelogisticsHistory } from './pages/history/donelogistics-history/donelogistics-history';
import { CanclledlogisticsHistory } from './pages/history/canclledlogistics-history/canclledlogistics-history';
import { CancelledIntransitHistory } from './pages/history/canclledintransit-history/canclledintransit-history';
import { IntransitCancelledResolverService } from './services/resolver/intransit/intransitCancelled/intransitcancelled-resolver.service';
import { IntransitDoneResolverService } from './services/resolver/intransit/intransitDone/intransitdone-resolver.service';
import { IntransitResolverService } from './services/resolver/intransit/intransit/intransit-resolver.service';
import { LogisticsResolverService } from './services/resolver/logistics/logistics/logistics-resolver.service';
import { LogisticsCancelledResolverService } from './services/resolver/logistics/logisticscancell/logisticscancelled-resolver.service';
import { LogisticsDoneResolverService } from './services/resolver/logistics/logisticsdone/logisticsdone-resolver.service';
import { AuthGuard } from '../auth.guard';
import { IntransitReport } from './pages/report/intransit-report/intransit-report';
import { LogisticsReport } from './pages/report/logistics-report/logistics-report';



export const routes: Routes = [
  { path: 'login', component: Loginpage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard,
    //  canActivate: [AuthGuard] 
    },

  {
    path: 'logistics',
    component: Logistics,
    // canActivate: [AuthGuard],
    resolve: { tableData: LogisticsResolverService },
  },
  {
    path: 'intransit',
    component: Intransit,
    // canActivate: [AuthGuard],
    resolve: { tableData: IntransitResolverService },
  },
  {
    path: 'doneintransithistory',
    component: DoneintransitHistory,
    // canActivate: [AuthGuard],
    resolve: { tableData: IntransitDoneResolverService },
  },
  {
    path: 'cancelledintransithistory',
    component: CancelledIntransitHistory,
    // canActivate: [AuthGuard],
    resolve: { tableData: IntransitCancelledResolverService },
  },
  {
    path: 'cancelledlogisticshistory',
    component: CanclledlogisticsHistory,
    // canActivate: [AuthGuard],
    resolve: { tableData: LogisticsCancelledResolverService },
  },
  {
    path: 'donelogisticshistory',
    component: DonelogisticsHistory,
    // canActivate: [AuthGuard],
    resolve: { tableData: LogisticsDoneResolverService },
  },

  { path: 'logisticsreport', component: LogisticsReport, 
    // canActivate: [AuthGuard]
   },
     { path: 'intransitreport', component: IntransitReport, 
    // canActivate: [AuthGuard]
   },
  { path: 'recyclebin', component: Recyclebin,
    //  canActivate: [AuthGuard] 
    },
  { path: 'setting', component: Setting,
    //  canActivate: [AuthGuard]
     },
];
