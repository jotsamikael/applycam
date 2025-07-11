import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '../../../services/services/authentication.service';
import { TokenService } from '../../../services/token/token.service';
import { ApplicationService } from '../../../services/services/application.service';
import { CourseService } from '../../../services/services/course.service';
import { SessionService } from '../../../services/services/session.service';
import { ApplicationResponse } from '../../../services/models/application-response';
import Swal from 'sweetalert2';
import { SpecialityService } from '../../../services/services/speciality.service';
import { SpecialityResponse } from '../../../services/models/speciality-response';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit, AfterViewInit {
  breadCrumbItems = [
    { label: 'Dashboard', active: true }
  ];

  // Stats data
  followUpStat = [
    { title: 'Applications', value: 0, icon: 'bx-file' },
    { title: 'Validées', value: 0, icon: 'bx-check-circle' },
    { title: 'En attente', value: 0, icon: 'bx-time-five' }
  ];

  // Table data
  displayedColumns: string[] = ['speciality', 'applicationYear', 'status', 'actions'];
  dataSource = new MatTableDataSource<ApplicationResponse>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modal controls
  showModal = false;
  isEditMode = false;
  processing = false;
  applicationForm: FormGroup;

  // User data
  currentUser: any;

  selectedApplication: ApplicationResponse | null = null;
  showDetailsModal = false;

  specialities: SpecialityResponse[] = [];

  files: { [key: string]: File | null } = {
    cniFile: null,
    birthCertificate: null,
    diplomFile: null,
    photo: null,
    oldApplyanceFile: null,
    stageCertificate: null,
    cv: null,
    financialJustification: null,
    letter: null
  };

  sessions: any[] = [];
  trainingCenters: any[] = [];

  cameroonRegions: string[] = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private applicationService: ApplicationService,
    private courseService: CourseService,
    private sessionService: SessionService,
    private specialityService: SpecialityService,
    private trainingCenterService: TrainingcenterService
  ) {
    this.applicationForm = this.fb.group({
      speciality: ['', Validators.required],
      applicationYear: ['', Validators.required],
      applicationRegion: ['', Validators.required],
      examType: ['', Validators.required],
      examDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      sessionYear: ['', Validators.required],
      trainingCenterAcronym: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUserInfo();
    this.loadApplications();
    this.loadFormLists();
  }

  loadFormLists(): void {
    this.specialityService.getall().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.specialities = data;
        } else if (data && Array.isArray(data.content)) {
          this.specialities = data.content;
        } else {
          this.specialities = [];
        }
      },
      error: () => this.specialities = []
    });
    this.sessionService.getall1({ offset: 0, pageSize: 1000 }).subscribe({
      next: (data) => {
        if (data && Array.isArray(data.content)) {
          this.sessions = data.content;
        } else {
          this.sessions = [];
        }
      },
      error: () => this.sessions = []
    });
    this.trainingCenterService.getAllTrainingCenters({ offset: 0, pageSize: 1000 }).subscribe({
      next: (data) => {
        if (data && Array.isArray(data.content)) {
          this.trainingCenters = data.content;
        } else {
          this.trainingCenters = [];
        }
      },
      error: () => this.trainingCenters = []
    });
  }

  onFileChange(event: any, fileKey: string): void {
    const file = event.target.files[0];
    this.files[fileKey] = file;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadApplications(): void {
    this.processing = true;
    this.applicationService.getMyApplications().subscribe({
      next: (applications: ApplicationResponse[]) => {
        this.dataSource.data = applications;
        this.processing = false;
        this.updateStats();
      },
      error: (error) => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de charger vos applications', 'error');
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.applicationForm.reset();
    this.openApplicationFormSwal();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedApplication = null;
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) return;
    this.processing = true;
    const formValue = this.applicationForm.value;
    // Construction du payload ApplicationRequest
    const payload: any = {
      ...formValue,
      // Ajoute ici les champs manquants si besoin (email, etc.)
      email: this.currentUser?.email || '',
      // Valeurs par défaut pour les champs requis par le backend mais non présents dans le formulaire
      academicLevel: '',
      financialRessource: '',
      formationMode: '',
      freeCandidate: false,
      learningLanguage: '',
      matrimonialSituation: '',
      nationIdNumber: '',
      nationality: '',
      numberOfKid: 0,
      placeOfBirth: '',
      regionOrigins: '',
      repeatCandidate: false,
      secretCode: 0,
      sex: '',
      dateOfBirth: '',
      departmentOfOrigin: '',
    };
    this.applicationService.candidateAppliance(payload).subscribe({
      next: () => {
        this.processing = false;
        this.showModal = false;
        Swal.fire('Succès', this.isEditMode ? 'Candidature mise à jour !' : 'Candidature créée !', 'success');
        this.loadApplications();
        this.loadFormLists(); // recharge les listes après création/màj
      },
      error: (err) => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de soumettre la candidature', 'error');
      }
    });
  }

  openEditModal(application: ApplicationResponse): void {
    this.isEditMode = true;
    this.applicationForm.patchValue({
      speciality: application.speciality || '',
      applicationYear: application.applicationYear || '',
      applicationRegion: application.applicationRegion || '',
      examType: application.examType || '',
      examDate: application.examDate ? application.examDate.substring(0, 10) : '',
      paymentMethod: application.paymentMethod || '',
      amount: application.amount || 0,
    });
    this.openApplicationFormSwal();
  }

  openApplicationFormSwal(): void {
    Swal.fire({
      title: this.isEditMode ? 'Modifier une candidature' : 'Créer une candidature',
      html: this.getApplicationFormHtml(),
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      didOpen: () => {
        // Pour pré-remplir les champs si édition
        if (this.isEditMode) {
          const v = this.applicationForm.value;
          (document.getElementById('swal-speciality') as HTMLSelectElement).value = v.speciality;
          (document.getElementById('swal-applicationYear') as HTMLInputElement).value = v.applicationYear;
          (document.getElementById('swal-applicationRegion') as HTMLSelectElement).value = v.applicationRegion;
          (document.getElementById('swal-examType') as HTMLSelectElement).value = v.examType;
          (document.getElementById('swal-sessionYear') as HTMLSelectElement).value = v.sessionYear;
          (document.getElementById('swal-trainingCenterAcronym') as HTMLSelectElement).value = v.trainingCenterAcronym;
          (document.getElementById('swal-paymentMethod') as HTMLSelectElement).value = v.paymentMethod;
          (document.getElementById('swal-amount') as HTMLInputElement).value = v.amount;
          // Déclenche les scripts pour remplir les champs dépendants
          if ((window as any).setExamDateFromSession) (window as any).setExamDateFromSession();
          if ((window as any).setSpecialityAmount) (window as any).setSpecialityAmount();
        }
        // Déclare les fonctions sur window pour éviter les erreurs de typage
        (window as any).setExamDateFromSession = function() {
          var select = document.getElementById('swal-sessionYear') as HTMLSelectElement;
          var dateInput = document.getElementById('swal-examDate') as HTMLInputElement;
          if (!select || !dateInput) return;
          var selected = select.options[select.selectedIndex];
          var examDate = selected.getAttribute('data-examdate');
          dateInput.value = examDate || '';
        };
        (window as any).setSpecialityAmount = function() {
          var select = document.getElementById('swal-speciality') as HTMLSelectElement;
          var amountInput = document.getElementById('swal-amount') as HTMLInputElement;
          if (!select || !amountInput) return;
          var selected = select.options[select.selectedIndex];
          var amount = selected.getAttribute('data-amount');
          amountInput.value = amount || '0';
        };
      },
      preConfirm: () => {
        // Récupère les valeurs des champs du formulaire HTML
        const formValue: any = {
          speciality: (document.getElementById('swal-speciality') as HTMLSelectElement)?.value,
          applicationYear: (document.getElementById('swal-applicationYear') as HTMLInputElement)?.value,
          applicationRegion: (document.getElementById('swal-applicationRegion') as HTMLSelectElement)?.value,
          examType: (document.getElementById('swal-examType') as HTMLSelectElement)?.value,
          examDate: (document.getElementById('swal-examDate') as HTMLInputElement)?.value,
          paymentMethod: (document.getElementById('swal-paymentMethod') as HTMLSelectElement)?.value,
          amount: +(document.getElementById('swal-amount') as HTMLInputElement)?.value,
          sessionYear: (document.getElementById('swal-sessionYear') as HTMLSelectElement)?.value,
          trainingCenterAcronym: (document.getElementById('swal-trainingCenterAcronym') as HTMLSelectElement)?.value,
        };
        // Validation simple
        if (!formValue.speciality || !formValue.applicationYear || !formValue.applicationRegion || !formValue.examType || !formValue.examDate || !formValue.paymentMethod || !formValue.sessionYear || !formValue.trainingCenterAcronym) {
          Swal.showValidationMessage('Tous les champs sont obligatoires');
          return false;
        }
        return formValue;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.onSwalFormSubmit(result.value);
      }
    });
  }

  getApplicationFormHtml(): string {
    // Génère le HTML du formulaire à injecter dans le Swal
    return `
      <div class='row'>
        <div class='col-md-6 mb-2'>
          <label>Spécialité</label>
          <select id='swal-speciality' class='form-select' onchange='window.setSpecialityAmount && window.setSpecialityAmount()'>
            <option value=''>Sélectionner</option>
            ${this.specialities.map(s => `<option value='${s.name}' data-amount='${s.paymentAmount ?? 0}'>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class='col-md-6 mb-2'>
          <label>Année d'application</label>
          <input id='swal-applicationYear' type='text' class='form-control' placeholder='Ex: 2024'>
        </div>
      </div>
      <div class='row'>
        <div class='col-md-6 mb-2'>
          <label>Région</label>
          <select id='swal-applicationRegion' class='form-select'>
            <option value=''>Sélectionner</option>
            ${this.cameroonRegions.map(r => `<option value='${r}'>${r}</option>`).join('')}
          </select>
        </div>
        <div class='col-md-6 mb-2'>
          <label>Type d'examen</label>
          <select id='swal-examType' class='form-select'>
            <option value=''>Sélectionner</option>
            <option value='CQP'>CQP</option>
            <option value='DQP'>DQP</option>
          </select>
        </div>
      </div>
      <div class='row'>
        <div class='col-md-6 mb-2'>
          <label>Session</label>
          <select id='swal-sessionYear' class='form-select' onchange='window.setExamDateFromSession && window.setExamDateFromSession()'>
            <option value=''>Sélectionner</option>
            ${this.sessions.map(s => `<option value='${s.sessionYear}' data-examdate='${s.examDate ?? ''}'>${s.sessionYear} - ${s.examType}</option>`).join('')}
          </select>
        </div>
        <div class='col-md-6 mb-2'>
          <label>Date d'examen</label>
          <input id='swal-examDate' type='date' class='form-control' disabled>
        </div>
      </div>
      <div class='row'>
        <div class='col-md-6 mb-2'>
          <label>Centre de formation</label>
          <select id='swal-trainingCenterAcronym' class='form-select'>
            <option value=''>Sélectionner</option>
            ${this.trainingCenters.map(c => `<option value='${c.acronym}'>${c.fullName}</option>`).join('')}
          </select>
        </div>
        <div class='col-md-6 mb-2'>
          <label>Montant</label>
          <input id='swal-amount' type='number' class='form-control' placeholder='0' disabled>
        </div>
      </div>
      <div class='row'>
        <div class='col-md-6 mb-2'>
          <label>Méthode de paiement</label>
          <select id='swal-paymentMethod' class='form-select'>
            <option value=''>Sélectionner</option>
            <option value='CASH'>Espèces</option>
            <option value='CARD'>Carte bancaire</option>
            <option value='TRANSFER'>Virement</option>
            <option value='MOBILE_MONEY'>Mobile Money</option>
          </select>
        </div>
      </div>
      <script>
        window.setExamDateFromSession = function() {
          var select = document.getElementById('swal-sessionYear') as HTMLSelectElement;
          var dateInput = document.getElementById('swal-examDate') as HTMLInputElement;
          if (!select || !dateInput) return;
          var selected = select.options[select.selectedIndex];
          var examDate = selected.getAttribute('data-examdate');
          dateInput.value = examDate || '';
        };
        window.setSpecialityAmount = function() {
          var select = document.getElementById('swal-speciality') as HTMLSelectElement;
          var amountInput = document.getElementById('swal-amount') as HTMLInputElement;
          if (!select || !amountInput) return;
          var selected = select.options[select.selectedIndex];
          var amount = selected.getAttribute('data-amount');
          amountInput.value = amount || '0';
        };
      </script>
    `;
  }

  onSwalFormSubmit(formValue: any): void {
    this.processing = true;
    const payload: any = {
      ...formValue,
      email: this.currentUser?.email || '',
      academicLevel: '',
      financialRessource: '',
      formationMode: '',
      freeCandidate: false,
      learningLanguage: '',
      matrimonialSituation: '',
      nationIdNumber: '',
      nationality: '',
      numberOfKid: 0,
      placeOfBirth: '',
      regionOrigins: '',
      repeatCandidate: false,
      secretCode: 0,
      sex: '',
      dateOfBirth: '',
      departmentOfOrigin: '',
    };
    this.applicationService.candidateAppliance(payload).subscribe({
      next: () => {
        this.processing = false;
        Swal.fire('Succès', this.isEditMode ? 'Candidature mise à jour !' : 'Candidature créée !', 'success');
        this.loadApplications();
        this.loadFormLists();
      },
      error: (err) => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de soumettre la candidature', 'error');
      }
    });
  }

  deleteApplication(application: ApplicationResponse): void {
    if (!application.id) return;
    Swal.fire({
      title: 'Supprimer la candidature ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.applicationService.deleteApplication({ applicationId: application.id }).subscribe({
          next: () => {
            this.processing = false;
            Swal.fire('Supprimé', 'Candidature supprimée', 'success');
            this.loadApplications();
          },
          error: () => {
            this.processing = false;
            Swal.fire('Erreur', 'Impossible de supprimer', 'error');
          }
        });
      }
    });
  }

  viewApplicationDetails(application: ApplicationResponse): void {
    Swal.fire({
      title: 'Détails de la candidature',
      html: `
        <p><strong>Spécialité :</strong> ${application.speciality}</p>
        <p><strong>Année :</strong> ${application.applicationYear}</p>
        <p><strong>Région :</strong> ${application.applicationRegion}</p>
        <p><strong>Type d'examen :</strong> ${application.examType}</p>
        <p><strong>Date d'examen :</strong> ${application.examDate ? application.examDate.substring(0, 10) : ''}</p>
        <p><strong>Méthode de paiement :</strong> ${application.paymentMethod}</p>
        <p><strong>Montant :</strong> ${application.amount}</p>
        <p><strong>Statut :</strong> ${this.getStatusDisplayText(application.status)}</p>
      `,
      confirmButtonText: 'Fermer'
    });
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'VALIDATED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'PAID': return 'bg-primary';
      case 'READYTOPAY': return 'bg-info';
      case 'DRAFT': return 'bg-secondary';
      case 'INCOMPLETED': return 'bg-warning';
      case 'PENDING': return 'bg-light text-dark';
      default: return 'bg-light text-dark';
    }
  }

  getStatusDisplayText(status: string | undefined): string {
    switch (status) {
      case 'VALIDATED': return 'Validée';
      case 'REJECTED': return 'Rejetée';
      case 'PAID': return 'Payée';
      case 'READYTOPAY': return 'Prête à payer';
      case 'DRAFT': return 'Brouillon';
      case 'INCOMPLETED': return 'Incomplète';
      case 'PENDING': return 'En attente';
      default: return 'Inconnu';
    }
  }

  // Met à jour les stats dynamiquement
  updateStats(): void {
    const data = this.dataSource.data;
    this.followUpStat[0].value = data.length;
    this.followUpStat[1].value = data.filter(a => a.status === 'VALIDATED').length;
    this.followUpStat[2].value = data.filter(a => a.status === 'PENDING' || a.status === 'READYTOPAY').length;
  }
}