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
import { SessionDetailsListResponse } from '../../../services/models/session-details-list-response';
import { SessionService } from '../../../services/services/session.service';
import { SessionResponse } from '../../../services/models/session-response';
import { SpecialityService } from '../../../services/services/speciality.service';
import { SpecialityResponse } from '../../../services/models/speciality-response';
import { CourseService } from '../../../services/services/course.service';
import { CourseResponse } from '../../../services/models/course-response';

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

  showAdvancedFilters = false;

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
  specialities: SpecialityResponse[] = [];
  courses: CourseResponse[] = [];
  examType: string = '';
  sessions: SessionResponse[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  files: { [key: string]: File | null } = {
    paymentReceipt: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private applicationService: ApplicationService,
    private sessionService: SessionService,
    private specialityService: SpecialityService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSessions();
    this.loadSpecialities();
    this.loadCourses();
    this.loadApplications();
  }

  loadSessions() {
    this.sessionService.getall({ offset: 0, pageSize: 100 }).subscribe({
      next: (res) => {
        this.sessions = res.content || [];
      },
      error: () => {
        this.sessions = [];
      }
    });
  }

  loadSpecialities() {
    this.specialityService.getallSpeciality({ offset: 0, pageSize: 100 }).subscribe({
      next: (res) => {
        this.specialities = res.content || [];
      },
      error: () => {
        this.specialities = [];
      }
    });
  }

  loadCourses() {
    this.courseService.getCourses({ offset: 0, pageSize: 100 }).subscribe({
      next: (res) => {
        this.courses = res.content || [];
      },
      error: () => {
        this.courses = [];
      }
    });
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
      status: ['DRAFT', [Validators.required]],
      amount: ['', [Validators.required]],
      courseName: ['', [Validators.required]],
      secretCode: ['', [Validators.required]]
    });
  }

  get f() {
    return this.CreateApplicationForm.controls;
  }

  loadApplications(event?: PageEvent) {
    const offset = event?.pageIndex ?? this.pageIndex;
    const pageSize = event?.pageSize ?? this.pageSize;
    console.log('[Application] Chargement des applications avec offset:', offset, 'pageSize:', pageSize);

    this.applicationService.getAllApplicationsIncludingInactive({
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

  onFileChange(event: any, fileKey: string): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2Mo
        Swal.fire('Erreur', 'Le fichier ne doit pas dépasser 2 Mo', 'error');
        this.removeFile(fileKey);
        return;
      }
      this.files[fileKey] = file;
    }
  }

  isFileSelected(fileKey: string): boolean {
    return this.files[fileKey] !== null;
  }

  getFileName(fileKey: string): string {
    const file = this.files[fileKey];
    return file ? file.name : '';
  }

  removeFile(fileKey: string): void {
    this.files[fileKey] = null;
    // Réinitialiser l'input file si besoin
    const fileInput = document.getElementById(`file-${fileKey}`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  createNewApplication() {
    if (this.CreateApplicationForm.invalid) return;
    this.processing = true;
    const formValue: ApplicationRequest = {
      ...this.CreateApplicationForm.value,
      sessionYear: '2024',
      trainingCenterAcronym: 'ABC'
    };
    if (this.files.paymentReceipt) {
      // Envoi multipart/form-data
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));
      formData.append('paymentReceipt', this.files.paymentReceipt);
      this.applicationService['http'].post(`${this.applicationService.rootUrl}/application/PersonalInformation`, formData).subscribe({
        next: () => {
          this.loadApplications();
          this.processing = false;
          this.modalRef?.hide();
          this.files.paymentReceipt = null;
          Swal.fire('Success', 'Application créée avec reçu de paiement', 'success');
        },
        error: () => {
          this.processing = false;
          Swal.fire('Error', 'Erreur lors de l\'upload du reçu', 'error');
        }
      });
    } else {
      // Envoi classique JSON
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
  }

  edit(row: ApplicationResponse) {
    this.selectedApplication = row;
    this.CreateApplicationForm.patchValue({
      ...row,
      speciality: row.speciality || '',
      courseName: (row as any).courseName || '',
      amount: row.amount || 0
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
      title: 'Êtes-vous sûr ?',
      text: 'Cette action ne peut pas être annulée !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed && row.id) {
        this.applicationService.deleteApplicationPermanently({ applicationId: row.id }).subscribe({
          next: () => {
            this.loadApplications();
            Swal.fire('Supprimé !', 'La candidature a été supprimée définitivement.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression de la candidature', 'error');
          }
        });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.loadApplications(event);
  }

  showDetails(application: ApplicationResponse) {
    console.log('Détail application:', application);
    this.selectedApplication = application;
    let detailsHtml = `
      <div class="text-start">
        <div class="row">
          <div class="col-md-6">
            
            <p><strong>Candidat:</strong> ${application.candidateName || 'N/A'}</p>
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
        <div class='row mt-3'><div class='col-12'>
          ${application.paymentReceiptUrl ? `<p><strong>Reçu de paiement :</strong> <a href='${application.paymentReceiptUrl}' target='_blank' class='btn btn-sm btn-outline-primary'>Voir le reçu <i class='bx bx-link-external'></i></a></p>` : ''}
          ${application.cniUrl ? `<p><strong>CNI :</strong> <a href='${application.cniUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir la CNI</a></p>` : ''}
          ${application.diplomaUrl ? `<p><strong>Diplôme :</strong> <a href='${application.diplomaUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir le diplôme</a></p>` : ''}
          ${application.photoUrl ? `<p><strong>Photo :</strong> <a href='${application.photoUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir la photo</a></p>` : ''}
          ${application.birthCertificateUrl ? `<p><strong>Certificat de naissance :</strong> <a href='${application.birthCertificateUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir le certificat</a></p>` : ''}
          ${application.cvUrl ? `<p><strong>CV :</strong> <a href='${application.cvUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir le CV</a></p>` : ''}
          ${application.letterUrl ? `<p><strong>Lettre de motivation :</strong> <a href='${application.letterUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir la lettre</a></p>` : ''}
          ${application.financialJustificationUrl ? `<p><strong>Justification financière :</strong> <a href='${application.financialJustificationUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir la justification</a></p>` : ''}
          ${application.stageCertificateUrl ? `<p><strong>Certificat de stage :</strong> <a href='${application.stageCertificateUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir le certificat de stage</a></p>` : ''}
          ${application.oldApplyanceUrl ? `<p><strong>Ancienne candidature :</strong> <a href='${application.oldApplyanceUrl}' target='_blank' class='btn btn-sm btn-outline-secondary'>Voir l'ancienne candidature</a></p>` : ''}
        </div></div>
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

  deactivate(app: ApplicationResponse) {
    if (!app.id) return;
    Swal.fire({
      title: 'Désactiver la candidature',
      text: 'Voulez-vous désactiver cette candidature ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, désactiver',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.applicationService.deactivateApplication({ applicationId: app.id }).subscribe({
          next: () => {
            this.loadApplications();
            Swal.fire('Succès', 'Candidature désactivée', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la désactivation', 'error');
          }
        });
      }
    });
  }

  reactivate(app: ApplicationResponse) {
    if (!app.id) return;
    Swal.fire({
      title: 'Réactiver la candidature',
      text: 'Voulez-vous réactiver cette candidature ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, réactiver',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.applicationService.reactivateApplication({ applicationId: app.id }).subscribe({
          next: () => {
            this.loadApplications();
            Swal.fire('Succès', 'Candidature réactivée', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la réactivation', 'error');
          }
        });
      }
    });
  }

  onExamTypeChange(event: any) {
    this.examType = event.target.value;
    if (this.examType === 'CQP') {
      this.CreateApplicationForm.get('courseName')?.enable();
      this.CreateApplicationForm.get('speciality')?.disable();
      this.CreateApplicationForm.patchValue({ speciality: '' });
    } else if (this.examType === 'DQP') {
      this.CreateApplicationForm.get('speciality')?.enable();
      this.CreateApplicationForm.get('courseName')?.disable();
      this.CreateApplicationForm.patchValue({ courseName: '' });
    } else {
      this.CreateApplicationForm.get('speciality')?.disable();
      this.CreateApplicationForm.get('courseName')?.disable();
      this.CreateApplicationForm.patchValue({ speciality: '', courseName: '' });
    }
  }

  onSpecialityOrCourseChange() {
    let amount = 0;
    if (this.examType === 'DQP') {
      const spec = this.specialities.find(s => s.name === this.CreateApplicationForm.value.speciality);
      amount = spec?.paymentAmount || 0;
    } else if (this.examType === 'CQP') {
      const course = this.courses.find(c => c.name === this.CreateApplicationForm.value.courseName);
      amount = course?.priceForDqp || 0;
    }
    this.CreateApplicationForm.patchValue({ amount });
  }
}
