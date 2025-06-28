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

// Import des nouveaux composants
import { CourseListComponent } from './promoter/course-management/course-list/course-list.component';
import { SpecialtyListComponent } from './promoter/specialty-management/specialty-list/specialty-list.component';

// Ajout des nouveaux composants générés
import { ResultatsComponent } from './promoter/resultats/resultats.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { SystemSettingsComponent } from './admin/system-settings/system-settings.component';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { MyExamsComponent } from './candidate/my-exams/my-exams.component';
import { MyResultsComponent } from './candidate/my-results/my-results.component';
import { TrainingCentersComponent } from './admin/training-centers/training-centers.component';
import { ExamCentersComponent } from './admin/exam-centers/exam-centers.component';
import { ApplicationsComponent } from './admin/applications/applications.component';
import { ExamSessionComponent } from './admin/exam-session/exam-session.component';
import { ResultsComponent as AdminResultsComponent } from './admin/results/results.component';
import { SpecialitiesComponent } from './admin/specialities/specialities.component';
import { CandidateDashboardComponent } from './candidate/candidate-dashboard/candidate-dashboard.component';
import { ExamsCentersManagementComponent } from './staff/exams-centers-management/exams-centers-management.component';
import { ApplicationManagementComponent } from './staff/application-management/application-management.component';
import { SessionManagementComponent } from './staff/session-management/session-management.component';
import { ResultsManagementComponent } from './staff/results-management/results-management.component';
import { SpecialitiesManagementComponent } from './staff/specialities-management/specialities-management.component';
import { SystemStatisticsComponent } from './staff/system-statistics/system-statistics.component';
import { SystemLogsComponent } from './staff/system-logs/system-logs.component';
import { SystemBackupsComponent } from './staff/system-backups/system-backups.component';
import { MyCertificatesComponent } from './candidate/my-certificates/my-certificates.component';
import { MyPaymentsComponent } from './candidate/my-payments/my-payments.component';
import { PaymentGatewaysComponent } from './staff/payment-gateways/payment-gateways.component';
import { PromoterComponent } from './staff/promoter/promoter.component';

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
  { path: 'exams-centers-management', component: ExamsCentersManagementComponent },
  { path: 'application-management', component: ApplicationManagementComponent },
  { path: 'session-management', component: SessionManagementComponent },
  { path: 'results-management', component: ResultsManagementComponent },
  { path: 'specialities-management', component: SpecialitiesManagementComponent },
  { path: 'payment-gateway-management', component: PaymentGatewaysComponent }, 
  { path: 'promoter', component: PromoterComponent },// <-- Ajouté ici
 // { path: 'staff-statistics', component: StaffStatisticsComponent },

  //promoter
  { path: 'promoter-dashboard', component: PromoterDashboardComponent },
  { path: 'training-center-management', component: TrainingCenterManagementComponent },
  { path: 'training-center-details', component: TrainingCenterDetailsComponent },
  { path: 'campus-management', component: CampusManagementComponent },
  { path: 'my-candidates', component: MyCandidatesComponent },
  { path: 'my-notifications', component: MyNotificationsComponent },
  { path: 'promoter-results', component: ResultatsComponent },

  // Nouveaux chemins pour les fonctionnalités CRUD du promoteur
  { path: 'promoter/courses', component: CourseListComponent },
  
  
  { path: 'promoter/specialties', component: SpecialtyListComponent },


  //candidate
  { path: 'my-applications', component: MyApplicationsComponent },
  { path: 'my-exams', component: MyExamsComponent },
  { path: 'my-results', component: MyResultsComponent },
  { path: 'candidate-dashboard', component: CandidateDashboardComponent },

  //admin
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'system-settings', component: SystemSettingsComponent },
  { path: 'admin-statistics', component: StatisticsComponent },
  { path: 'admin-training-centers', component: TrainingCentersComponent },
  { path: 'exam-centers', component: ExamCentersComponent },
  { path: 'admin-applications', component: ApplicationsComponent },
  { path: 'exam-session', component: ExamSessionComponent },
  { path: 'admin-results', component: AdminResultsComponent },
  { path: 'specialities', component: SpecialitiesComponent },
  { path: 'system-statistics', component: SystemStatisticsComponent },
  { path: 'system-logs', component: SystemLogsComponent },
  { path: 'system-backups', component: SystemBackupsComponent },
  { path: 'my-certificates', component: MyCertificatesComponent },
  { path: 'my-payments', component: MyPaymentsComponent },
  { path: 'candidate-notifications', component: MyNotificationsComponent },

  //common
  { path: 'profile', component: ProfileComponent },
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