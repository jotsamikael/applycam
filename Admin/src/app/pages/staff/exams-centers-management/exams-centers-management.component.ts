import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ExamCenterControllerService } from '../../../services/services/exam-center-controller.service';
import { ApplicationService } from '../../../services/services/application.service';
import { ApplicationResponse } from '../../../services/models/application-response';
import { ExamCenterResponse } from '../../../services/models/exam-center-response';
import { SessionService } from '../../../services/services/session.service';

@Component({
  selector: 'app-exams-centers-management',
  templateUrl: './exams-centers-management.component.html',
  styleUrls: ['./exams-centers-management.component.scss']
})
export class ExamsCentersManagementComponent implements OnInit, AfterViewInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Gestion des Centres d\'Examen', active: true }
  ];

  // Onglets
  activeTab = 'centers';
  showAdvancedFilters = false;

  // Statistiques des centres d'examen
  examCenterStats = [
    { title: 'Total Centres', value: 0, icon: 'building' },
    { title: 'Centres Actifs', value: 0, icon: 'check-circle' },
    { title: 'Capacité Totale', value: 0, icon: 'users' }
  ];

  // Statistiques des candidats par session
  candidateStats = [
    { title: 'Total Candidats', value: 0, icon: 'user-circle' },
    { title: 'Validés', value: 0, icon: 'check-circle' },
    { title: 'En attente', value: 0, icon: 'time' },
    { title: 'Rejetés', value: 0, icon: 'x-circle' }
  ];

  // Centres d'examen
  displayedColumns: string[] = ['name', 'region', 'division', 'capacity', 'actions'];
  dataSource = new MatTableDataSource<ExamCenterResponse>([]);
  processing = false;
  modalRef?: BsModalRef;
  examCenterForm!: FormGroup;
  filterForm!: FormGroup;
  selectedExamCenter: ExamCenterResponse | null = null;
  isEditMode = false;
  showModal = false;
  
  // Pagination
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  
  // Options pour les filtres
  regionOptions: string[] = ['Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'];
  divisionOptions: string[] = ['Bamenda', 'Buea', 'Douala', 'Ebolowa', 'Garoua', 'Kribi', 'Kumba', 'Kumbo', 'Limbe', 'Maroua', 'Ngaoundere', 'Yaounde'];

  // Candidats par session
  displayedCandidateColumns: string[] = ['candidateName', 'examCenter', 'session', 'speciality', 'status', 'actions'];
  candidatesDataSource = new MatTableDataSource<any>([]);
  candidatesBySession: any[] = [];
  sessions: string[] = [];
  selectedSession: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private examCenterService: ExamCenterControllerService,
    private applicationService: ApplicationService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadExamCenters();
    this.loadCandidatesBySession();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForms() {
    this.examCenterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      region: ['', [Validators.required]],
      division: ['', [Validators.required]],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });

    // Formulaire de filtres avancés
    this.filterForm = this.fb.group({
      region: [''],
      division: ['']
    });
  }

  // Méthode pour changer d'onglet
  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'candidates') {
      this.loadCandidatesBySession();
    }
  }

  // Méthodes pour les centres d'examen
  loadExamCenters(event?: PageEvent) {
    const offset = event?.pageIndex ?? this.pageIndex;
    const pageSize = event?.pageSize ?? this.pageSize;

    this.examCenterService.getAllExamCenters({
      offset,
      pageSize,
      field: 'name',
      order: true
    }).subscribe({
      next: (res) => {
        this.dataSource.data = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.pageSize = res.size || pageSize;
        this.pageIndex = res.number || offset;
        this.updateExamCenterStats();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des centres:', err);
        Swal.fire('Error', 'Failed to load exam centers', 'error');
      }
    });
  }

  updateExamCenterStats() {
    const all = this.dataSource.data;
    this.examCenterStats[0].value = all.length;
    this.examCenterStats[1].value = all.length; // Tous les centres sont actifs par défaut
    this.examCenterStats[2].value = all.reduce((sum, center) => sum + (center.capacity || 0), 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedExamCenter = null;
    this.examCenterForm.reset();
    this.showModal = true;
  }

  edit(row: ExamCenterResponse) {
    this.isEditMode = true;
    this.selectedExamCenter = row;
    this.examCenterForm.patchValue({
      name: row.name,
      region: row.region,
      division: row.division,
      capacity: row.capacity
    });
    this.showModal = true;
  }

  viewDetails(row: ExamCenterResponse) {
    let detailsHtml = `
      <div class="text-start">
        <div class="row">
          <div class="col-md-6">
            <p><strong>Nom:</strong> ${row.name || 'N/A'}</p>
            <p><strong>Région:</strong> ${row.region || 'N/A'}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Division:</strong> ${row.division || 'N/A'}</p>
            <p><strong>Capacité:</strong> ${row.capacity || 0} candidats</p>
          </div>
        </div>
      </div>
    `;
    Swal.fire({
      title: `Détails du centre d'examen`,
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

  delete(row: ExamCenterResponse) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action ne peut pas être annulée !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed && row.id) {
        this.examCenterService.deleteSession1({ examCenterId: row.id }).subscribe({
          next: () => {
            this.loadExamCenters();
            Swal.fire('Supprimé !', 'Le centre d\'examen a été supprimé.', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression du centre d\'examen', 'error');
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.examCenterForm.invalid) return;
    this.processing = true;

    const formValue = this.examCenterForm.value;
    
    if (this.isEditMode && this.selectedExamCenter) {
      // Mise à jour
      this.examCenterService.updateExamCenter({ body: { ...formValue, examCenterId: this.selectedExamCenter.id } }).subscribe({
        next: () => {
          this.loadExamCenters();
          this.processing = false;
          this.closeModal();
          Swal.fire('Success', 'Centre d\'examen mis à jour avec succès', 'success');
        },
        error: () => {
          this.processing = false;
          Swal.fire('Error', 'Failed to update exam center', 'error');
        }
      });
    } else {
      // Création
      this.examCenterService.createExamCenter({ body: formValue }).subscribe({
        next: () => {
          this.loadExamCenters();
          this.processing = false;
          this.closeModal();
          Swal.fire('Success', 'Centre d\'examen créé avec succès', 'success');
        },
        error: () => {
          this.processing = false;
          Swal.fire('Error', 'Failed to create exam center', 'error');
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.examCenterForm.reset();
    this.selectedExamCenter = null;
  }

  onPageChange(event: PageEvent) {
    this.loadExamCenters(event);
  }

  applyAdvancedFilters() {
    // Implémentation des filtres avancés
    console.log('Filtres appliqués:', this.filterForm.value);
  }

  clearFilters() {
    this.filterForm.reset();
            this.loadExamCenters();
  }

  // Méthodes pour les candidats par session
  loadCandidatesBySession() {
    // Récupérer toutes les sessions du système
    this.sessionService.getall().subscribe({
      next: (sessionsResponse) => {
        // Créer la liste des sessions avec type d'examen
        this.sessions = sessionsResponse.content.map(session => 
          `${session.sessionYear} (${session.examType})`
        );
        
        // Maintenant charger les candidatures
        this.loadApplicationsForSessions();
          },
          error: (error) => {
        console.error('Erreur lors du chargement des sessions:', error);
      }
    });
  }

  loadApplicationsForSessions() {
    this.applicationService.getAllApplicationsIncludingInactive().subscribe({
      next: (response) => {
        console.log('DEBUG - Applications reçues:', response.content);
        
        // Grouper les candidatures par année de session
        const groupedByYear = new Map<string, any[]>();
        
        response.content.forEach(application => {
          const year = application.applicationYear || 'N/A';
          if (!groupedByYear.has(year)) {
            groupedByYear.set(year, []);
          }
          groupedByYear.get(year)!.push(application);
          
          // Debug pour chaque application
          console.log(`DEBUG - Application ${application.id}:`, {
            candidateName: application.candidateName,
            examCenterName: application.examCenterName,
            examCenterRegion: application.examCenterRegion,
            status: application.status
          });
        });
        
        // Convertir en tableau et trier par année décroissante
        this.candidatesBySession = Array.from(groupedByYear.entries())
          .map(([year, applications]) => ({
            year,
            applications,
            examType: applications[0]?.examType || 'N/A'
          }))
          .sort((a, b) => b.year.localeCompare(a.year));
        
        // Sélectionner la première session par défaut
        if (this.sessions.length > 0 && !this.selectedSession) {
          this.selectedSession = this.sessions[0];
          this.updateCandidatesDataSource();
        }
          },
          error: (error) => {
        console.error('Erreur lors du chargement des candidatures:', error);
      }
    });
  }

  updateCandidatesDataSource() {
    if (this.selectedSession) {
      // Extraire l'année et le type d'examen de la session (format: "2024 (DQP)")
      const yearMatch = this.selectedSession.match(/^(\d{4})/);
      const examTypeMatch = this.selectedSession.match(/\(([^)]+)\)/);
      
      const year = yearMatch ? yearMatch[1] : this.selectedSession;
      const examType = examTypeMatch ? examTypeMatch[1] : '';
      
      // Chercher les candidatures pour cette session
      const sessionData = this.candidatesBySession.find(s => s.year === year);
      this.candidatesDataSource.data = sessionData ? sessionData.applications : [];
      
      // Si aucune candidature pour cette session, afficher un message
      if (!sessionData || sessionData.applications.length === 0) {
        console.log(`Aucune candidature trouvée pour la session ${year} (${examType})`);
      }
    } else {
      this.candidatesDataSource.data = [];
    }
    this.updateCandidateStats();
  }

  updateCandidateStats() {
    const all = this.candidatesDataSource.data;
    this.candidateStats[0].value = all.length;
    this.candidateStats[1].value = all.filter(c => c.status === 'VALIDATED').length;
    this.candidateStats[2].value = all.filter(c => c.status === 'PENDING').length;
    this.candidateStats[3].value = all.filter(c => c.status === 'REJECTED').length;
  }

  // Changer de session
  onSessionChange(event: any) {
    this.selectedSession = event.target.value;
    this.updateCandidatesDataSource();
  }

  // Obtenir le statut coloré
  getStatusColor(status: string): string {
    switch (status) {
      case 'VALIDATED': return 'success';
      case 'PAID': return 'info';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      case 'DRAFT': return 'secondary';
      default: return 'secondary';
    }
  }

  // Obtenir le nom du centre d'examen
  getExamCenterName(application: any): string {
    // Si l'application a un centre d'examen assigné
    if (application.examCenterName && application.examCenterName !== 'Non assigné') {
      // Afficher le nom du centre avec la région si disponible
      if (application.examCenterRegion) {
        return `${application.examCenterName} (${application.examCenterRegion})`;
      }
      return application.examCenterName;
    }
    
    // Si le statut est VALIDATED mais pas de centre assigné
    if (application.status === 'VALIDATED') {
      return 'En cours d\'assignation';
    }
    
    // Par défaut
    return 'Non assigné';
  }

  // Obtenir la couleur du badge pour le centre d'examen
  getExamCenterBadgeColor(application: any): string {
    if (application.examCenterName && application.examCenterName !== 'Non assigné') {
      return 'success'; // Vert pour centre assigné
    }
    if (application.status === 'VALIDATED') {
      return 'warning'; // Orange pour en cours d'assignation
    }
    return 'secondary'; // Gris pour non assigné
  }

  // Méthodes pour les actions sur les candidats
  viewApplicationDetails(application: ApplicationResponse) {
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

  validateApplication(application: ApplicationResponse) {
    if (!application.id) return;
    
    Swal.fire({
      title: 'Valider la candidature',
      text: 'Êtes-vous sûr de vouloir valider cette candidature ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.applicationService.validateApplication({ id: application.id }).subscribe({
          next: () => {
            this.loadCandidatesBySession();
            Swal.fire('Succès', 'Candidature validée avec succès', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la validation de la candidature', 'error');
          }
        });
      }
    });
  }

  rejectApplication(application: ApplicationResponse) {
    if (!application.id) return;
    
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
        this.applicationService.rejectApplication({ id: application.id, comment: result.value }).subscribe({
          next: () => {
            this.loadCandidatesBySession();
            Swal.fire('Succès', 'Candidature rejetée avec succès', 'success');
          },
          error: () => {
            Swal.fire('Erreur', 'Échec du rejet de la candidature', 'error');
          }
        });
      }
    });
  }
}
