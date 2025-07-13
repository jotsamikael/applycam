import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { TrainingCenterResponse } from '../../../services/models/training-center-response';
import { PageResponseTrainingCenterResponse } from '../../../services/models/page-response-training-center-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileControllerService } from '../../../services/services/file-controller.service';
// Ajout des imports pour les campus
import { CampusService } from '../../../services/services/campus.service';
import { CampusResponse } from '../../../services/models/campus-response';


@Component({
  selector: 'app-training-centers-management',
  templateUrl: './training-centers-management.component.html',
  styleUrls: ['./training-centers-management.component.scss']
})
export class TrainingCentersManagementComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Training Centers Management', active: true }
  ];

  dataSource = new MatTableDataSource<TrainingCenterResponse>([]);
  displayedColumns: string[] = [
    'fullName', 'acronym', 'agreementNumber', 'division', 'promoter', 'status', 'actions'
  ];
  processing = false;
  selectedTrainingCenter: TrainingCenterResponse | null = null;
  showModal = false;
  isEditMode = false;
  trainingCenterForm: FormGroup;
  followUpStat: { title: string, value: number, icon: string }[] = [];

  // Ajouts pour les boutons d'actualisation, filtres et exportation
  showAdvancedFilters = false;
  filterForm!: FormGroup;
  refreshing = false;

  // ==================== PROPRIÉTÉS POUR LES CAMPUS ====================
  // Onglet actif (centres de formation ou campus)
  activeTab: 'training-centers' | 'campuses' = 'training-centers';
  selectedTabIndex = 0; // Pour mat-tab-group
  
  // Données des campus
  campusDataSource = new MatTableDataSource<CampusResponse>([]);
  campusDisplayedColumns: string[] = ['name', 'town', 'quarter', 'capacity', 'trainingCenter', 'coordinates', 'actions'];
  selectedCampus: CampusResponse | null = null;
  campusForm: FormGroup;
  campusStats: { title: string, value: number, icon: string }[] = [];
  campusProcessing = false;
  campusShowModal = false;
  campusIsEditMode = false;
  
  // Filtres pour les campus
  campusShowAdvancedFilters = false;
  campusFilterForm!: FormGroup;
  campusRefreshing = false;

  constructor(
    private trainingCenterService: TrainingcenterService, 
    private fb: FormBuilder, 
    private fileControllerService: FileControllerService,
    // Ajout du service campus
    private campusService: CampusService
  ) {
    this.trainingCenterForm = this.fb.group({
      fullName: ['', Validators.required],
      acronym: ['', Validators.required],
      agreementNumber: ['', Validators.required],
      division: ['', Validators.required],
      promoter: [''],
      startDateOfAgreement: [''],
      endDateOfAgreement: [''],
      centerPresentCandidateForCqp: [false],
      centerPresentCandidateForDqp: [false]
    });

    // Formulaire de filtres avancés (ajout pour les boutons)
    this.filterForm = this.fb.group({
      division: [''],
      status: [''],
      acronym: ['']
    });

    // ==================== FORMULAIRES POUR LES CAMPUS ====================
    this.campusForm = this.fb.group({
      name: ['', Validators.required],
      town: ['', Validators.required],
      quarter: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      trainingCenterAgr: ['', Validators.required],
      xCoor: [0],
      yCoor: [0]
    });

    // Formulaire de filtres avancés pour les campus
    this.campusFilterForm = this.fb.group({
      town: [''],
      quarter: [''],
      trainingCenter: ['']
    });
  }

  ngOnInit(): void {
    this.loadTrainingCenters();
    this.loadCampuses();
  }

  loadTrainingCenters() {
    this.trainingCenterService.getAllTrainingCenters({
      offset: 0,
      pageSize: 1000,
      field: 'fullName',
      order: true
    }).subscribe({
      next: (res: PageResponseTrainingCenterResponse) => {
        this.dataSource.data = res.content || [];
        // Statistiques : total, actifs, inactifs (exemple)
        const total = this.dataSource.data.length;
        const actifs = this.dataSource.data.filter(c => c.centerPresentCandidateForCqp || c.centerPresentCandidateForDqp).length;
        const inactifs = total - actifs;
        this.followUpStat = [
          { title: 'Total', value: total, icon: 'bx bx-buildings' },
          { title: 'Actifs (CQP/DQP)', value: actifs, icon: 'bx bx-check-circle' },
          { title: 'Inactifs', value: inactifs, icon: 'bx bx-block' }
        ];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDetailModal(center: TrainingCenterResponse) {
    this.selectedTrainingCenter = center;
    const modalContent = this.generateDetailModalContent(center);
    Swal.fire({
      title: 'Détails du centre de formation',
      html: modalContent,
      width: '40%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: 'scrollable-swal-popup' }
    });
  }

  toggleActivation(center: TrainingCenterResponse) {
    if (!center.agreementNumber) return;
    const action = center.centerPresentCandidateForCqp || center.centerPresentCandidateForDqp ? 'désactiver' : 'activer';
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${action} ce centre de formation ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        (this.trainingCenterService as any).toggleTrainingCenter({ agreementNumber: center.agreementNumber }).subscribe({
          next: () => {
            this.loadTrainingCenters();
            this.processing = false;
            Swal.fire('Succès', `Centre ${action} avec succès`, 'success');
          },
          error: () => {
            this.processing = false;
            Swal.fire('Erreur', `Impossible de ${action} le centre`, 'error');
          }
        });
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedTrainingCenter = null;
    this.trainingCenterForm.reset({ centerPresentCandidateForCqp: false, centerPresentCandidateForDqp: false });
    this.showModal = true;
    this.openFormModal();
  }

  edit(center: TrainingCenterResponse) {
    this.isEditMode = true;
    this.selectedTrainingCenter = center;
    this.trainingCenterForm.patchValue(center);
    this.showModal = true;
    this.openFormModal();
  }

  openFormModal() {
    Swal.fire({
      title: this.isEditMode ? 'Éditer le centre' : 'Créer un centre',
      html: this.generateFormModalContent(),
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Récupère les valeurs du formulaire
        const form = document.getElementById('trainingCenterForm') as HTMLFormElement;
        if (form && form.checkValidity()) {
          const formData = new FormData(form);
          const value: any = {};
          formData.forEach((v, k) => value[k] = v);
          return value;
        } else {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        // Appelle la méthode de création ou de mise à jour ici
        if (this.isEditMode) {
          // Appel update
          // this.trainingCenterService.updateTrainingCenter(...)
        } else {
          // Appel create
          // this.trainingCenterService.createTrainingCenter(...)
        }
        this.showModal = false;
        this.loadTrainingCenters();
      } else {
        this.showModal = false;
      }
    });
  }

  generateFormModalContent(): string {
    // Génère le HTML du formulaire (simple exemple)
    return `
      <form id="trainingCenterForm">
        <div class="mb-2">
          <label>Nom</label>
          <input name="fullName" class="form-control" required value="${this.trainingCenterForm.value.fullName || ''}">
        </div>
        <div class="mb-2">
          <label>Acronyme</label>
          <input name="acronym" class="form-control" required value="${this.trainingCenterForm.value.acronym || ''}">
        </div>
        <div class="mb-2">
          <label>Numéro d'agrément</label>
          <input name="agreementNumber" class="form-control" required value="${this.trainingCenterForm.value.agreementNumber || ''}">
        </div>
        <div class="mb-2">
          <label>Division</label>
          <input name="division" class="form-control" required value="${this.trainingCenterForm.value.division || ''}">
        </div>
        <div class="mb-2">
          <label>Promoteur</label>
          <input name="promoter" class="form-control" value="${this.trainingCenterForm.value.promoter || ''}">
        </div>
        <div class="mb-2">
          <label>Date début agrément</label>
          <input name="startDateOfAgreement" type="date" class="form-control" value="${this.trainingCenterForm.value.startDateOfAgreement || ''}">
        </div>
        <div class="mb-2">
          <label>Date fin agrément</label>
          <input name="endDateOfAgreement" type="date" class="form-control" value="${this.trainingCenterForm.value.endDateOfAgreement || ''}">
        </div>
        <div class="mb-2">
          <label><input type="checkbox" name="centerPresentCandidateForCqp" ${this.trainingCenterForm.value.centerPresentCandidateForCqp ? 'checked' : ''}> Présente candidats CQP</label>
        </div>
        <div class="mb-2">
          <label><input type="checkbox" name="centerPresentCandidateForDqp" ${this.trainingCenterForm.value.centerPresentCandidateForDqp ? 'checked' : ''}> Présente candidats DQP</label>
        </div>
      </form>
    `;
  }

  private generateDetailModalContent(center: TrainingCenterResponse): string {
    console.log('[TrainingCenter] Génération des détails pour:', center);
    
    const formatDate = (date: string | null | undefined): string =>
      date ? new Date(date).toLocaleDateString('fr-FR') : 'Non renseignée';

    const generateFileLink = (label: string, fileUrl?: string | null): string => {
      console.log(`[TrainingCenter] Génération lien pour ${label}:`, fileUrl);
      if (!fileUrl) {
        return `<div class="mb-2"><strong>${label} :</strong> <em>Aucun fichier</em></div>`;
      }
      const fileName = fileUrl.split('/').pop() || 'Document';
      return `<div class="mb-2"><strong>${label} :</strong><br/>
        <a href="${fileUrl}" target="_blank" class="btn btn-sm btn-outline-primary mb-1" 
           onclick="console.log('Clic sur ${label}:', '${fileUrl}'); return true;">
          <i class="bx bx-download me-1"></i>Télécharger ${fileName}
        </a>
        <button onclick="testFileUrl('${fileUrl}', '${label}')" class="btn btn-sm btn-outline-secondary ms-1">
          <i class="bx bx-test-tube"></i>Test
        </button></div>`;
    };

    // Générer les URLs des fichiers via le service
    console.log('[TrainingCenter] AgreementNumber:', center.agreementNumber);
    
    const internalRegulationUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'REGULATION') : null;
    console.log('[TrainingCenter] URL Règlement intérieur:', internalRegulationUrl);
    
    const signatureLetterUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'SIGNATURE') : null;
    console.log('[TrainingCenter] URL Lettre signature:', signatureLetterUrl);
    
    const localisationUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'LOCALISATION') : null;
    console.log('[TrainingCenter] URL Localisation:', localisationUrl);
    
    const agreementUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'AGREEMENT') : null;
    console.log('[TrainingCenter] URL Accord:', agreementUrl);
    return `
      <div style="max-height:70vh; overflow-y:auto; text-align:left;">
        <h5 class="text-primary">Informations générales</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Nom :</strong> ${center.fullName || '-'}</p>
            <p><strong>Acronyme :</strong> ${center.acronym || '-'}</p>
            <p><strong>Numéro d'agrément :</strong> ${center.agreementNumber || '-'}</p>
            <p><strong>Division :</strong> ${center.division || '-'}</p>
            <p><strong>Promoteur :</strong> ${center.promoterName || center.promoter || '-'}</p>
            <p><strong>Date début agrément :</strong> ${formatDate(center.startDateOfAgreement)}</p>
            <p><strong>Date fin agrément :</strong> ${formatDate(center.endDateOfAgreement)}</p>
            <p><strong>Présente candidats CQP :</strong> ${center.centerPresentCandidateForCqp ? 'Oui' : 'Non'}</p>
            <p><strong>Présente candidats DQP :</strong> ${center.centerPresentCandidateForDqp ? 'Oui' : 'Non'}</p>
            <p><strong>Statut :</strong> <span class="badge bg-info">${center.status || 'DRAFT'}</span></p>
          </div>
          <div class="col-md-6">
            <p><strong>Liste des spécialités :</strong></p>
            <ul>
              ${
                (center.offersSpecialityList && center.offersSpecialityList.length > 0)
                  ? center.offersSpecialityList.map(s => {
                      const nom = (s as any).speciality?.name || (s as any).name;
                      return nom ? `<li>${nom}</li>` : '';
                    }).filter(Boolean).join('')
                  : '<li>-</li>'
              }
            </ul>
            <p><strong>Liste des campus :</strong> ${
              (center.campusList && center.campusList.length > 0)
                ? center.campusList.map(c => (c && (c as any).name ? (c as any).name : '-')).join(', ')
                : '-'
            }</p>
          </div>
        </div>
        
        <hr class="my-3">
        
        <h5 class="text-primary">Documents</h5>
        <div class="row">
          <div class="col-md-12">
            ${generateFileLink("Règlement intérieur", internalRegulationUrl)}
            ${generateFileLink("Lettre de signature", signatureLetterUrl)}
            ${generateFileLink("Fichier de localisation", localisationUrl)}
            ${generateFileLink("Fichiers d'agrément", agreementUrl)}
          </div>
        </div>
      </div>
    `;
  }

  get f() { return this.trainingCenterForm.controls; }

  onChangeStatus(center: TrainingCenterResponse) {
    console.log('Changement de statut demandé pour :', center);
    Swal.fire({
      title: `Changer le statut de ${center.fullName}`,
      html: `
        <div class="mb-2">
          <label for="statusSelect">Nouveau statut</label>
          <select id="statusSelect" class="form-control">
            <option value="VALIDATED">Validé</option>
            <option value="REJECTED">Rejeté</option>
            <option value="PENDING">En attente</option>
            <option value="DRAFT">Brouillon</option>
            <option value="INCOMPLETED">Incomplet</option>
            <option value="READYTOPAY">Prêt à payer</option>
            <option value="PAID">Payé</option>
          </select>
        </div>
        <div>
          <label for="commentInput">Commentaire</label>
          <textarea id="commentInput" class="form-control" rows="3"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const status = (document.getElementById('statusSelect') as HTMLSelectElement).value;
        const comment = (document.getElementById('commentInput') as HTMLTextAreaElement).value;
        if (!status) {
          Swal.showValidationMessage('Veuillez choisir un statut');
          return false;
        }
        return { status, comment };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const { status, comment } = result.value;
        console.log('Valeur choisie dans la modal :', { status, comment });
        this.processing = true;
        const payload = {
          agreementNumber: center.agreementNumber!,
          status,
          comment
        } as {
          agreementNumber: string;
          status: 'READYTOPAY' | 'DRAFT' | 'PAID' | 'VALIDATED' | 'INCOMPLETED' | 'REJECTED' | 'PENDING';
          comment: string;
        };
        console.log('Payload envoyé au service :', payload);
        this.trainingCenterService.changeStatus(payload).subscribe({
          next: (res) => {
            console.log('Réponse du backend (parsed):', res);
            Swal.fire('Succès', 'Statut modifié avec succès', 'success');
            this.loadTrainingCenters();
          },
          error: (err) => {
            console.error('Erreur lors du changement de statut :', err);
            Swal.fire('Erreur', 'Impossible de changer le statut', 'error');
          },
          complete: () => this.processing = false
        });
      }
    });
  }
  
  // Méthode pour tester les URLs des fichiers
  testFileUrl(url: string, label: string) {
    console.log(`[TrainingCenter] Test de l'URL ${label}:`, url);
    
    fetch(url)
      .then(response => {
        console.log(`[TrainingCenter] Réponse pour ${label}:`, response.status, response.statusText);
        if (!response.ok) {
          return response.text().then(text => {
            console.error(`[TrainingCenter] Erreur pour ${label}:`, text);
            Swal.fire('Erreur', `Erreur ${response.status}: ${text}`, 'error');
          });
        }
        return response.text().then(text => {
          console.log(`[TrainingCenter] Succès pour ${label}:`, text);
          Swal.fire('Succès', `Fichier ${label} accessible`, 'success');
        });
      })
      .catch(error => {
        console.error(`[TrainingCenter] Exception pour ${label}:`, error);
        Swal.fire('Erreur', `Exception: ${error.message}`, 'error');
      });
  }

  // ==================== MÉTHODES DE FILTRAGE ET EXPORTATION ====================

  refreshTrainingCenters(): void {
    this.refreshing = true;
    this.loadTrainingCenters();
    setTimeout(() => {
      this.refreshing = false;
    }, 1000);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applyAdvancedFilters(): void {
    const filterValue = this.filterForm.value;
    let filterString = '';
    
    Object.keys(filterValue).forEach(key => {
      if (filterValue[key]) {
        filterString += `${key}:${filterValue[key]} `;
      }
    });
    
    this.dataSource.filter = filterString.trim();
    Swal.fire('Succès', 'Filtres appliqués pour les centres de formation', 'success');
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.dataSource.filter = '';
    Swal.fire('Info', 'Filtres effacés pour les centres de formation', 'info');
  }

  exportTrainingCentersToExcel(): void {
    // TODO: Implémenter l'export Excel pour les centres de formation
    Swal.fire('Info', 'Fonctionnalité d\'export Excel pour les centres de formation en cours de développement', 'info');
  }

  // Méthodes pour la modal
  showDetails(center: TrainingCenterResponse): void {
    this.openDetailModal(center);
  }

  delete(center: TrainingCenterResponse): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer le centre ${center.fullName} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        // TODO: Implémenter la suppression
        Swal.fire('Info', 'Fonctionnalité de suppression en cours de développement', 'info');
      }
    });
  }

  onSubmit(): void {
    if (this.trainingCenterForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.processing = true;
    const formValue = this.trainingCenterForm.value;

    if (this.isEditMode) {
      // TODO: Implémenter la mise à jour
      setTimeout(() => {
        this.processing = false;
        this.showModal = false;
        this.loadTrainingCenters();
        Swal.fire('Succès', 'Centre de formation mis à jour avec succès', 'success');
      }, 1000);
    } else {
      // TODO: Implémenter la création
      setTimeout(() => {
        this.processing = false;
        this.showModal = false;
        this.loadTrainingCenters();
        Swal.fire('Succès', 'Centre de formation créé avec succès', 'success');
      }, 1000);
    }
  }

  // ==================== MÉTHODES POUR LES CAMPUS ====================

  loadCampuses(): void {
    this.campusService.findCampusByTown({
      town: 'all', // pour récupérer tous les campus
      offset: 0,
      pageSize: 1000,
      field: 'name',
      order: true
    }).subscribe({
      next: (res) => {
        this.campusDataSource.data = res.content || [];
        this.updateCampusStats();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des campus:', err);
        Swal.fire('Erreur', 'Impossible de charger les campus', 'error');
      }
    });
  }

  updateCampusStats(): void {
    const total = this.campusDataSource.data.length;
    const totalCapacity = this.campusDataSource.data.reduce((sum, campus) => sum + (campus.capacity || 0), 0);
    const averageCapacity = total > 0 ? Math.round(totalCapacity / total) : 0;
    
    this.campusStats = [
      { title: 'Total Campus', value: total, icon: 'bx bx-buildings' },
      { title: 'Capacité Totale', value: totalCapacity, icon: 'bx bx-group' },
      { title: 'Capacité Moyenne', value: averageCapacity, icon: 'bx bx-bar-chart-alt-2' }
    ];
  }

  // Méthodes CRUD pour les campus
  openCreateCampusModal(): void {
    this.campusIsEditMode = false;
    this.selectedCampus = null;
    this.campusForm.reset({ xCoor: 0, yCoor: 0 });
    this.campusShowModal = true;
    this.openCampusFormModal();
  }

  editCampus(campus: CampusResponse): void {
    this.campusIsEditMode = true;
    this.selectedCampus = campus;
    this.campusForm.patchValue({
      name: campus.name,
      town: campus.town,
      quarter: campus.quarter,
      capacity: campus.capacity,
      trainingCenterAgr: campus.trainingCenterCampus?.agreementNumber || '',
      xCoor: campus.xcoor || 0,
      yCoor: campus.ycoor || 0
    });
    this.campusShowModal = true;
    this.openCampusFormModal();
  }

  openCampusFormModal(): void {
    Swal.fire({
      title: this.campusIsEditMode ? 'Éditer le campus' : 'Créer un campus',
      html: this.generateCampusFormModalContent(),
      showCancelButton: true,
      confirmButtonText: this.campusIsEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      width: '600px',
      preConfirm: () => {
        const form = document.getElementById('campusForm') as HTMLFormElement;
        if (form && form.checkValidity()) {
          const formData = new FormData(form);
          const value: any = {};
          formData.forEach((v, k) => value[k] = v);
          return value;
        } else {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.campusProcessing = true;
        if (this.campusIsEditMode) {
          this.updateCampus(result.value);
        } else {
          this.createCampus(result.value);
        }
      }
      this.campusShowModal = false;
    });
  }

  generateCampusFormModalContent(): string {
    return `
      <form id="campusForm" class="text-left">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Nom du campus *</label>
              <input name="name" class="form-control" required value="${this.campusForm.value.name || ''}">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Ville *</label>
              <input name="town" class="form-control" required value="${this.campusForm.value.town || ''}">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Quartier *</label>
              <input name="quarter" class="form-control" required value="${this.campusForm.value.quarter || ''}">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Capacité *</label>
              <input name="capacity" type="number" class="form-control" required min="1" value="${this.campusForm.value.capacity || ''}">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Centre de formation *</label>
              <select name="trainingCenterAgr" class="form-control" required>
                <option value="">Sélectionner un centre</option>
                ${this.dataSource.data.map(center => 
                  `<option value="${center.agreementNumber}" ${this.campusForm.value.trainingCenterAgr === center.agreementNumber ? 'selected' : ''}>
                    ${center.fullName} (${center.agreementNumber})
                  </option>`
                ).join('')}
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <label class="form-label">Coordonnée X</label>
              <input name="xCoor" type="number" step="0.000001" class="form-control" value="${this.campusForm.value.xCoor || 0}">
            </div>
          </div>
          <div class="col-md-3">
            <div class="mb-3">
              <label class="form-label">Coordonnée Y</label>
              <input name="yCoor" type="number" step="0.000001" class="form-control" value="${this.campusForm.value.yCoor || 0}">
            </div>
          </div>
        </div>
      </form>
    `;
  }

  createCampus(formData: any): void {
    const campusData = {
      name: formData.name,
      town: formData.town,
      quarter: formData.quarter,
      capacity: parseInt(formData.capacity),
      trainingCenterAgr: formData.trainingCenterAgr,
      xCoor: parseFloat(formData.xCoor) || 0,
      yCoor: parseFloat(formData.yCoor) || 0
    };

    this.campusService.createCampus({ request: campusData }).subscribe({
      next: (result) => {
        this.campusProcessing = false;
        this.loadCampuses();
        Swal.fire('Succès', `Campus "${result}" créé avec succès`, 'success');
      },
      error: (err) => {
        this.campusProcessing = false;
        console.error('Erreur lors de la création du campus:', err);
        Swal.fire('Erreur', 'Impossible de créer le campus', 'error');
      }
    });
  }

  updateCampus(formData: any): void {
    if (!this.selectedCampus?.name) {
      Swal.fire('Erreur', 'Campus non sélectionné', 'error');
      return;
    }

    const campusData = {
      oldName: this.selectedCampus.name,
      name: formData.name,
      town: formData.town,
      quarter: formData.quarter,
      capacity: parseInt(formData.capacity),
      xCoor: parseFloat(formData.xCoor) || 0,
      yCoor: parseFloat(formData.yCoor) || 0
    };

    this.campusService.updateCampus({ body: campusData }).subscribe({
      next: (result) => {
        this.campusProcessing = false;
        this.loadCampuses();
        Swal.fire('Succès', `Campus "${result}" mis à jour avec succès`, 'success');
      },
      error: (err) => {
        this.campusProcessing = false;
        console.error('Erreur lors de la mise à jour du campus:', err);
        Swal.fire('Erreur', 'Impossible de mettre à jour le campus', 'error');
      }
    });
  }

  deleteCampus(campus: CampusResponse): void {
    if (!campus.name) return;

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer le campus "${campus.name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.campusProcessing = true;
        this.campusService.deleteCampus({ name: campus.name }).subscribe({
          next: (result) => {
            this.campusProcessing = false;
            this.loadCampuses();
            Swal.fire('Succès', `Campus "${campus.name}" supprimé avec succès`, 'success');
          },
          error: (err) => {
            this.campusProcessing = false;
            console.error('Erreur lors de la suppression du campus:', err);
            Swal.fire('Erreur', 'Impossible de supprimer le campus', 'error');
          }
        });
      }
    });
  }

  openCampusDetailModal(campus: CampusResponse): void {
    const modalContent = this.generateCampusDetailModalContent(campus);
    Swal.fire({
      title: 'Détails du campus',
      html: modalContent,
      width: '50%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: 'scrollable-swal-popup' }
    });
  }

  generateCampusDetailModalContent(campus: CampusResponse): string {
    return `
      <div style="max-height:70vh; overflow-y:auto; text-align:left;">
        <h5 class="text-primary">Informations du campus</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Nom :</strong> ${campus.name || '-'}</p>
            <p><strong>Ville :</strong> ${campus.town || '-'}</p>
            <p><strong>Quartier :</strong> ${campus.quarter || '-'}</p>
            <p><strong>Capacité :</strong> ${campus.capacity || 0} étudiants</p>
          </div>
          <div class="col-md-6">
            <p><strong>Centre de formation :</strong> ${campus.trainingCenterCampus?.fullName || '-'}</p>
            <p><strong>Numéro d'agrément :</strong> ${campus.trainingCenterCampus?.agreementNumber || '-'}</p>
            <p><strong>Coordonnées :</strong> (${campus.xcoor || 0}, ${campus.ycoor || 0})</p>
          </div>
        </div>
      </div>
    `;
  }

  // Méthodes de filtrage et exportation pour les campus
  refreshCampuses(): void {
    this.campusRefreshing = true;
    this.loadCampuses();
    setTimeout(() => {
      this.campusRefreshing = false;
    }, 1000);
  }

  toggleCampusAdvancedFilters(): void {
    this.campusShowAdvancedFilters = !this.campusShowAdvancedFilters;
  }

  applyCampusAdvancedFilters(): void {
    const filterValue = this.campusFilterForm.value;
    let filterString = '';
    
    Object.keys(filterValue).forEach(key => {
      if (filterValue[key]) {
        filterString += `${key}:${filterValue[key]} `;
      }
    });
    
    this.campusDataSource.filter = filterString.trim();
    Swal.fire('Succès', 'Filtres appliqués pour les campus', 'success');
  }

  clearCampusFilters(): void {
    this.campusFilterForm.reset();
    this.campusDataSource.filter = '';
    Swal.fire('Info', 'Filtres effacés pour les campus', 'info');
  }

  exportCampusesToExcel(): void {
    Swal.fire('Info', 'Fonctionnalité d\'export Excel pour les campus en cours de développement', 'info');
  }

  applyCampusFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.campusDataSource.filter = filterValue.trim().toLowerCase();
  }

  // Méthode pour changer d'onglet
  switchTab(tab: 'training-centers' | 'campuses'): void {
    this.activeTab = tab;
  }
}
