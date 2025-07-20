import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseService } from '../../../../services/services/course.service';
import { PageResponseCourseResponse, CourseResponse, TrainingCenterResponse } from '../../../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingcenterService } from 'src/app/services/services';
import { AuthenticationService } from '../../../../services/services/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Training', active: true },
    { label: 'Courses', active: true }
  ];

  trainingCenters: TrainingCenterResponse[] = [];
  courses: CourseResponse[] = [];
  displayedColumns: string[] = ['code', 'name', 'description', 'priceForDqp', 'actions'];
  dataSource: MatTableDataSource<CourseResponse>;
  processing = false;

  // Propriétés pour les filtres avancés
  showAdvancedFilters = false;
  filterTrainingCenter = '';
  filterPrice = '';

  // Propriétés pour la pagination
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  // Propriétés pour les modals
  modalRef?: BsModalRef;
  selectedCourse: CourseResponse | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('detailsModal') detailsModal: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private trainingCenterService: TrainingcenterService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private modalService: BsModalService
  ) {
    this.dataSource = new MatTableDataSource<CourseResponse>([]);
  }

  ngOnInit(): void {
    this.loadTrainingCenters();
    this.loadCourses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTrainingCenters(): void {
    this.trainingCenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next: (centers) => {
        this.trainingCenters = centers;
        console.log('Centres de formation chargés:', centers);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des centres de formation:', error);
        this.snackBar.open('Erreur lors du chargement des centres de formation', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadCourses(): void {
    this.processing = true;
    // Charger tous les cours disponibles
    this.courseService.getCourses({ offset: this.pageIndex, pageSize: this.pageSize }).subscribe({
      next: (response) => {
        this.processing = false;
        if (response.content) {
          this.courses = response.content;
          this.totalElements = response.totalElements || 0;
          this.dataSource = new MatTableDataSource(this.courses);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.updateStats();
          console.log('Cours chargés:', this.courses);
        }
      },
      error: (error) => {
        this.processing = false;
        console.error('Erreur lors du chargement des cours:', error);
        this.snackBar.open('Erreur lors du chargement des cours', 'Fermer', { duration: 3000 });
      }
    });
  }

  updateStats(): void {
    const totalCourses = this.courses.length;
    const activeCourses = this.courses.filter(course => course.name).length;
    const archivedCourses = 0; // Pas de statut archived dans CourseResponse

    this.followUpStat = [
      { title: 'Total Courses', value: totalCourses, icon: 'book' },
      { title: 'Active Courses', value: activeCourses, icon: 'check-circle' },
      { title: 'Archived Courses', value: archivedCourses, icon: 'archive' }
    ];
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
    
    if (this.filterPrice) {
      filterValue += `priceForDqp:${this.filterPrice} `;
    }
    
    this.dataSource.filter = filterValue.trim();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.filterTrainingCenter = '';
    this.filterPrice = '';
    this.dataSource.filter = '';
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCourses();
  }

  showDetails(course: CourseResponse): void {
    this.selectedCourse = course;
    this.modalRef = this.modalService.show(this.detailsModal, {
      class: 'modal-lg',
      backdrop: 'static'
    });
  }

  openCreatePopup(): void {
    Swal.fire({
      title: 'Créer un nouveau cours',
      html: `
        <form id="createCourseForm">
          <div class="mb-3">
            <label class="form-label">Code du cours <span class="text-danger">*</span></label>
            <input id="courseCode" type="text" class="form-control" placeholder="Ex: CS101" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Nom du cours <span class="text-danger">*</span></label>
            <input id="courseName" type="text" class="form-control" placeholder="Ex: Introduction à l'informatique" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea id="courseDescription" class="form-control" rows="3" placeholder="Description du cours..."></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Prix pour CQP <span class="text-danger">*</span></label>
            <input id="coursePrice" type="number" class="form-control" placeholder="25000" required min="0">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const code = (document.getElementById('courseCode') as HTMLInputElement).value;
        const name = (document.getElementById('courseName') as HTMLInputElement).value;
        const description = (document.getElementById('courseDescription') as HTMLTextAreaElement).value;
        const priceForCqp = parseFloat((document.getElementById('coursePrice') as HTMLInputElement).value);

        if (!code || !name || isNaN(priceForCqp)) {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }

        return { code, name, description, priceForCqp };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.createCourse(result.value);
      }
    });
  }

  createCourse(courseData: any): void {
    console.log('createCourse called with:', courseData);
    
    this.courseService.createCourse({ body: courseData }).subscribe({
      next: (response) => {
        console.log('Cours créé avec succès:', response);
        Swal.fire('Succès!', 'Cours créé avec succès', 'success');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        Swal.fire('Erreur!', 'Erreur lors de la création du cours', 'error');
      }
    });
  }

  editCourse(course: CourseResponse): void {
    Swal.fire({
      title: 'Modifier le cours',
      html: `
        <form id="editCourseForm">
          <div class="mb-3">
            <label class="form-label">Code du cours <span class="text-danger">*</span></label>
            <input id="editCourseCode" type="text" class="form-control" value="${course.code || ''}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Nom du cours <span class="text-danger">*</span></label>
            <input id="editCourseName" type="text" class="form-control" value="${course.name || ''}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea id="editCourseDescription" class="form-control" rows="3">${course.description || ''}</textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Prix pour CQP <span class="text-danger">*</span></label>
            <input id="editCoursePrice" type="number" class="form-control" value="${course.priceForDqp || 0}" required min="0">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const code = (document.getElementById('editCourseCode') as HTMLInputElement).value;
        const name = (document.getElementById('editCourseName') as HTMLInputElement).value;
        const description = (document.getElementById('editCourseDescription') as HTMLTextAreaElement).value;
        const priceForCqp = parseFloat((document.getElementById('editCoursePrice') as HTMLInputElement).value);

        if (!code || !name || isNaN(priceForCqp)) {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }

        return { code, name, description, priceForCqp };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateCourse(course, result.value);
      }
    });
  }

  updateCourse(course: CourseResponse, updatedData: any): void {
    // Pour l'instant, nous allons afficher un message indiquant que la mise à jour nécessite l'ID
    // et suggérer de créer un nouveau cours à la place
    Swal.fire({
      title: 'Mise à jour non disponible',
      text: 'La mise à jour des cours nécessite l\'ID du cours. Veuillez créer un nouveau cours avec les nouvelles informations.',
      icon: 'info',
      confirmButtonText: 'Compris'
    });
    
    // TODO: Implémenter la mise à jour une fois que CourseResponse inclut l'ID
    // Ou modifier le backend pour inclure l'ID dans CourseResponse
  }

  deleteCourse(course: CourseResponse): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Voulez-vous vraiment supprimer le cours "${course.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCoursePermanently({ name: course.name || '' }).subscribe({
          next: () => {
            console.log('Cours supprimé avec succès');
            Swal.fire('Supprimé!', 'Le cours a été supprimé avec succès', 'success');
            this.loadCourses();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire('Erreur!', 'Erreur lors de la suppression du cours', 'error');
          }
        });
      }
    });
  }

  toggleCourseStatus(course: CourseResponse): void {
    const action = course.name ? 'désactiver' : 'réactiver';
    
    Swal.fire({
      title: 'Changer le statut',
      text: `Voulez-vous ${action} le cours "${course.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.toogleCourse2({ name: course.name || '' }).subscribe({
          next: () => {
            console.log('Statut du cours modifié avec succès');
            Swal.fire('Succès!', `Le cours a été ${action} avec succès`, 'success');
            this.loadCourses();
          },
          error: (error) => {
            console.error('Erreur lors du changement de statut:', error);
            Swal.fire('Erreur!', 'Erreur lors du changement de statut', 'error');
          }
        });
      }
    });
  }

  // Propriétés pour les statistiques
  followUpStat = [
    { title: 'Total Courses', value: 0, icon: 'book' },
    { title: 'Active Courses', value: 0, icon: 'check-circle' },
    { title: 'Archived Courses', value: 0, icon: 'archive' }
  ];
}