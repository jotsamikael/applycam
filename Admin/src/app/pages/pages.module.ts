import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { CryptoModule } from './crypto/crypto.module';
import { EmailModule } from './email/email.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ContactsModule } from './contacts/contacts.module';
import { BlogModule } from "./blog/blog.module";
import { UtilityModule } from './utility/utility.module';
import { UiModule } from './ui/ui.module';
import { FormModule } from './form/form.module';
import { TablesModule } from './tables/tables.module';
import { IconsModule } from './icons/icons.module';
import { ChartModule } from './chart/chart.module';
import { CalendarComponent } from './calendar/calendar.component';
import { MapsModule } from './maps/maps.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';

import { FilemanagerComponent } from './filemanager/filemanager.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { CardManagementComponent } from './card-management/card-management.component';
import { OverviewStaffComponent } from './staff/overview-staff/overview-staff.component';
import { TrainingCentersManagementComponent } from './staff/training-centers-management/training-centers-management.component';
import { CandidatesManagementComponent } from './staff/candidates-management/candidates-management.component';
import { StaffManagementComponent } from './staff/staff-management/staff-management.component';
import { ProfileComponent } from './common/profile/profile.component';
import { HelpSupportInquiryComponent } from './common/help-support-inquiry/help-support-inquiry.component';
import { TrainingCenterManagementComponent } from './promoter/training-center-management/training-center-management.component';
import { PromoterDashboardComponent } from './promoter/promoter-dashboard/promoter-dashboard.component';
import { MyNotificationsComponent } from './promoter/my-notifications/my-notifications.component';
import { MyCandidatesComponent } from './promoter/my-candidates/my-candidates.component';
import { CampusManagementComponent } from './promoter/campus-management/campus-management.component';
import { MyApplicationsComponent } from './candidate/my-applications/my-applications.component';
import { TrainingCenterDetailsComponent } from './promoter/training-center-management/training-center-details/training-center-details.component';
import { CourseListComponent } from './promoter/course-management/course-list/course-list.component';
import { SpecialtyListComponent } from './promoter/specialty-management/specialty-list/specialty-list.component';
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
import { ResultsComponent } from './admin/results/results.component';
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

@NgModule({
  declarations: [
    CalendarComponent, 
    ChatComponent, 
    FilemanagerComponent,
    CardManagementComponent, 
    OverviewStaffComponent, 
    TrainingCentersManagementComponent, 
    CandidatesManagementComponent, 
    StaffManagementComponent, 
    ProfileComponent, 
    HelpSupportInquiryComponent, 
    TrainingCenterManagementComponent, 
    PromoterDashboardComponent, 
    MyNotificationsComponent, 
    MyCandidatesComponent, 
    CampusManagementComponent, 
    MyApplicationsComponent, 
    TrainingCenterDetailsComponent, 
    CourseListComponent, 
    SpecialtyListComponent, 
    ResultatsComponent, 
    AdminDashboardComponent, 
    UserManagementComponent, 
    SystemSettingsComponent, 
    StatisticsComponent, 
    MyExamsComponent, 
    MyResultsComponent, 
    TrainingCentersComponent, 
    ExamCentersComponent, 
    ApplicationsComponent, 
    ExamSessionComponent, 
    ResultsComponent, 
    SpecialitiesComponent, 
    CandidateDashboardComponent, 
    ExamsCentersManagementComponent, 
    ApplicationManagementComponent, 
    SessionManagementComponent, 
    ResultsManagementComponent, 
    SpecialitiesManagementComponent,
    SystemStatisticsComponent,
    SystemLogsComponent,
    SystemBackupsComponent,
    MyCertificatesComponent,
    MyPaymentsComponent,
  ],
  imports: [
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule, 
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    CryptoModule,
    EcommerceModule,
    EmailModule,
    InvoicesModule,
    HttpClientModule,
    ProjectsModule,
    UIModule,
    TasksModule,
    ContactsModule,
    BlogModule,
    UtilityModule,
    UiModule,
    FormModule,
    TablesModule,
    IconsModule,
    ChartModule,
    WidgetModule,
    MapsModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule
  ],
})
export class PagesModule { }