import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpecialityService } from '../../../../services/services/speciality.service';
import { PageResponseSpecialityResponse, SpecialityResponse, TrainingCenterResponse } from '../../../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingcenterService } from 'src/app/services/services';
import { CourseService } from '../../../../services/services/course.service';
import { CourseResponse } from '../../../../services/models/course-response';
import { AuthenticationService } from '../../../../services/services/authentication.service';
import Swal from 'sweetalert2';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-specialty-list',
  templateUrl: './specialty-list.component.html',
  styleUrls: ['./specialty-list.component.scss']
})
export class SpecialtyListComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Training Centers', active: true },
    { label: 'Specialties', active: true }
  ];

  followUpStat = [
    { title: 'Total Specialties', value: '0', icon: 'bx bx-book' },
    { title: 'Active Specialties', value: '0', icon: 'bx bx-check-circle' },
    { title: 'Archived Specialties', value: '0', icon: 'bx bx-archive' }
  ];

  trainingCenters: TrainingCenterResponse[] = [];
  courses: CourseResponse[] = [];
  displayedColumns: string[] = ['name', 'code', 'description', 'examType', 'trainingCenter', 'actions'];
  dataSource: MatTableDataSource<SpecialityResponse>;
  specialties: SpecialityResponse[] = [];
  processing = false;

  // Propriétés pour les filtres avancés
  showAdvancedFilters = false;
  filterTrainingCenter = '';
  filterExamType = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private specialtyService: SpecialityService,
    private fb: FormBuilder,
    private trainingCenterService: TrainingcenterService,
    private courseService: CourseService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTrainingCenters();
    this.loadCourses();
  }

  loadTrainingCenters(): void {
    this.trainingCenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next: (response) => {
        this.trainingCenters = response || [];
        // Une fois les centres chargés, charger les spécialités
        this.loadSpecialties();
      },
      error: (error) => {
        console.error('Error loading training centers:', error);
        this.showSnackBar('Error loading training centers', 'error');
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses({ offset: 0, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.courses = response.content || [];
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.showSnackBar('Error loading courses', 'error');
      }
    });
  }

  loadSpecialties(): void {
    if (this.trainingCenters.length === 0) {
      this.specialties = [];
      this.dataSource = new MatTableDataSource(this.specialties);
      this.updateStats();
      return;
    }

    // Créer un tableau d'observables pour charger les spécialités de chaque centre
    const specialtyRequests = this.trainingCenters.map(center => 
      this.specialtyService.getCoursesAndSpecialitiesForCenter({
        agreementNumber: center.agreementNumber!
      }).pipe(
        catchError(error => {
          console.error(`Error loading specialties for center ${center.fullName}:`, error);
          return of([]);
        })
      )
    );

    // Exécuter toutes les requêtes en parallèle
    forkJoin(specialtyRequests).subscribe({
      next: (responses) => {
        // Combiner toutes les spécialités de tous les centres
        this.specialties = [];
        responses.forEach((coursesWithSpecialities, index) => {
          const center = this.trainingCenters[index];
          
          // Extraire toutes les spécialités de toutes les filières de ce centre
          coursesWithSpecialities.forEach(courseWithSpecialities => {
            if (courseWithSpecialities.specialities) {
              courseWithSpecialities.specialities.forEach(specialty => {
                this.specialties.push({
                  ...specialty,
                  trainingCenterName: center.fullName // Ajouter le nom du centre
                });
              });
            }
          });
        });

        this.dataSource = new MatTableDataSource(this.specialties);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
        this.showSnackBar('Error loading specialties', 'error');
        this.specialties = [];
        this.dataSource = new MatTableDataSource(this.specialties);
        this.updateStats();
      }
    });
  }

  updateStats(): void {
    this.followUpStat[0].value = this.specialties.length.toString();
    // If there is no 'active' property, set to '0' or implement correct logic if another property should be used
    this.followUpStat[1].value = '0';
    // If 'archived' does not exist, set to '0' or implement correct logic if another property should be used
    this.followUpStat[2].value = '0';
  }

  openCreatePopup(): void {
    if (this.trainingCenters.length === 0) {
      Swal.fire('Erreur', 'Aucun centre de formation disponible. Veuillez d\'abord créer un centre de formation.', 'error');
      return;
    }

    if (this.courses.length === 0) {
      Swal.fire('Erreur', 'Aucune filière disponible. Veuillez d\'abord créer une filière.', 'error');
      return;
    }

    const trainingCenterOptions = this.trainingCenters.map(tc => 
      `<option value="${tc.agreementNumber}">${tc.fullName} (${tc.agreementNumber})</option>`
    ).join('');

    const courseOptions = this.courses.map(course => 
      `<option value="${course.name}">${course.name} - ${course.code}</option>`
    ).join('');

    Swal.fire({
      title: 'Créer une nouvelle spécialité',
      html: `
        <div class="mb-3">
          <label class="form-label">Centre de formation <span class="text-danger">*</span></label>
          <select id="swal-input-training-center" class="form-control" required>
            <option value="">Sélectionner un centre de formation</option>
            ${trainingCenterOptions}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Filière <span class="text-danger">*</span></label>
          <select id="swal-input-course" class="form-control" required>
            <option value="">Sélectionner une filière</option>
            ${courseOptions}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Nom de la spécialité <span class="text-danger">*</span></label>
          <input id="swal-input-name" class="form-control" placeholder="Nom de la spécialité" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Code <span class="text-danger">*</span></label>
          <input id="swal-input-code" class="form-control" placeholder="Code de la spécialité" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea id="swal-input-description" class="form-control" rows="3" placeholder="Description de la spécialité"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Type d'examen <span class="text-danger">*</span></label>
          <select id="swal-input-exam-type" class="form-control" required>
            <option value="">Sélectionner le type d'examen</option>
            <option value="CQP">CQP</option>
            <option value="DQP">DQP</option>
           
          </select>
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
        const courseName = (document.getElementById('swal-input-course') as HTMLSelectElement).value;
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value.trim();
        const code = (document.getElementById('swal-input-code') as HTMLInputElement).value.trim();
        const description = (document.getElementById('swal-input-description') as HTMLTextAreaElement).value.trim();
        const examType = (document.getElementById('swal-input-exam-type') as HTMLSelectElement).value;

        if (!trainingCenterAgr) {
          Swal.showValidationMessage('Le centre de formation est requis');
          return false;
        }
        if (!courseName) {
          Swal.showValidationMessage('La filière est requise');
          return false;
        }
        if (!name) {
          Swal.showValidationMessage('Le nom de la spécialité est requis');
          return false;
        }
        if (!code) {
          Swal.showValidationMessage('Le code de la spécialité est requis');
          return false;
        }
        if (!examType) {
          Swal.showValidationMessage('Le type d\'examen est requis');
          return false;
        }

        return { trainingCenterAgr, courseName, name, code, description, examType };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.createSpecialty(result.value);
      }
    });
  }

  createSpecialty(specialtyData: any): void {
    this.processing = true;
    
    const createSpecialtyRequest = {
      code: specialtyData.code,
      name: specialtyData.name,
      description: specialtyData.description || '',
      examType: specialtyData.examType
    };

    // Utiliser la méthode qui crée et lie la spécialité à la filière
    this.authService.createAndLinkSpecialityToTrainingCenter({
      courseName: specialtyData.courseName,
      agreementNumber: specialtyData.trainingCenterAgr,
      body: createSpecialtyRequest
    }).subscribe({
      next: () => {
        this.processing = false;
        Swal.fire('Succès', 'Spécialité créée avec succès', 'success');
        this.loadSpecialties();
      },
      error: (error) => {
        console.error('Error creating specialty:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Erreur lors de la création de la spécialité', 'error');
      }
    });
  }

  edit(specialty: SpecialityResponse): void {
    // Pour l'édition, on peut utiliser un popup similaire mais pré-rempli
    Swal.fire({
      title: 'Modifier la spécialité',
      html: `
        <div class="mb-3">
          <label class="form-label">Nom de la spécialité <span class="text-danger">*</span></label>
          <input id="swal-input-name" class="form-control" value="${specialty.name || ''}" placeholder="Nom de la spécialité" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Code <span class="text-danger">*</span></label>
          <input id="swal-input-code" class="form-control" value="${specialty.code || ''}" placeholder="Code de la spécialité" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea id="swal-input-description" class="form-control" rows="3" placeholder="Description de la spécialité">${specialty.description || ''}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Type d'examen <span class="text-danger">*</span></label>
          <select id="swal-input-exam-type" class="form-control" required>
            <option value="">Sélectionner le type d'examen</option>
            <option value="CQP" ${specialty.examType === 'CQP' ? 'selected' : ''}>CQP</option>
            <option value="DQP" ${specialty.examType === 'DQP' ? 'selected' : ''}>DQP</option>
            <option value="BTS" ${specialty.examType === 'BTS' ? 'selected' : ''}>BTS</option>
            <option value="HND" ${specialty.examType === 'HND' ? 'selected' : ''}>HND</option>
            <option value="Licence" ${specialty.examType === 'Licence' ? 'selected' : ''}>Licence</option>
            <option value="Master" ${specialty.examType === 'Master' ? 'selected' : ''}>Master</option>
            <option value="Doctorat" ${specialty.examType === 'Doctorat' ? 'selected' : ''}>Doctorat</option>
          </select>
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
        const code = (document.getElementById('swal-input-code') as HTMLInputElement).value.trim();
        const description = (document.getElementById('swal-input-description') as HTMLTextAreaElement).value.trim();
        const examType = (document.getElementById('swal-input-exam-type') as HTMLSelectElement).value;

        if (!name) {
          Swal.showValidationMessage('Le nom de la spécialité est requis');
          return false;
        }
        if (!code) {
          Swal.showValidationMessage('Le code de la spécialité est requis');
          return false;
        }
        if (!examType) {
          Swal.showValidationMessage('Le type d\'examen est requis');
          return false;
        }

        return { name, code, description, examType };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value && specialty.id) {
        this.updateSpecialty(specialty.id, result.value);
      }
    });
  }

  updateSpecialty(specialtyId: number, updateData: any): void {
    this.processing = true;
    
    const updateSpecialtyRequest = {
      id: specialtyId,
      name: updateData.name,
      code: updateData.code,
      description: updateData.description || '',
      examType: updateData.examType,
      amount: 25000 // Prix par défaut
    };

    this.specialtyService.updateCourse({ body: updateSpecialtyRequest }).subscribe({
      next: () => {
        this.processing = false;
        Swal.fire('Succès', 'Spécialité mise à jour avec succès', 'success');
        this.loadSpecialties();
      },
      error: (error) => {
        console.error('Error updating specialty:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Erreur lors de la mise à jour de la spécialité', 'error');
      }
    });
  }

  delete(specialty: SpecialityResponse): void {
    if (!specialty.name) return;
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer la spécialité "${specialty.name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processing = true;
        // Utiliser la méthode toggle pour désactiver la spécialité
        this.specialtyService.toogleCourse1({ name: specialty.name }).subscribe({
          next: () => {
            this.processing = false;
            Swal.fire('Supprimé !', 'La spécialité a été supprimée avec succès', 'success');
            this.loadSpecialties();
          },
          error: (error) => {
            console.error('Error deleting specialty:', error);
            this.processing = false;
            Swal.fire('Erreur', 'Erreur lors de la suppression de la spécialité', 'error');
          }
        });
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : []
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyAdvancedFilters(): void {
    let filterValue = '';
    
    if (this.filterTrainingCenter) {
      filterValue += `trainingCenter:${this.filterTrainingCenter} `;
    }
    
    if (this.filterExamType) {
      filterValue += `examType:${this.filterExamType} `;
    }
    
    this.dataSource.filter = filterValue.trim();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.filterTrainingCenter = '';
    this.filterExamType = '';
    this.dataSource.filter = '';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}