import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../services/services/authentication.service';
import { TokenService } from '../../../services/token/token.service';
import { ApplicationService } from '../../../services/services/application.service';
import { CourseService } from '../../../services/services/course.service';
import { SessionService } from '../../../services/services/session.service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent {
breadCrumbItems = [
    { label: 'Dashboard', active: true }
  ];

  // Stats data
  followUpStat = [
    { title: 'Applications', value: 0, icon: 'bx-file' },
    { title: 'Approved', value: 0, icon: 'bx-check-circle' },
    { title: 'Pending', value: 0, icon: 'bx-time-five' }
  ];

  // Table data
  displayedColumns: string[] = ['course', 'session', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modal controls
  showModal = false;
  isEditMode = false;
  processing = false;
  applicationForm: FormGroup;

  // User data
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private applicationService: ApplicationService,
    private courseService: CourseService,
    private sessionService: SessionService
  ) {
    this.applicationForm = this.fb.group({
      courseId: ['', Validators.required],
      sessionId: ['', Validators.required],
      motivationLetter: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUserInfo();
    this.loadApplications();
    this.loadStats();
  }

  get f() {
    return this.applicationForm.controls;
  }

  loadApplications(): void {
    // Load applications for the current candidate
    // This is a placeholder - you'll need to implement the actual service call
    const applications = [
      { 
        id: 1, 
        course: 'Web Development', 
        session: '2023 Fall', 
        status: 'APPROVED',
        motivationLetter: 'I want to learn web development'
      },
      { 
        id: 2, 
        course: 'Data Science', 
        session: '2023 Winter', 
        status: 'PENDING_REVIEW',
        motivationLetter: 'Interested in data analysis'
      }
    ];
    
    this.dataSource = new MatTableDataSource(applications);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadStats(): void {
    // Update stats based on applications
    this.followUpStat[0].value = this.dataSource.data.length;
    this.followUpStat[1].value = this.dataSource.data.filter(app => app.status === 'APPROVED').length;
    this.followUpStat[2].value = this.dataSource.data.filter(app => app.status === 'PENDING_REVIEW').length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.applicationForm.reset();
    this.showModal = true;
  }

  openEditModal(application: any): void {
    this.isEditMode = true;
    this.applicationForm.patchValue(application);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      return;
    }

    this.processing = true;
    const applicationData = this.applicationForm.value;

    if (this.isEditMode) {
      // Update existing application
      // Call your service here
      console.log('Updating application:', applicationData);
    } else {
      // Create new application
      this.applicationService.candidateAppliance({ body: applicationData }).subscribe({
        next: () => {
          this.loadApplications();
          this.loadStats();
          this.closeModal();
          this.processing = false;
        },
        error: (err) => {
          console.error('Error creating application:', err);
          this.processing = false;
        }
      });
    }
  }

  deleteApplication(application: any): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.processing = true;
      // Call your service here to delete the application
      console.log('Deleting application:', application.id);
      setTimeout(() => {
        this.loadApplications();
        this.loadStats();
        this.processing = false;
      }, 1000);
    }
  }

  // Additional methods for candidate dashboard
  viewApplicationDetails(application: any): void {
    // Navigate to application details or show in a modal
    console.log('Viewing application details:', application);
  }
}