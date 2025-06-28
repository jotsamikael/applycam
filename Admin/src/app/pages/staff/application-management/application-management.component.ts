import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ApplicationService } from '../../../services/services/application.service';
import { ApplicationRequest } from '../../../services/models/application-request';

@Component({
  selector: 'app-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.scss']
})
export class ApplicationManagementComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Applications Management', active: true }
  ];

  followUpStat = [
    { title: 'Total Applications', value: 0, icon: 'assignment' },
    { title: 'Submitted', value: 0, icon: 'check-circle' },
    { title: 'Drafts', value: 0, icon: 'edit' }
  ];

  displayedColumns: string[] = ['lastName', 'firstName', 'email', 'examType', 'speciality', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  processing = false;
  modalRef?: BsModalRef;
  CreateApplicationForm!: FormGroup;
  selectedApplication: any = null;
  specialities: { id: string, name: string }[] = [
    { id: 'info', name: 'Informatique' },
    { id: 'math', name: 'Mathématiques' },
    { id: 'phy', name: 'Physique' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadApplications();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm() {
    this.CreateApplicationForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.maxLength(64)]],
      firstName: ['', [Validators.required, Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,}$/)]],
      sex: ['', [Validators.required]],
      academicLevel: ['', [Validators.required]],
      examType: ['', [Validators.required]],
      speciality: ['', [Validators.required]],
      applicationRegion: ['', [Validators.required]],
      regionOrigins: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      nationIdNumber: ['', [Validators.required]],
      fatherFullname: ['', [Validators.required]],
      fatherProfession: ['', [Validators.required]],
      motherFullname: ['', [Validators.required]],
      motherProfession: ['', [Validators.required]],
      trainingCenterAcronym: ['', [Validators.required]],
      freeCandidate: [false],
      repeatCandidate: [false],
      sessionYear: ['', [Validators.required]]
    });
  }

  get f() {
    return this.CreateApplicationForm.controls;
  }

  // CRUD adapté à l'état actuel du service (seul le POST est disponible)
  loadApplications() {
    // Pas de méthode GET côté service : on utilise des données mockées
    const mockApplications = [
      {
        id: 1,
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@email.com',
        examType: 'CQP',
        speciality: 'Informatique',
        status: 'DRAFT'
      }
    ];
    this.dataSource.data = mockApplications;
    this.updateStats();
  }

  updateStats() {
    this.followUpStat[0].value = this.dataSource.data.length;
    this.followUpStat[1].value = this.dataSource.data.filter(a => a.status === 'SUBMITTED').length;
    this.followUpStat[2].value = this.dataSource.data.filter(a => a.status === 'DRAFT').length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateNewModal() {
    this.selectedApplication = null;
    this.CreateApplicationForm.reset();
    this.modalRef = this.modalService.show('addNew');
  }

  createNewApplication() {
    if (this.CreateApplicationForm.invalid) return;
    this.processing = true;
    const formValue: ApplicationRequest = this.CreateApplicationForm.value;
    this.applicationService.candidateAppliance({ body: formValue }).subscribe({
      next: () => {
        // Ajoute localement pour simuler le CRUD
        const newApp = { ...formValue, id: Date.now(), status: 'DRAFT', speciality: this.getSpecialityName(formValue.speciality) };
        this.dataSource.data = [...this.dataSource.data, newApp];
        this.updateStats();
        this.processing = false;
        this.modalRef?.hide();
        Swal.fire('Success', 'Application created successfully', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Error', 'Failed to create application', 'error');
      }
    });
  }

  edit(row: any) {
    this.selectedApplication = row;
    this.CreateApplicationForm.patchValue({
      ...row,
      speciality: this.specialities.find(s => s.name === row.speciality)?.id || ''
    });
    this.modalRef = this.modalService.show('editTemplate');
  }

  updateApplication() {
    if (this.CreateApplicationForm.invalid || !this.selectedApplication) return;
    this.processing = true;
    // Pas de méthode update côté service, on met à jour localement
    const formValue = this.CreateApplicationForm.value;
    const updatedApp = {
      ...this.selectedApplication,
      ...formValue,
      speciality: this.getSpecialityName(formValue.speciality)
    };
    const idx = this.dataSource.data.findIndex(a => a.id === this.selectedApplication.id);
    if (idx > -1) {
      this.dataSource.data[idx] = updatedApp;
      this.dataSource.data = [...this.dataSource.data];
    }
    this.updateStats();
    this.processing = false;
    this.modalRef?.hide();
    Swal.fire('Success', 'Application updated successfully', 'success');
  }

  delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        // Pas de méthode delete côté service, suppression locale
        this.dataSource.data = this.dataSource.data.filter(a => a.id !== row.id);
        this.updateStats();
        Swal.fire('Deleted!', 'Application has been deleted.', 'success');
      }
    });
  }

  getSpecialityName(id: string) {
    return this.specialities.find(s => s.id === id)?.name || '';
  }
}
