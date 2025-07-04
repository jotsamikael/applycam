import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ApplicationService } from '../../../services/services/application.service';
import { ApplicationRequest } from '../../../services/models/application-request';
import { ApplicationResponse } from '../../../services/models/application-response';

@Component({
  selector: 'app-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.scss']
})
export class ApplicationManagementComponent implements OnInit, AfterViewInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Applications Management', active: true }
  ];

  followUpStat = [
    { title: 'Total Applications', value: 0, icon: 'assignment' },
    { title: 'Validées', value: 0, icon: 'check-circle' },
    { title: 'Rejetées', value: 0, icon: 'block' },
    { title: 'Brouillons', value: 0, icon: 'edit' }
  ];

  displayedColumns: string[] = ['candidateName', 'email', 'examType', 'speciality', 'status', 'actions'];
  dataSource = new MatTableDataSource<ApplicationResponse>([]);
  processing = false;
  modalRef?: BsModalRef;
  CreateApplicationForm!: FormGroup;
  selectedApplication: ApplicationResponse | null = null;
  specialities: { id: string, name: string }[] = [
    { id: 'info', name: 'Informatique' },
    { id: 'math', name: 'Mathématiques' },
    { id: 'phy', name: 'Physique' }
  ];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

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
      candidateName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      examType: ['', [Validators.required]],
      speciality: ['', [Validators.required]],
      applicationRegion: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      status: ['DRAFT', [Validators.required]]
      // Ajoute d'autres champs requis par ApplicationRequest si besoin
    });
  }

  get f() {
    return this.CreateApplicationForm.controls;
  }

  loadApplications(event?: PageEvent) {
    const offset = event?.pageIndex ?? this.pageIndex;
    const pageSize = event?.pageSize ?? this.pageSize;
    console.log('[Application] Chargement des applications avec offset:', offset, 'pageSize:', pageSize);

    this.applicationService.getAllApplications({
      offset,
      pageSize,
      field: 'id',
      order: true
    }).subscribe({
      next: (res) => {
        console.log('[Application] Réponse backend:', res);
        this.dataSource.data = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.pageSize = res.size || pageSize;
        this.pageIndex = res.number || offset;
        this.updateStats();
        console.log('[Application] Données tableau:', this.dataSource.data);
      },
      error: (err) => {
        console.error('[Application] Erreur lors du chargement:', err);
        Swal.fire('Error', 'Failed to load applications', 'error');
      }
    });
  }

  updateStats() {
    const all = this.dataSource.data;
    // On considère null/undefined/'' comme DRAFT
    const getStatus = (a: ApplicationResponse) => (a.status ? a.status : 'DRAFT');
    this.followUpStat[0].value = all.length;
    this.followUpStat[1].value = all.filter(a => getStatus(a) === 'VALIDATED').length;
    this.followUpStat[2].value = all.filter(a => getStatus(a) === 'REJECTED').length;
    this.followUpStat[3].value = all.filter(a => getStatus(a) === 'DRAFT').length;
    console.log('[Application] Stats calculées:', this.followUpStat);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateNewModal() {
    this.selectedApplication = null;
    this.CreateApplicationForm.reset({ status: 'DRAFT' });
    this.modalRef = this.modalService.show('addNew');
  }

  createNewApplication() {
    if (this.CreateApplicationForm.invalid) return;
    this.processing = true;
    const formValue: ApplicationRequest = {
      ...this.CreateApplicationForm.value,
      sessionYear: '2024',
      trainingCenterAcronym: 'ABC'
    };
    this.applicationService.candidateAppliance({ body: formValue }).subscribe({
      next: () => {
        this.loadApplications();
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

  edit(row: ApplicationResponse) {
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
    // Ajoute ici l'appel à la méthode de mise à jour réelle si elle existe côté backend
    // Sinon, recharge la liste pour simuler
    this.loadApplications();
    this.processing = false;
    this.modalRef?.hide();
    Swal.fire('Success', 'Application updated successfully', 'success');
  }

  delete(row: ApplicationResponse) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed && row.id) {
        this.applicationService.deleteApplication({ applicationId: row.id }).subscribe({
          next: () => {
            this.loadApplications();
            Swal.fire('Deleted!', 'Application has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete application', 'error');
          }
        });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.loadApplications(event);
  }

  showDetails(application: ApplicationResponse) {
    console.log('[Application] Affichage des détails pour:', application);
    
    const detailsHtml = `
      <div class="text-start">
        <div class="row">
          <div class="col-md-6">
            <p><strong>ID:</strong> ${application.id || 'N/A'}</p>
            <p><strong>Candidat:</strong> ${application.candidateName || 'N/A'}</p>
            <p><strong>Email:</strong> ${application.email || 'N/A'}</p>
            <p><strong>Spécialité:</strong> ${application.speciality || 'N/A'}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Type d'examen:</strong> ${application.examType || 'N/A'}</p>
            <p><strong>Région:</strong> ${application.applicationRegion || 'N/A'}</p>
            <p><strong>Année:</strong> ${application.applicationYear || 'N/A'}</p>
            <p><strong>Statut:</strong> <span class="badge bg-info">${application.status || 'DRAFT'}</span></p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <p><strong>Méthode de paiement:</strong> ${application.paymentMethod || 'N/A'}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Montant:</strong> ${application.amount ? application.amount + ' FCFA' : 'N/A'}</p>
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      title: `Détails de la candidature`,
      html: detailsHtml,
      width: '600px',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3085d6',
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide'
      }
    });
  }

  validate(app: ApplicationResponse) {
    if (!app.id) return;
    this.applicationService.validateApplication({ id: app.id }).subscribe({
      next: () => {
        this.loadApplications();
        Swal.fire('Succès', 'Candidature validée', 'success');
      },
      error: () => {
        Swal.fire('Erreur', 'Échec de la validation', 'error');
      }
    });
  }

  reject(app: ApplicationResponse) {
    if (!app.id) return;
    Swal.fire({
      title: 'Rejeter la candidature',
      input: 'text',
      inputLabel: 'Motif du rejet',
      inputPlaceholder: 'Saisir un commentaire...',
      showCancelButton: true,
      confirmButtonText: 'Rejeter',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.applicationService.rejectApplication({ id: app.id, comment: result.value }).subscribe({
          next: () => {
            this.loadApplications();
            Swal.fire('Succès', 'Candidature rejetée', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec du rejet', 'error');
          }
        });
      }
    });
  }
}
