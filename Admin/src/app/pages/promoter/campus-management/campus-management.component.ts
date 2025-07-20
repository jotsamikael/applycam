import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CampusService } from '../../../services/services/campus.service';
import { CampusResponse } from '../../../services/models/campus-response';
import { TokenService } from '../../../services/token/token.service';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { TrainingCenterResponse } from '../../../services/models/training-center-response';
import { SpecialityService } from '../../../services/services/speciality.service';
import { SpecialityResponse } from '../../../services/models/speciality-response';

@Component({
  selector: 'app-campus-management',
  templateUrl: './campus-management.component.html',
  styleUrls: ['./campus-management.component.scss']
})
export class CampusManagementComponent implements OnInit, AfterViewInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'My Campuses', active: true }
  ];

  displayedColumns: string[] = ['name', 'town', 'quarter', 'capacity', 'actions'];
  dataSource = new MatTableDataSource<CampusResponse>([]);
  
  stats = [
    { title: 'Total Campus', value: 0, icon: 'buildings' },
    { title: 'Capacité Totale', value: 0, icon: 'group' },
    { title: 'Campus Actifs', value: 0, icon: 'check-circle' },
    { title: 'Capacité Moyenne', value: 0, icon: 'bar-chart' }
  ];
  
  isLoading = false;
  processing = false;
  selectedCampus: CampusResponse | null = null;
  errorMessages: string[] = [];
  trainingCenters: TrainingCenterResponse[] = [];
  specialities: SpecialityResponse[] = [];

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private campusService: CampusService,
    private trainingCenterService: TrainingcenterService,
    private specialityService: SpecialityService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    console.log('CampusManagementComponent constructor called');
  }

  ngOnInit(): void {
    console.log('CampusManagementComponent ngOnInit called');
    this.loadTrainingCenters();
    this.loadSpecialities();
    this.loadCampuses();
  }

  ngAfterViewInit() {
    console.log('CampusManagementComponent ngAfterViewInit called');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTrainingCenters() {
    console.log('loadTrainingCenters called');
    this.trainingCenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next: (centers) => {
        console.log('Training centers loaded:', centers);
        this.trainingCenters = centers;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des centres de formation:', error);
        this.trainingCenters = [];
      }
    });
  }

  loadSpecialities() {
    console.log('loadSpecialities called');
    this.specialityService.getallSpeciality({ offset: 0, pageSize: 100 }).subscribe({
      next: (res) => {
        console.log('Specialities loaded:', res);
        this.specialities = res.content || [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des spécialités:', error);
        this.specialities = [];
      }
    });
  }

  loadCampuses(event?: PageEvent) {
    console.log('loadCampuses called');
    this.isLoading = true;
    this.campusService.findAllCampusesOfPromoter().subscribe({
      next: (campuses) => {
        console.log('Campuses loaded:', campuses);
        this.dataSource.data = campuses;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateStats(campuses);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des campus:', error);
        this.isLoading = false;
        Swal.fire('Erreur', 'Impossible de charger les campus', 'error');
      }
    });
  }

  updateStats(campuses: CampusResponse[]) {
    console.log('updateStats called with:', campuses);
    this.stats[0].value = campuses.length;
    this.stats[1].value = campuses.reduce((sum, c) => sum + (c.capacity || 0), 0);
    this.stats[2].value = campuses.filter(c => c.name && c.name !== 'this campus is deleted').length;
    this.stats[3].value = campuses.length > 0 ? Math.round(campuses.reduce((sum, c) => sum + (c.capacity || 0), 0) / campuses.length) : 0;
    console.log('Stats updated:', this.stats);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreatePopup() {
    console.log('openCreatePopup called');
    
    if (this.trainingCenters.length === 0) {
      Swal.fire('Erreur', 'Aucun centre de formation disponible. Veuillez d\'abord créer un centre de formation.', 'error');
      return;
    }

    const trainingCenterOptions = this.trainingCenters.map(tc => 
      `<option value="${tc.agreementNumber}">${tc.fullName} (${tc.agreementNumber})</option>`
    ).join('');

    Swal.fire({
      title: 'Créer un nouveau campus',
      html: `
        <div class="mb-3">
          <label class="form-label">Centre de formation <span class="text-danger">*</span></label>
          <select id="swal-input-training-center" class="form-control" required>
            <option value="">Sélectionner un centre de formation</option>
            ${trainingCenterOptions}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Nom du campus <span class="text-danger">*</span></label>
          <input id="swal-input-name" class="form-control" placeholder="Nom du campus" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Ville <span class="text-danger">*</span></label>
          <input id="swal-input-town" class="form-control" placeholder="Ville" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Quartier</label>
          <input id="swal-input-quarter" class="form-control" placeholder="Quartier">
        </div>
        <div class="mb-3">
          <label class="form-label">Capacité <span class="text-danger">*</span></label>
          <input id="swal-input-capacity" class="form-control" type="number" min="1" placeholder="Capacité" required>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const trainingCenterAgr = (document.getElementById('swal-input-training-center') as HTMLSelectElement).value;
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const town = (document.getElementById('swal-input-town') as HTMLInputElement).value.trim();
        const quarter = (document.getElementById('swal-input-quarter') as HTMLInputElement).value.trim();
        const capacity = +(document.getElementById('swal-input-capacity') as HTMLInputElement).value;

        if (!trainingCenterAgr) {
          Swal.showValidationMessage('Le centre de formation est requis');
          return false;
        }
        if (!name) {
          Swal.showValidationMessage('Le nom du campus est requis');
          return false;
        }
        if (!town) {
          Swal.showValidationMessage('La ville est requise');
          return false;
        }
        if (!capacity || capacity < 1) {
          Swal.showValidationMessage('La capacité doit être un nombre positif');
          return false;
        }

        return { trainingCenterAgr, name, town, quarter, capacity };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.createCampus(result.value);
      }
    });
  }

  createCampus(campusData: any) {
    console.log('createCampus called with:', campusData);
    this.processing = true;
    this.campusService.createCampus({ request: campusData }).subscribe({
      next: () => {
        this.loadCampuses();
        this.processing = false;
        Swal.fire('Succès', 'Campus créé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Erreur lors de la création du campus', 'error');
      }
    });
  }

  openEditPopup(campus: CampusResponse) {
    console.log('openEditPopup called for campus:', campus);
    this.selectedCampus = campus;
    
    Swal.fire({
      title: 'Modifier le campus',
      html: `
        <div class="mb-3">
          <label class="form-label">Nom du campus <span class="text-danger">*</span></label>
          <input id="swal-input-name" class="form-control" value="${campus.name || ''}" placeholder="Nom du campus" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Ville <span class="text-danger">*</span></label>
          <input id="swal-input-town" class="form-control" value="${campus.town || ''}" placeholder="Ville" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Quartier</label>
          <input id="swal-input-quarter" class="form-control" value="${campus.quarter || ''}" placeholder="Quartier">
        </div>
        <div class="mb-3">
          <label class="form-label">Capacité <span class="text-danger">*</span></label>
          <input id="swal-input-capacity" class="form-control" type="number" min="1" value="${campus.capacity || ''}" placeholder="Capacité" required>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Mettre à jour',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const town = (document.getElementById('swal-input-town') as HTMLInputElement).value.trim();
        const quarter = (document.getElementById('swal-input-quarter') as HTMLInputElement).value.trim();
        const capacity = +(document.getElementById('swal-input-capacity') as HTMLInputElement).value;

        if (!name) {
          Swal.showValidationMessage('Le nom du campus est requis');
          return false;
        }
        if (!town) {
          Swal.showValidationMessage('La ville est requise');
          return false;
        }
        if (!capacity || capacity < 1) {
          Swal.showValidationMessage('La capacité doit être un nombre positif');
          return false;
        }

        return { name, town, quarter, capacity };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value && this.selectedCampus) {
        this.updateCampus(result.value);
      }
    });
  }

  updateCampus(updatedData: any) {
    if (!this.selectedCampus) return;
    
    console.log('updateCampus called with:', updatedData);
    this.processing = true;
    const updatePayload = {
      body: {
        oldName: this.selectedCampus.name!,
        name: updatedData.name,
        capacity: updatedData.capacity,
        quarter: updatedData.quarter,
        town: updatedData.town,
        xcoor: this.selectedCampus.xcoor || 0.0,
        ycoor: this.selectedCampus.ycoor || 0.0
      }
    };

    this.campusService.updateCampus(updatePayload).subscribe({
      next: () => {
        this.loadCampuses();
        this.processing = false;
        this.selectedCampus = null;
        Swal.fire('Succès', 'Campus mis à jour avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
    this.processing = false;
        Swal.fire('Erreur', 'Erreur lors de la mise à jour du campus', 'error');
      }
    });
  }

  viewCampusDetails(campus: CampusResponse) {
    console.log('viewCampusDetails called for campus:', campus);
    Swal.fire({
      title: `Détails du campus: ${campus.name}`,
      html: `
        <div class="text-start">
          <div class="mb-3">
            <strong>Nom:</strong> ${campus.name || 'Non spécifié'}
          </div>
          <div class="mb-3">
            <strong>Ville:</strong> ${campus.town || 'Non spécifiée'}
          </div>
          <div class="mb-3">
            <strong>Quartier:</strong> ${campus.quarter || 'Non spécifié'}
          </div>
          <div class="mb-3">
            <strong>Capacité:</strong> ${campus.capacity || 0} étudiants
          </div>
          <div class="mb-3">
            <strong>Coordonnées:</strong> 
            <br>X: ${campus.xcoor || 0}
            <br>Y: ${campus.ycoor || 0}
          </div>
          ${campus.trainingCenterCampus ? `
          <div class="mb-3">
            <strong>Centre de formation:</strong> ${(campus.trainingCenterCampus as any)?.fullName || 'Non spécifié'}
          </div>
          ` : ''}
        </div>
      `,
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3085d6'
    });
  }

  confirmDelete(campus: CampusResponse) {
    if (!campus.name) return;
    
    console.log('confirmDelete called for campus:', campus);
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer le campus "${campus.name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCampus(campus);
      }
    });
  }

  deleteCampus(campus: CampusResponse) {
    if (!campus.name) return;
    
    console.log('deleteCampus called for campus:', campus);
    this.processing = true;
    this.campusService.deleteCampus({ name: campus.name }).subscribe({
      next: () => {
    this.loadCampuses();
        this.processing = false;
        Swal.fire('Supprimé !', 'Le campus a été supprimé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Erreur lors de la suppression du campus', 'error');
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCampuses(event);
  }
}