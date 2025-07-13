import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpecialityService } from 'src/app/services/services/speciality.service';
import { CourseService } from 'src/app/services/services/course.service';
import { PageResponseSpecialityResponse } from 'src/app/services/models/page-response-speciality-response';
import { PageResponseCourseResponse } from 'src/app/services/models/page-response-course-response';
import { SpecialityResponse } from 'src/app/services/models/speciality-response';
import { CourseResponse } from 'src/app/services/models/course-response';
import { TrainingCenterResponse } from 'src/app/services/models/training-center-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingcenterService } from 'src/app/services/services/trainingcenter.service';
import Swal from 'sweetalert2';
import { ActivateSpecialityRequest } from 'src/app/services/models/activate-speciality-request';
import { SessionService } from 'src/app/services/services/session.service';
import { SessionResponse } from 'src/app/services/models/session-response';

@Component({
  selector: 'app-specialities-management',
  templateUrl: './specialities-management.component.html',
  styleUrls: ['./specialities-management.component.scss']
})
export class SpecialitiesManagementComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Minister', active: true },
    { label: 'Specialites & Filieres', active: true }
  ];

  // Onglets
  selectedTabIndex = 0;

  // Statistiques pour les spécialités
  specialityStats = [
    { title: 'Total Specialities', value: '0', icon: 'bx bx-book' },
    { title: 'Active Specialities', value: '0', icon: 'bx bx-check-circle' },
    { title: 'Archived Specialities', value: '0', icon: 'bx bx-archive' }
  ];

  // Statistiques pour les filières
  courseStats = [
    { title: 'Total Courses', value: '0', icon: 'bx bx-graduation' },
    { title: 'Active Courses', value: '0', icon: 'bx bx-check-circle' },
    { title: 'Archived Courses', value: '0', icon: 'bx bx-archive' }
  ];

  // Données pour les spécialités
  trainingCenters: TrainingCenterResponse[] = [];
  displayedColumnsSpecialities: string[] = ['name', 'code', 'description', 'examType', 'isActived', 'actions'];
  dataSourceSpecialities: MatTableDataSource<SpecialityResponse>;
  specialities: SpecialityResponse[] = [];
  specialityForm: FormGroup;
  processingSpecialities = false;
  showSpecialityModal = false;
  currentSpecialityId: number | null = null;
  isEditModeSpeciality = false;
  selectedSpecialities: number[] = [];
  selectedTrainingCenterId: string = '';
  detailSpeciality: SpecialityResponse | null = null;
  sessions: SessionResponse[] = [];

  // Filtres avancés pour les spécialités
  showAdvancedFiltersSpecialities = false;
  filterFormSpecialities: FormGroup;
  refreshingSpecialities = false;

  // Données pour les filières
  displayedColumnsCourses: string[] = ['name', 'code', 'description', 'priceForCqp', 'isActived', 'actions'];
  dataSourceCourses: MatTableDataSource<CourseResponse>;
  courses: CourseResponse[] = [];
  courseForm: FormGroup;
  processingCourses = false;
  showCourseModal = false;
  currentCourseId: number | null = null;
  isEditModeCourse = false;
  detailCourse: CourseResponse | null = null;

  // Filtres avancés pour les cours
  showAdvancedFiltersCourses = false;
  filterFormCourses: FormGroup;
  refreshingCourses = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private specialityService: SpecialityService,
    private courseService: CourseService,
    private fb: FormBuilder,
    private trainingCenterService: TrainingcenterService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadSpecialities();
    this.loadCourses();
    this.loadTrainingCenters();
    this.loadSessions();
  }

  // ==================== GESTION DES SPÉCIALITÉS ====================

  loadTrainingCenters(): void {
    this.trainingCenterService.getAllTrainingCenters({
      offset: 0,
      pageSize: 1000,
      field: 'fullName',
      order: true
    }).subscribe({
      next: (response) => {
        this.trainingCenters = response.content || [];
      },
      error: (error) => {
        console.error('Error loading training centers:', error);
        this.showSnackBar('Error loading training centers', 'error');
      }
    });
  }

  loadSessions(): void {
    this.sessionService.getall({ offset: 0, pageSize: 1000, field: 'examDate', order: true }).subscribe({
      next: (response) => {
        this.sessions = response.content || [];
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.showSnackBar('Error loading sessions', 'error');
      }
    });
  }

  initForms(): void {
    // Formulaire pour les spécialités
    this.specialityForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]], // REQUIS selon le backend
      code: ['', [Validators.required, Validators.maxLength(20)]],
      examTypeCQP: [false],
      examTypeDQP: [false],
      trainingCenterId: [''] // Optionnel pour la création simple
    }, { validators: this.examTypeValidator });

    // Formulaire pour les filières
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(500)]],
      priceForCqp: ['', [Validators.required, Validators.min(0)]]
    });

    // Formulaires de filtres avancés
    this.filterFormSpecialities = this.fb.group({
      examType: [''],
      trainingCenterId: [''],
      status: [''],
      code: ['']
    });

    this.filterFormCourses = this.fb.group({
      minPrice: [''],
      maxPrice: [''],
      code: [''],
      status: ['']
    });
  }

  // Validateur personnalisé pour s'assurer qu'au moins un type d'examen est sélectionné
  examTypeValidator(group: FormGroup): {[key: string]: any} | null {
    const cqp = group.get('examTypeCQP')?.value;
    const dqp = group.get('examTypeDQP')?.value;
    
    if (!cqp && !dqp) {
      return { 'examTypeRequired': true };
    }
    
    return null;
  }

  loadSpecialities(): void {
    this.specialityService.getallSpeciality({ offset: 0, pageSize: 1000 }).subscribe({
      next: (response: PageResponseSpecialityResponse) => {
        this.specialities = response.content || [];
        this.dataSourceSpecialities = new MatTableDataSource(this.specialities);
        this.dataSourceSpecialities.paginator = this.paginator;
        this.dataSourceSpecialities.sort = this.sort;
        this.updateSpecialityStats();
      },
      error: (error) => {
        console.error('Error loading specialities:', error);
        this.showSnackBar('Error loading specialities', 'error');
      }
    });
  }

  updateSpecialityStats(): void {
    this.specialityStats[0].value = this.specialities.length.toString();
    this.specialityStats[1].value = this.specialities.length.toString(); // Toutes actives par défaut
    this.specialityStats[2].value = '0'; // Aucune archivée par défaut
  }

  openCreateSpecialityModal(): void {
    this.isEditModeSpeciality = false;
    this.currentSpecialityId = null;
    this.specialityForm.reset();
    this.showSpecialityModal = true;
  }

  closeSpecialityModal(): void {
    this.showSpecialityModal = false;
  }

  // Synchronisation des checkbox CQP/DQP
  setExamTypeCheckboxes(examType: string) {
    this.specialityForm.patchValue({
      examTypeCQP: examType?.includes('CQP'),
      examTypeDQP: examType?.includes('DQP')
    });
  }

  getExamTypeFromForm(): string {
    const cqp = this.specialityForm.get('examTypeCQP')?.value;
    const dqp = this.specialityForm.get('examTypeDQP')?.value;
    if (cqp && dqp) return 'CQP,DQP';
    if (cqp) return 'CQP';
    if (dqp) return 'DQP';
    return '';
  }

  editSpeciality(speciality: SpecialityResponse): void {
    this.isEditModeSpeciality = true;
    this.currentSpecialityId = speciality.id || null;
    this.specialityForm.patchValue({
      name: speciality.name,
      description: speciality.description,
      code: speciality.code || '',
      trainingCenterId: ''
    });
    this.setExamTypeCheckboxes(speciality.examType || '');
    this.showSpecialityModal = true;
  }

  // Popup détail avec state
  openDetailSpecialityPopup(speciality: SpecialityResponse): void {
    Swal.fire({
      title: 'Speciality Details',
      html: `
        <p><strong>Name:</strong> ${speciality.name}</p>
        <p><strong>Code:</strong> ${speciality.code}</p>
        <p><strong>Description:</strong> ${speciality.description}</p>
        <p><strong>Exam Type:</strong> ${speciality.examType}</p>
        <p><strong>State:</strong> ${speciality['isActived'] !== undefined ? (speciality['isActived'] ? 'Active' : (speciality['isArchived'] ? 'Archived' : 'Inactive')) : 'N/A'}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  // Popup de confirmation pour l'association
  addSpecialitiesToCenter(): void {
    if (!this.selectedTrainingCenterId || this.selectedSpecialities.length === 0) {
      Swal.fire('Error', 'Select at least one speciality and a training center', 'error');
      return;
    }
    Swal.fire({
      title: 'Confirmer',
      text: 'Associer les spécialités sélectionnées à ce centre ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.processingSpecialities = true;
        this.specialityService.addSpecialitiesToTrainingCenter({
          agreementNumber: this.selectedTrainingCenterId,
          body: this.selectedSpecialities
        }).subscribe({
          next: (msg) => {
            Swal.fire('Succès', 'Spécialités associées', 'success');
            this.loadSpecialities();
            this.processingSpecialities = false;
          },
          error: (err) => {
            Swal.fire('Erreur', 'Erreur lors de l\'association', 'error');
            this.processingSpecialities = false;
          }
        });
      }
    });
  }

  // Popup de confirmation pour la suppression
  deleteSpeciality(speciality: SpecialityResponse): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Supprimer la spécialité ${speciality.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.processingSpecialities = true;
        // TODO: Appeler le backend pour supprimer
        setTimeout(() => {
          Swal.fire('Suppression', 'Suppression fictive (à implémenter)', 'info');
          this.processingSpecialities = false;
        }, 1000);
      }
    });
  }

  // Popup de confirmation pour l'activation avec dropdown session
  async activateSpeciality(speciality: SpecialityResponse) {
    const sessionOptions = this.sessions.map(s =>
      `<option value="${s.id}">${s.examDate || ''} - ${s.examType || ''}</option>`
    ).join('');
    const { value: formValues } = await Swal.fire({
      title: `Activer la spécialité : ${speciality.name}`,
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Prix DQP" type="number">' +
        `<select id="swal-session-select" class="swal2-input">${sessionOptions}</select>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-session-select') as HTMLSelectElement).value
        ];
      }
    });
    if (formValues) {
      Swal.fire({
        title: 'Confirmer',
        text: 'Activer cette spécialité ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
      }).then(confirmRes => {
        if (confirmRes.isConfirmed) {
          const [dqpPrice, sessionId] = formValues;
          const session = this.sessions.find(s => String(s.id) === sessionId);
          const req: ActivateSpecialityRequest = {
            dqpPrice: Number(dqpPrice),
            examDate: session?.examDate,
            examType: session?.examType,
            specialityName: speciality.name
          };
          this.specialityService.activateSpeciality({ body: req }).subscribe({
            next: () => {
              Swal.fire('Succès', 'Spécialité activée avec succès', 'success');
              this.loadSpecialities();
            },
            error: () => {
              Swal.fire('Erreur', 'Erreur lors de l\'activation', 'error');
            }
          });
        }
      });
    }
  }

  onSubmitSpeciality(): void {
    if (this.specialityForm.invalid) {
      console.log('Form is invalid:', this.specialityForm.errors);
      return;
    }
    this.processingSpecialities = true;
    const formValue = this.specialityForm.value;
    const examType = this.getExamTypeFromForm();
    
    console.log('Form values:', formValue);
    console.log('Exam type from checkboxes:', examType);
    
    if (!examType) {
      this.showSnackBar('Please select at least one exam type (CQP or DQP)', 'error');
      this.processingSpecialities = false;
      return;
    }
    
    const createSpecialityRequest = {
      code: formValue.code,
      name: formValue.name,
      description: formValue.description || '',
      examType: examType
    };
    
    console.log('Creating speciality with request:', createSpecialityRequest);
    
    if (this.isEditModeSpeciality && this.currentSpecialityId) {
      // Update existing
      console.warn('Update functionality is not implemented yet. This is a placeholder.');
      this.handleSpecialitySuccess('Speciality updated successfully (placeholder)');
    } else {
      this.specialityService.createSpeciality({ 
        body: createSpecialityRequest
      }).subscribe({
        next: (response) => {
          console.log('Speciality created successfully:', response);
          this.handleSpecialitySuccess('Speciality created successfully');
        },
        error: (error) => {
          console.error('Error creating speciality:', error);
          this.handleSpecialityError('Error creating speciality', error);
        }
      });
    }
  }

  private handleSpecialitySuccess(message: string): void {
    this.showSnackBar(message);
    this.closeSpecialityModal();
    this.loadSpecialities();
    this.processingSpecialities = false;
  }

  private handleSpecialityError(message: string, error: any): void {
    console.error(message, error);
    this.showSnackBar(message, 'error');
    this.processingSpecialities = false;
  }

  applyFilterSpecialities(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSpecialities.filter = filterValue.trim().toLowerCase();
  }

  // ==================== GESTION DES FILIÈRES ====================

  loadCourses(): void {
    this.courseService.getCourses({ offset: 0, pageSize: 1000 }).subscribe({
      next: (response: PageResponseCourseResponse) => {
        this.courses = response.content || [];
        this.dataSourceCourses = new MatTableDataSource(this.courses);
        this.dataSourceCourses.paginator = this.paginator;
        this.dataSourceCourses.sort = this.sort;
        this.updateCourseStats();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.showSnackBar('Error loading courses', 'error');
      }
    });
  }

  updateCourseStats(): void {
    this.courseStats[0].value = this.courses.length.toString();
    this.courseStats[1].value = this.courses.length.toString(); // Toutes actives par défaut
    this.courseStats[2].value = '0'; // Aucune archivée par défaut
  }

  openCreateCourseModal(): void {
    this.isEditModeCourse = false;
    this.currentCourseId = null;
    this.courseForm.reset();
    this.showCourseModal = true;
  }

  closeCourseModal(): void {
    this.showCourseModal = false;
  }

  editCourse(course: CourseResponse): void {
    this.isEditModeCourse = true;
    this.currentCourseId = null; // Pas d'ID dans le modèle
    this.courseForm.patchValue({
      name: course.name,
      code: course.code,
      description: course.description,
      priceForCqp: course.priceForDqp
    });
    this.showCourseModal = true;
  }

  openDetailCoursePopup(course: CourseResponse): void {
    Swal.fire({
      title: 'Course Details',
      html: `
        <p><strong>Name:</strong> ${course.name}</p>
        <p><strong>Code:</strong> ${course.code}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <p><strong>Price for CQP:</strong> ${course.priceForDqp}</p>
        <p><strong>State:</strong> Active</p>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  deleteCourse(course: CourseResponse): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Supprimer la filière ${course.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.processingCourses = true;
        // TODO: Appeler le backend pour supprimer
        setTimeout(() => {
          Swal.fire('Suppression', 'Suppression fictive (à implémenter)', 'info');
          this.processingCourses = false;
        }, 1000);
      }
    });
  }

  toggleCourse(course: CourseResponse): void {
    Swal.fire({
      title: 'Confirmer',
      text: `Désactiver la filière ${course.name} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.processingCourses = true;
        // TODO: Appeler le backend pour toggle
        setTimeout(() => {
          Swal.fire('Succès', `Filière désactivée`, 'success');
          this.loadCourses();
          this.processingCourses = false;
        }, 1000);
      }
    });
  }

  onSubmitCourse(): void {
    if (this.courseForm.invalid) {
      return;
    }
    this.processingCourses = true;
    const formValue = this.courseForm.value;
    const createCourseRequest = {
      name: formValue.name,
      code: formValue.code,
      description: formValue.description || '',
      priceForCqp: formValue.priceForCqp
    };
    if (this.isEditModeCourse && this.currentCourseId) {
      // Update existing
      console.warn('Update functionality is not implemented yet. This is a placeholder.');
      this.handleCourseSuccess('Course updated successfully (placeholder)');
    } else {
      this.courseService.createCourse({ 
        body: createCourseRequest
      }).subscribe({
        next: () => {
          this.handleCourseSuccess('Course created successfully');
        },
        error: (error) => {
          this.handleCourseError('Error creating course', error);
        }
      });
    }
  }

  private handleCourseSuccess(message: string): void {
    this.showSnackBar(message);
    this.closeCourseModal();
    this.loadCourses();
    this.processingCourses = false;
  }

  private handleCourseError(message: string, error: any): void {
    console.error(message, error);
    this.showSnackBar(message, 'error');
    this.processingCourses = false;
  }

  applyFilterCourses(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCourses.filter = filterValue.trim().toLowerCase();
  }

  // ==================== UTILITAIRES ====================

  private showSnackBar(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : type === 'error' ? 'snackbar-error' : 'snackbar-info'
    });
  }

  get fSpeciality() {
    return this.specialityForm.controls as any;
  }

  get fCourse() {
    return this.courseForm.controls as any;
  }

  // ==================== MÉTHODES DE FILTRAGE ET EXPORTATION ====================

  // Méthodes pour les spécialités
  refreshSpecialities(): void {
    this.refreshingSpecialities = true;
    this.loadSpecialities();
    setTimeout(() => {
      this.refreshingSpecialities = false;
    }, 1000);
  }

  toggleAdvancedFiltersSpecialities(): void {
    this.showAdvancedFiltersSpecialities = !this.showAdvancedFiltersSpecialities;
  }

  applyAdvancedFiltersSpecialities(): void {
    const filterValue = this.filterFormSpecialities.value;
    let filterString = '';
    
    Object.keys(filterValue).forEach(key => {
      if (filterValue[key]) {
        filterString += `${key}:${filterValue[key]} `;
      }
    });
    
    this.dataSourceSpecialities.filter = filterString.trim();
    this.showSnackBar('Filtres appliqués pour les spécialités', 'success');
  }

  clearFiltersSpecialities(): void {
    this.filterFormSpecialities.reset();
    this.dataSourceSpecialities.filter = '';
    this.showSnackBar('Filtres effacés pour les spécialités', 'info');
  }

  exportSpecialitiesToExcel(): void {
    // TODO: Implémenter l'export Excel pour les spécialités
    this.showSnackBar('Fonctionnalité d\'export Excel pour les spécialités en cours de développement', 'info');
  }

  // Méthodes pour les cours
  refreshCourses(): void {
    this.refreshingCourses = true;
    this.loadCourses();
    setTimeout(() => {
      this.refreshingCourses = false;
    }, 1000);
  }

  toggleAdvancedFiltersCourses(): void {
    this.showAdvancedFiltersCourses = !this.showAdvancedFiltersCourses;
  }

  applyAdvancedFiltersCourses(): void {
    const filterValue = this.filterFormCourses.value;
    let filterString = '';
    
    Object.keys(filterValue).forEach(key => {
      if (filterValue[key]) {
        filterString += `${key}:${filterValue[key]} `;
      }
    });
    
    this.dataSourceCourses.filter = filterString.trim();
    this.showSnackBar('Filtres appliqués pour les cours', 'success');
  }

  clearFiltersCourses(): void {
    this.filterFormCourses.reset();
    this.dataSourceCourses.filter = '';
    this.showSnackBar('Filtres effacés pour les cours', 'info');
  }

  exportCoursesToExcel(): void {
    // TODO: Implémenter l'export Excel pour les cours
    this.showSnackBar('Fonctionnalité d\'export Excel pour les cours en cours de développement', 'info');
  }
}
