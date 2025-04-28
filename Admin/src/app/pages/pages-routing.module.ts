import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { DefaultComponent } from './dashboards/default/default.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { CardManagementComponent } from './card-management/card-management.component';
import { HelpSupportInquiryComponent } from './common/help-support-inquiry/help-support-inquiry.component';
import { ProfileComponent } from './contacts/profile/profile.component';
import { OverviewStaffComponent } from './staff/overview-staff/overview-staff.component';
import { TrainingCentersManagementComponent } from './staff/training-centers-management/training-centers-management.component';
import { CandidatesManagementComponent } from './staff/candidates-management/candidates-management.component';
import { StaffManagementComponent } from './staff/staff-management/staff-management.component';
import { PromoterDashboardComponent } from './promoter/promoter-dashboard/promoter-dashboard.component';
import { TrainingCenterManagementComponent } from './promoter/training-center-management/training-center-management.component';
import { CampusManagementComponent } from './promoter/campus-management/campus-management.component';
import { MyCandidatesComponent } from './promoter/my-candidates/my-candidates.component';
import { MyNotificationsComponent } from './promoter/my-notifications/my-notifications.component';
import { MyApplicationsComponent } from './candidate/my-applications/my-applications.component';
import { TrainingCenterDetailsComponent } from './promoter/training-center-management/training-center-details/training-center-details.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  { path: 'backend', redirectTo: 'card-management' },
  { path: 'dashboard', component: DefaultComponent },

  { path: 'card-management', component: CardManagementComponent },

  //staff
  { path: 'overview-staff', component: OverviewStaffComponent },
  { path: 'training-centers-management', component: TrainingCentersManagementComponent },
  { path: 'candidates-management', component: CandidatesManagementComponent },
  { path: 'staff-management', component: StaffManagementComponent },


  //promoter
  { path: 'promoter-dashboard', component: PromoterDashboardComponent },
  { path: 'training-center-management', component: TrainingCenterManagementComponent },
  { path: 'training-center-details', component: TrainingCenterDetailsComponent },

  { path: 'campus-management', component: CampusManagementComponent },
  { path: 'my-candidates', component: MyCandidatesComponent },





  //candidate
  { path: 'my-applications', component: MyApplicationsComponent },






  //common
  { path: 'profile', component: ProfileComponent },
  { path: 'my-notifications', component: MyNotificationsComponent },
  { path: 'help-and-support', component: HelpSupportInquiryComponent },
 


  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'filemanager', component: FilemanagerComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
