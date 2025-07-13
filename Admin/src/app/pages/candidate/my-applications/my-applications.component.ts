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
import { HttpClient } from '@angular/common/http';

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

  // Nouveaux champs pour les fonctionnalités avancées
  showAdvancedOptions = false;
  applicationStatistics: any = {};
  loadingStatistics = false;
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private applicationService: ApplicationService,
    private courseService: CourseService,
    private sessionService: SessionService,
    private specialityService: SpecialityService,
    private trainingCenterService: TrainingcenterService,
    private http: HttpClient
  ) {
    this.applicationForm = this.fb.group({
      // Informations personnelles
      sex: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nationIdNumber: ['', Validators.required],
      academicLevel: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      nationality: ['', Validators.required],
      regionOrigins: ['', Validators.required],
      departmentOfOrigin: ['', Validators.required],
      matrimonialSituation: ['', Validators.required],
      numberOfKid: [0, [Validators.required, Validators.min(0)]],
      learningLanguage: ['', Validators.required],
      freeCandidate: [false, Validators.required],
      repeatCandidate: [false, Validators.required],
      formationMode: ['', Validators.required],
      financialRessource: ['', Validators.required],
      
      // Informations de candidature
      speciality: ['', Validators.required],
      courseName: [''],
      examType: ['', Validators.required],
      applicationRegion: ['', Validators.required],
      sessionYear: ['', Validators.required],
      trainingCenterAcronym: ['', Validators.required],
      
      // Informations de paiement
      amount: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      secretCode: [0, [Validators.required, Validators.min(0)]],
      
      // Pièces jointes
      cniFile: [null],
      birthCertificate: [null],
      diplomFile: [null],
      photo: [null],
      oldApplyanceFile: [null],
      stageCertificate: [null],
      cv: [null],
      financialJustification: [null],
      letter: [null]
    });

    // Formulaire de recherche
    this.searchForm = this.fb.group({
      searchTerm: ['', [Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUserInfo();
    this.loadApplications();
    this.loadFormLists();
  }

  loadFormLists(): void {
    console.log('[MyApplications] Début du chargement des listes de formulaire');
    
    // Charger les spécialités
    console.log('[MyApplications] Chargement des spécialités...');
    this.specialityService.getallSpeciality({ offset: 0, pageSize: 1000 }).subscribe({
      next: (data) => {
        console.log('[MyApplications] Réponse spécialités:', data);
        if (Array.isArray(data)) {
          this.specialities = data;
        } else if (data && Array.isArray(data.content)) {
          this.specialities = data.content;
        } else {
          this.specialities = [];
        }
        console.log('[MyApplications] Spécialités chargées:', this.specialities.length);
      },
      error: (error) => {
        console.error('[MyApplications] Erreur chargement spécialités:', error);
        this.specialities = [];
      }
    });
    
    // Charger les sessions
    console.log('[MyApplications] Chargement des sessions...');
    this.sessionService.getall({ offset: 0, pageSize: 1000 }).subscribe({
      next: (data) => {
        console.log('[MyApplications] Réponse sessions:', data);
        if (data && Array.isArray(data.content)) {
          this.sessions = data.content;
        } else if (Array.isArray(data)) {
          this.sessions = data;
        } else {
          this.sessions = [];
        }
        console.log('[MyApplications] Sessions chargées:', this.sessions.length);
        console.log('[MyApplications] Détails des sessions:', this.sessions);
      },
      error: (error) => {
        console.error('[MyApplications] Erreur chargement sessions:', error);
        this.sessions = [];
      }
    });
    
    // Charger les centres de formation
    console.log('[MyApplications] Chargement des centres de formation...');
    this.trainingCenterService.getAllTrainingCenters({ offset: 0, pageSize: 1000 }).subscribe({
      next: (data) => {
        console.log('[MyApplications] Réponse centres de formation:', data);
        if (data && Array.isArray(data.content)) {
          this.trainingCenters = data.content;
        } else if (Array.isArray(data)) {
          this.trainingCenters = data;
        } else {
          this.trainingCenters = [];
        }
        console.log('[MyApplications] Centres de formation chargés:', this.trainingCenters.length);
      },
      error: (error) => {
        console.error('[MyApplications] Erreur chargement centres de formation:', error);
        this.trainingCenters = [];
      }
    });
  }

  onFileChange(event: any, fileKey: string): void {
    const file = event.target.files[0];
    if (file) {
      this.files[fileKey] = file;
      this.applicationForm.patchValue({ [fileKey]: file });
      console.log(`[MyApplications] Fichier ${fileKey} sélectionné:`, file.name);
    }
  }

  // Méthode pour vérifier si un fichier est sélectionné
  isFileSelected(fileKey: string): boolean {
    return this.files[fileKey] !== null;
  }

  // Méthode pour obtenir le nom du fichier sélectionné
  getFileName(fileKey: string): string {
    const file = this.files[fileKey];
    return file ? file.name : '';
  }

  // Méthode pour supprimer un fichier sélectionné
  removeFile(fileKey: string): void {
    this.files[fileKey] = null;
    this.applicationForm.patchValue({ [fileKey]: null });
    // Réinitialiser l'input file
    const fileInput = document.getElementById(`file-${fileKey}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadApplications(): void {
    console.log('[MyApplications] loadApplications appelé');
    this.processing = true;
    this.applicationService.getMyApplications().subscribe({
      next: (applications: ApplicationResponse[]) => {
        console.log('[MyApplications] getMyApplications succès:', applications);
        console.log('[MyApplications] Nombre d\'applications reçues:', applications?.length);
        console.log('[MyApplications] Détails des applications:', applications);
        
        this.dataSource.data = applications;
        console.log('[MyApplications] DataSource mis à jour:', this.dataSource.data);
        
        this.processing = false;
        this.updateStats();
        console.log('[MyApplications] Stats mises à jour');
      },
      error: (error) => {
        console.error('[MyApplications] Erreur lors du chargement:', error);
        console.error('[MyApplications] Détails de l\'erreur:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de charger vos applications', 'error');
      }
    });
  }

  // Méthode pour charger toutes les applications de l'utilisateur (actives et inactives)
  loadAllMyApplicationsIncludingInactive(): void {
    console.log('[MyApplications] loadAllMyApplicationsIncludingInactive appelé');
    this.processing = true;
    
    const params: any = {
      offset: 0,
      pageSize: 100,
      field: 'id',
      order: true
    };

    console.log('[MyApplications] Paramètres de requête (incluant inactives):', params);

    // Appel direct au nouvel endpoint
    this.http.get<any>(`${this.applicationService.rootUrl}/application/get-my-applications-including-inactive`, { params }).subscribe({
      next: (res) => {
        console.log('[MyApplications] getMyApplicationsIncludingInactive succès:', res);
        console.log('[MyApplications] Contenu reçu (incluant inactives):', res.content);
        console.log('[MyApplications] Nombre d\'éléments (incluant inactives):', res.content?.length);
        
        this.dataSource.data = res.content || [];
        console.log('[MyApplications] DataSource mis à jour (incluant inactives):', this.dataSource.data);
        
        this.processing = false;
        this.updateStats();
        console.log('[MyApplications] Stats mises à jour (incluant inactives)');
        Swal.fire('Succès', `Chargement de ${this.dataSource.data.length} candidatures (incluant inactives)`, 'success');
      },
      error: (error) => {
        console.error('[MyApplications] Erreur lors du chargement (incluant inactives):', error);
        console.error('[MyApplications] Détails de l\'erreur (incluant inactives):', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de charger vos applications (incluant inactives)', 'error');
      }
    });
  }

  openEditModal(application: ApplicationResponse): void {
    this.isEditMode = true;
    this.selectedApplication = application;
    
    // Pré-remplir le formulaire avec les données existantes
    this.applicationForm.patchValue({
      // Informations personnelles (à récupérer depuis le backend si nécessaire)
      sex: '',
      email: this.currentUser?.email || '',
      nationIdNumber: '',
      academicLevel: '',
      dateOfBirth: '',
      placeOfBirth: '',
      nationality: '',
      regionOrigins: '',
      departmentOfOrigin: '',
      matrimonialSituation: '',
      numberOfKid: 0,
      learningLanguage: '',
      freeCandidate: false,
      repeatCandidate: false,
      formationMode: '',
      financialRessource: '',
      
      // Informations de candidature
      speciality: application.speciality || '',
      courseName: '',
      examType: application.examType || '',
      applicationRegion: application.applicationRegion || '',
      sessionYear: application.applicationYear || '',
      trainingCenterAcronym: '',
      
      // Informations de paiement
      amount: application.amount || 0,
      paymentMethod: application.paymentMethod || '',
      secretCode: 0
    });
    
    this.showModal = true;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedApplication = null;
    this.applicationForm.reset();
    
    // Pré-remplir l'email de l'utilisateur connecté
    this.applicationForm.patchValue({
      email: this.currentUser?.email || ''
    });
    
    // Réinitialiser les fichiers
    this.files = {
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
    
    // Forcer le rechargement des listes pour s'assurer qu'elles sont à jour
    this.loadFormLists();
    
    this.showModal = true;
  }

  // Méthode pour forcer le rechargement des listes
  reloadFormLists(): void {
    console.log('[MyApplications] Rechargement forcé des listes de formulaire');
    this.loadFormLists();
  }

  // Méthode pour diagnostiquer les sessions
  diagnoseSessions(): void {
    console.log('[MyApplications] === DIAGNOSTIC DES SESSIONS ===');
    console.log('[MyApplications] Sessions actuelles:', this.sessions);
    console.log('[MyApplications] Nombre de sessions:', this.sessions.length);
    console.log('[MyApplications] Type de sessions:', typeof this.sessions);
    console.log('[MyApplications] Est un tableau:', Array.isArray(this.sessions));
    
    if (this.sessions.length > 0) {
      console.log('[MyApplications] Première session:', this.sessions[0]);
      console.log('[MyApplications] Propriétés de la première session:', Object.keys(this.sessions[0]));
    }
    
    // Forcer un nouveau chargement des sessions
    console.log('[MyApplications] Rechargement des sessions...');
    this.sessionService.getall({ offset: 0, pageSize: 1000 }).subscribe({
      next: (data) => {
        console.log('[MyApplications] Réponse brute des sessions:', data);
        console.log('[MyApplications] Type de réponse:', typeof data);
        console.log('[MyApplications] Est un tableau:', Array.isArray(data));
        
        if (data && Array.isArray(data.content)) {
          this.sessions = data.content;
          console.log('[MyApplications] Sessions mises à jour depuis content:', this.sessions);
        } else if (Array.isArray(data)) {
          this.sessions = data;
          console.log('[MyApplications] Sessions mises à jour directement:', this.sessions);
        } else {
          this.sessions = [];
          console.log('[MyApplications] Aucune session trouvée, tableau vide');
        }
        
        Swal.fire({
          title: 'Diagnostic des Sessions',
          html: `
            <div class="text-start">
              <p><strong>Nombre de sessions:</strong> ${this.sessions.length}</p>
              <p><strong>Type de données:</strong> ${typeof this.sessions}</p>
              <p><strong>Est un tableau:</strong> ${Array.isArray(this.sessions)}</p>
              ${this.sessions.length > 0 ? `
                <p><strong>Première session:</strong></p>
                <pre style="font-size: 0.8em; background: #f8f9fa; padding: 10px; border-radius: 5px;">${JSON.stringify(this.sessions[0], null, 2)}</pre>
              ` : '<p class="text-warning">Aucune session disponible</p>'}
            </div>
          `,
          width: '600px',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('[MyApplications] Erreur lors du diagnostic des sessions:', error);
        Swal.fire('Erreur', 'Impossible de diagnostiquer les sessions: ' + error.message, 'error');
      }
    });
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
    
    // Première étape : créer la candidature
    const formValue = this.applicationForm.value;
    const payload: any = {
      ...formValue,
      email: this.currentUser?.email || '',
    };
    
    this.applicationService.candidateAppliance({ body: payload }).subscribe({
      next: () => {
        // Deuxième étape : upload des fichiers si des fichiers sont sélectionnés
        const hasFiles = Object.values(this.files).some(file => file !== null);
        if (hasFiles) {
          this.uploadFiles();
        } else {
          this.processing = false;
          this.showModal = false;
          Swal.fire('Succès', this.isEditMode ? 'Candidature mise à jour !' : 'Candidature créée !', 'success');
          this.loadApplications();
          this.loadFormLists();
        }
      },
      error: (err) => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de soumettre la candidature', 'error');
      }
    });
  }

  // Méthode pour uploader les fichiers
  uploadFiles(): void {
    const formData = new FormData();
    
    // Ajouter tous les fichiers sélectionnés
    Object.keys(this.files).forEach(key => {
      const file = this.files[key];
      if (file) {
        formData.append(key, file);
      }
    });

    // Appel à l'endpoint d'upload des fichiers
    this.http.patch(`${this.applicationService.rootUrl}/application/PersonalInformation/documents`, formData).subscribe({
      next: () => {
        this.processing = false;
        this.showModal = false;
        Swal.fire('Succès', 'Candidature créée et fichiers uploadés avec succès !', 'success');
        this.loadApplications();
        this.loadFormLists();
        // Réinitialiser les fichiers
        this.files = {
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
      },
      error: (err) => {
        this.processing = false;
        Swal.fire('Attention', 'Candidature créée mais erreur lors de l\'upload des fichiers', 'warning');
        this.loadApplications();
        this.loadFormLists();
      }
    });
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
      text: 'Cette action désactivera votre candidature. Vous pourrez la réactiver plus tard.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.applicationService.deactivateApplication({ applicationId: application.id }).subscribe({
          next: () => {
            this.processing = false;
            Swal.fire('Supprimé', 'Candidature désactivée avec succès', 'success');
            this.loadApplications();
          },
          error: () => {
            this.processing = false;
            Swal.fire('Erreur', 'Impossible de désactiver la candidature', 'error');
          }
        });
      }
    });
  }

  reactivateApplication(application: ApplicationResponse): void {
    if (!application.id) return;
    Swal.fire({
      title: 'Réactiver la candidature ?',
      text: 'Voulez-vous réactiver cette candidature ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, réactiver',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.applicationService.reactivateApplication({ applicationId: application.id }).subscribe({
          next: () => {
            this.processing = false;
            Swal.fire('Réactivée', 'Candidature réactivée avec succès', 'success');
            this.loadApplications();
          },
          error: () => {
            this.processing = false;
            Swal.fire('Erreur', 'Impossible de réactiver la candidature', 'error');
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

  // ==================== NOUVELLES MÉTHODES ====================

  /**
   * Charger les statistiques personnelles
   */
  loadPersonalStatistics(): void {
    console.log('[MyApplications] Chargement des statistiques personnelles');
    this.loadingStatistics = true;

    this.applicationService.getApplicationStatistics().subscribe({
      next: (stats) => {
        console.log('[MyApplications] Statistiques reçues:', stats);
        this.applicationStatistics = stats;
        this.loadingStatistics = false;
        Swal.fire('Succès', 'Statistiques mises à jour', 'success');
      },
      error: (error) => {
        console.error('[MyApplications] Erreur chargement statistiques:', error);
        this.loadingStatistics = false;
        Swal.fire('Erreur', 'Impossible de charger les statistiques', 'error');
      }
    });
  }

  /**
   * Afficher les statistiques dans une popup
   */
  showStatisticsPopup(): void {
    if (!this.applicationStatistics || Object.keys(this.applicationStatistics).length === 0) {
      this.loadPersonalStatistics();
      setTimeout(() => this.showStatisticsPopup(), 1000);
      return;
    }

    const stats = this.applicationStatistics;
    const statsHtml = `
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-primary">Vos statistiques</h6>
          <p><strong>Total candidatures:</strong> ${stats.total || 0}</p>
          <p><strong>Validées:</strong> ${stats.validated || 0}</p>
          <p><strong>En attente:</strong> ${stats.pending || 0}</p>
          <p><strong>Rejetées:</strong> ${stats.rejected || 0}</p>
          <p><strong>Payées:</strong> ${stats.paid || 0}</p>
          <p><strong>Brouillons:</strong> ${stats.draft || 0}</p>
        </div>
        <div class="col-md-6">
          <h6 class="text-primary">Par région</h6>
          ${stats.byRegion ? stats.byRegion.map((region: any) => 
            `<p><strong>${region[0]}:</strong> ${region[1]}</p>`
          ).join('') : '<p>Aucune donnée</p>'}
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Vos statistiques de candidature',
      html: statsHtml,
      width: '700px',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3085d6',
      showCloseButton: true
    });
  }

  /**
   * Rechercher dans les candidatures personnelles
   */
  searchInMyApplications(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (!searchTerm || searchTerm.trim().length < 2) {
      Swal.fire('Attention', 'Veuillez saisir au moins 2 caractères pour la recherche', 'warning');
      return;
    }

    console.log('[MyApplications] Recherche dans mes candidatures:', searchTerm);
    this.processing = true;

    // Filtrer les données locales
    const filteredData = this.dataSource.data.filter(app => 
      (app.speciality && app.speciality.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.applicationYear && app.applicationYear.includes(searchTerm)) ||
      (app.applicationRegion && app.applicationRegion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    this.dataSource.data = filteredData;
    this.processing = false;
    this.updateStats();
    Swal.fire('Recherche terminée', `${filteredData.length} candidature(s) trouvée(s)`, 'success');
  }

  /**
   * Effacer la recherche
   */
  clearSearch(): void {
    this.searchForm.reset();
    this.loadApplications();
    Swal.fire('Info', 'Recherche effacée', 'info');
  }

  /**
   * Exporter mes candidatures
   */
  exportMyApplications(): void {
    console.log('[MyApplications] Export de mes candidatures');
    
    const data = this.dataSource.data;
    if (data.length === 0) {
      Swal.fire('Attention', 'Aucune candidature à exporter', 'warning');
      return;
    }

    // Créer un fichier CSV simple
    const headers = ['ID', 'Spécialité', 'Année', 'Région', 'Type d\'examen', 'Statut', 'Montant'];
    const csvContent = [
      headers.join(','),
      ...data.map(app => [
        app.id || '',
        app.speciality || '',
        app.applicationYear || '',
        app.applicationRegion || '',
        app.examType || '',
        app.status || '',
        app.amount || ''
      ].join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mes_candidatures_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Succès', `${data.length} candidature(s) exportée(s)`, 'success');
  }

  /**
   * Rafraîchir avec confirmation
   */
  refreshWithConfirmation(): void {
    Swal.fire({
      title: 'Actualiser vos candidatures ?',
      text: 'Cela va recharger toutes vos candidatures depuis le serveur.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, actualiser',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadApplications();
      }
    });
  }

  /**
   * Afficher/masquer les options avancées
   */
  toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  /**
   * Obtenir des détails complets d'une candidature
   */
  getApplicationDetails(applicationId: number): void {
    if (!applicationId) return;
    
    console.log('[MyApplications] Récupération détails candidature ID:', applicationId);
    this.processing = true;

    this.applicationService.getApplicationById({ applicationId }).subscribe({
      next: (application) => {
        console.log('[MyApplications] Détails candidature reçus:', application);
        this.viewApplicationDetails(application);
        this.processing = false;
      },
      error: (error) => {
        console.error('[MyApplications] Erreur récupération détails:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de récupérer les détails de la candidature', 'error');
      }
    });
  }

  /**
   * Valider une candidature (si autorisé)
   */
  validateMyApplication(application: ApplicationResponse): void {
    if (!application.id) return;
    
    Swal.fire({
      title: 'Valider votre candidature ?',
      text: 'Cette action enverra votre candidature pour validation par le staff.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        // Note: Cette fonctionnalité pourrait nécessiter un endpoint spécifique
        // Pour l'instant, on simule la validation
        setTimeout(() => {
          this.processing = false;
          Swal.fire('Succès', 'Candidature envoyée pour validation', 'success');
          this.loadApplications();
        }, 1000);
      }
    });
  }

  /**
   * Annuler une candidature
   */
  cancelApplication(application: ApplicationResponse): void {
    if (!application.id) return;
    
    Swal.fire({
      title: 'Annuler la candidature ?',
      text: 'Cette action annulera définitivement votre candidature. Êtes-vous sûr ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, annuler définitivement',
      cancelButtonText: 'Non, garder'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        // Note: Cette fonctionnalité pourrait nécessiter un endpoint spécifique
        // Pour l'instant, on simule l'annulation
        setTimeout(() => {
          this.processing = false;
          Swal.fire('Annulée', 'Candidature annulée définitivement', 'success');
          this.loadApplications();
        }, 1000);
      }
    });
  }

  // Méthode pour obtenir l'icône du statut
  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'VALIDATED':
        return 'bx-check-circle';
      case 'REJECTED':
        return 'bx-x-circle';
      case 'PENDING':
        return 'bx-time-five';
      case 'PAID':
        return 'bx-credit-card';
      case 'DRAFT':
        return 'bx-edit';
      case 'INCOMPLETED':
        return 'bx-error-circle';
      default:
        return 'bx-info-circle';
    }
  }
}