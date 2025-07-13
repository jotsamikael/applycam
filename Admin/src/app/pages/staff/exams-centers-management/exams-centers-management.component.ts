import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ExamCenterControllerService } from '../../../services/services/exam-center-controller.service';
import { CreateCenterRequest } from '../../../services/models/create-center-request';
import { UpdateCenterRequest } from '../../../services/models/update-center-request';
import { ExamCenterResponse } from '../../../services/models/exam-center-response';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  // Statistiques
  examCenterStats = [
    { title: 'Total Centres', value: 0, icon: 'building' },
    { title: 'Centres Actifs', value: 0, icon: 'check-circle' },
    { title: 'Capacité Totale', value: 0, icon: 'users' },
    { title: 'Candidats Assignés', value: 0, icon: 'user-check' }
  ];

  // Tableau des centres d'examen
  displayedColumns: string[] = [
    'name', 
    'region', 
    'division', 
    'capacity', 
    'actions'
  ];
  
  dataSource = new MatTableDataSource<ExamCenterResponse>([]);
  processing = false;
  modalRef?: BsModalRef;
  examCenterForm!: FormGroup;
  selectedExamCenter: ExamCenterResponse | null = null;
  
  // États
  showModal = false;
  isEditMode = false;
  currentExamCenterId: number | null = null;
  
  // Pagination
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  
  // Filtres
  searchTerm = '';
  showAdvancedFilters = false;
  filterForm!: FormGroup;
  refreshing = false;
  
  // Options pour les formulaires
  regionOptions = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
  ];

  divisionOptions = [
    'Dja-et-Lobo', 'Haute-Sanaga', 'Lekie', 'Mbam-et-Inoubou', 'Mbam-et-Kim', 'Mefou-et-Afamba', 'Mefou-et-Akono', 'Mfoundi', 'Nyong-et-Kelle', 'Nyong-et-Mfoumou', 'Nyong-et-So\'o',
    'Boumba-et-Ngoko', 'Haut-Nyong', 'Kadey', 'Lom-et-Djerem',
    'Diamare', 'Logone-et-Chari', 'Mayo-Danay', 'Mayo-Kani', 'Mayo-Sava', 'Mayo-Tsanaga',
    'Fako', 'Koupé-Manengouba', 'Lebialem', 'Manyu', 'Meme', 'Ndian',
    'Bénoué', 'Faro', 'Mayo-Louti', 'Mayo-Rey',
    'Boyo', 'Bui', 'Donga-Mantung', 'Menchum', 'Mezam', 'Momo', 'Ngo-Ketunjia',
    'Bamboutos', 'Haut-Nkam', 'Hauts-Plateaux', 'Koung-Khi', 'Ménoua', 'Mifi', 'Ndé', 'Noun'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private examCenterService: ExamCenterControllerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadExamCenters();
    this.updateStats();
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

  get f() {
    return this.examCenterForm.controls;
  }

  loadExamCenters(event?: PageEvent) {
    console.log('[ExamCentersManagement] loadExamCenters appelé avec event:', event);
    this.processing = true;
    const offset = event?.pageIndex ?? this.pageIndex;
    const pageSize = event?.pageSize ?? this.pageSize;

    const params: any = {
      offset,
      pageSize,
      field: 'name',
      order: true
    };

    console.log('[ExamCentersManagement] Paramètres de requête:', params);

    this.examCenterService.getAllExamCenters(params).subscribe({
      next: (res) => {
        console.log('[ExamCentersManagement] getAllExamCenters succès:', res);
        console.log('[ExamCentersManagement] Contenu reçu:', res.content);
        console.log('[ExamCentersManagement] Nombre d\'éléments:', res.content?.length);
        
        this.dataSource.data = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.pageSize = res.size || pageSize;
        this.pageIndex = res.number || offset;
        
        console.log('[ExamCentersManagement] DataSource mis à jour:', this.dataSource.data);
        console.log('[ExamCentersManagement] Total elements:', this.totalElements);
        
        this.updateStats();
        this.processing = false;
        this.showSnackBar(`Chargement de ${this.dataSource.data.length} centres d'examen`, 'success');
      },
      error: (err) => {
        console.error('[ExamCentersManagement] Erreur lors du chargement:', err);
        console.error('[ExamCentersManagement] Détails de l\'erreur:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.showSnackBar('Erreur lors du chargement des centres d\'examen', 'error');
        this.processing = false;
      }
    });
  }

  updateStats() {
    const all = this.dataSource.data;
    this.examCenterStats[0].value = all.length;
    this.examCenterStats[1].value = all.length; // Tous les centres sont actifs par défaut
    this.examCenterStats[2].value = all.reduce((sum, center) => sum + (center.capacity || 0), 0);
    this.examCenterStats[3].value = 0; // À calculer si nécessaire
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Modal pour les centres d'examen
  openCreateExamCenterModal() {
    this.isEditMode = false;
    this.currentExamCenterId = null;
    this.examCenterForm.reset({
      capacity: 0
    });
    this.showModal = true;
  }

  editExamCenter(examCenter: ExamCenterResponse) {
    this.selectedExamCenter = examCenter;
    this.isEditMode = true;
    this.currentExamCenterId = examCenter.id || null;
    
    this.examCenterForm.patchValue({
      name: examCenter.name,
      region: examCenter.region,
      division: examCenter.division,
      capacity: examCenter.capacity || 0
    });
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.currentExamCenterId = null;
    this.selectedExamCenter = null;
    this.examCenterForm.reset();
  }

  onSubmit() {
    if (this.examCenterForm.invalid) {
      this.markFormGroupTouched(this.examCenterForm);
      this.showSnackBar('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    this.processing = true;
    const formValue = this.examCenterForm.value;
    
    if (this.isEditMode && this.currentExamCenterId) {
      const updateRequest: UpdateCenterRequest = {
        ...formValue,
        examCenterId: this.currentExamCenterId
      };
      
      this.examCenterService.updateExamCenter({ body: updateRequest }).subscribe({
        next: (id) => {
          this.loadExamCenters();
          this.processing = false;
          this.closeModal();
          this.showSnackBar('Centre d\'examen mis à jour avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur mise à jour centre d\'examen:', error);
          this.processing = false;
          this.showSnackBar('Erreur lors de la mise à jour du centre d\'examen', 'error');
        }
      });
    } else {
      const createRequest: CreateCenterRequest = formValue;
      
      this.examCenterService.createExamCenter({ body: createRequest }).subscribe({
        next: (result) => {
          this.loadExamCenters();
          this.processing = false;
          this.closeModal();
          this.showSnackBar('Centre d\'examen créé avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur création centre d\'examen:', error);
          this.processing = false;
          this.showSnackBar('Erreur lors de la création du centre d\'examen', 'error');
        }
      });
    }
  }

  deleteExamCenter(examCenter: ExamCenterResponse) {
    if (!examCenter.id) return;
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer le centre d'examen "${examCenter.name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.examCenterService.deleteSession1({ examCenterId: examCenter.id }).subscribe({
          next: () => {
            this.loadExamCenters();
            this.processing = false;
            this.showSnackBar('Centre d\'examen supprimé avec succès', 'success');
          },
          error: (error) => {
            console.error('Erreur suppression:', error);
            this.processing = false;
            this.showSnackBar('Erreur lors de la suppression', 'error');
          }
        });
      }
    });
  }

  assignExamCenter(examCenter: ExamCenterResponse) {
    if (!examCenter.id) return;
    
    Swal.fire({
      title: 'Assigner le centre d\'examen',
      text: `Voulez-vous assigner le centre "${examCenter.name}" à un candidat ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.examCenterService.assignExamCenter({ id: examCenter.id }).subscribe({
          next: () => {
            this.processing = false;
            this.showSnackBar('Centre d\'examen assigné avec succès', 'success');
          },
          error: (error) => {
            console.error('Erreur assignation:', error);
            this.processing = false;
            this.showSnackBar('Erreur lors de l\'assignation', 'error');
          }
        });
      }
    });
  }

  searchByDivision(division: string) {
    if (!division || division.trim().length < 2) {
      this.showSnackBar('Veuillez saisir au moins 2 caractères pour la recherche', 'warning');
      return;
    }

    console.log('[ExamCentersManagement] Recherche par division:', division);
    this.processing = true;

    const params: any = {
      division: division.trim(),
      offset: 0,
      pageSize: 100,
      field: 'name',
      order: true
    };

    this.examCenterService.findByName4(params).subscribe({
      next: (res) => {
        console.log('[ExamCentersManagement] Recherche par division succès:', res);
        this.dataSource.data = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.processing = false;
        this.showSnackBar(`Recherche terminée: ${res.content?.length || 0} centre(s) trouvé(s)`, 'success');
      },
      error: (error) => {
        console.error('[ExamCentersManagement] Erreur recherche par division:', error);
        this.processing = false;
        this.showSnackBar('Erreur lors de la recherche par division', 'error');
      }
    });
  }

  openDetailExamCenterPopup(examCenter: ExamCenterResponse) {
    const detailsHtml = `
      <div class="text-start">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Informations du centre</h6>
            <p><strong>ID:</strong> ${examCenter.id || 'N/A'}</p>
            <p><strong>Nom:</strong> ${examCenter.name || 'N/A'}</p>
            <p><strong>Région:</strong> ${examCenter.region || 'N/A'}</p>
          </div>
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Détails</h6>
            <p><strong>Division:</strong> ${examCenter.division || 'N/A'}</p>
            <p><strong>Capacité:</strong> ${examCenter.capacity || 0} candidats</p>
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

  // Utilitaires
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showSnackBar(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      panelClass: `snackbar-${type}`
    });
  }

  // Gestion des filtres et exportation
  refreshExamCenters(): void {
    this.refreshing = true;
    this.loadExamCenters();
    setTimeout(() => {
      this.refreshing = false;
    }, 1000);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applyAdvancedFilters(): void {
    const filterValue = this.filterForm.value;
    if (filterValue.region || filterValue.division) {
      // Appliquer les filtres
      this.loadExamCenters();
      this.showSnackBar('Filtres appliqués', 'success');
    } else {
      this.showSnackBar('Veuillez sélectionner au moins un filtre', 'warning');
    }
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadExamCenters();
    this.showSnackBar('Filtres effacés', 'info');
  }

  exportExamCentersToExcel(): void {
    const data = this.dataSource.data;
    if (data.length === 0) {
      this.showSnackBar('Aucune donnée à exporter', 'warning');
      return;
    }

    // Créer un fichier CSV simple
    const headers = ['ID', 'Nom', 'Région', 'Division', 'Capacité'];
    const csvContent = [
      headers.join(','),
      ...data.map(center => [
        center.id || '',
        center.name || '',
        center.region || '',
        center.division || '',
        center.capacity || ''
      ].join(','))
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `centres_examen_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showSnackBar(`Export terminé: ${data.length} centre(s) exporté(s)`, 'success');
  }
}
