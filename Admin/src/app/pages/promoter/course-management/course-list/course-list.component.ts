import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../../services/services/course.service';
import { SpecialityControllerService } from '../../../../services/services/speciality-controller.service';
import { TokenService } from '../../../../services/token/token.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

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

  displayedColumns: string[] = ['code', 'name', 'description', 'specialities', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addNew') addNewTemplate: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;

  CreateCourseForm: FormGroup;
  processing = false;
  modalRef?: BsModalRef;
  courses: any[] = [];
  specialities: any[] = [];
  followUpStat = [
    { title: 'Total Courses', value: 0, icon: 'bx bx-book' },
    { title: 'Active Courses', value: 0, icon: 'bx bx-check-circle' },
    { title: 'Archived Courses', value: 0, icon: 'bx bx-archive' }
  ];
  selectedCourse: any = null;
  isEditMode = false;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private courseService: CourseService,
    private specialityService: SpecialityControllerService,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSpecialities();
    this.loadCourses();
  }

  initForm() {
    this.CreateCourseForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(64)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(500)]],
      specialityiId: ['', [Validators.required]]
    });
  }

  get f() {
    return this.CreateCourseForm.controls;
  }

  loadCourses() {
    // TODO: Implémenter la récupération des cours depuis le service CourseService
    // Pour l'instant, on utilise des données mock
    this.courses = [
      { 
        id: 1,
        code: 'CS101', 
        name: 'Introduction to Computer Science', 
        description: 'Basic concepts of computer science', 
        specialityList: [{ id: 1, name: 'Computer Science' }],
        actived: true,
        archived: false
      },
      { 
        id: 2,
        code: 'MATH201', 
        name: 'Advanced Mathematics', 
        description: 'Advanced mathematical concepts', 
        specialityList: [{ id: 2, name: 'Mathematics' }],
        actived: true,
        archived: false
      }
    ];
    
    this.dataSource = new MatTableDataSource(this.courses);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Mise à jour des statistiques
    this.followUpStat[0].value = this.courses.length;
    this.followUpStat[1].value = this.courses.filter(c => c.actived).length;
    this.followUpStat[2].value = this.courses.filter(c => c.archived).length;
  }

  loadSpecialities() {
    this.specialityService.getall().subscribe({
      next: (response) => {
        this.specialities = response.content || [];
      },
      error: (err) => {
        console.error('Error loading specialities:', err);
        this.toastr.error('Failed to load specialities');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateNewModal() {
    this.isEditMode = false;
    this.CreateCourseForm.reset();
    this.modalRef = this.modalService.show(this.addNewTemplate, {
      class: 'modal-xl',
      backdrop: 'static'
    });
  }

  createNewCourse() {
    if (this.CreateCourseForm.invalid) {
      return;
    }

    this.processing = true;
    const courseData = {
      code: this.f.code.value,
      name: this.f.name.value,
      description: this.f.description.value,
      specialityiId: this.f.specialityiId.value
    };

    this.courseService.createCourse1({ body: courseData }).subscribe({
      next: (response) => {
        this.processing = false;
        this.modalRef?.hide();
        this.loadCourses();
        this.CreateCourseForm.reset();
        this.toastr.success('Course created successfully');
      },
      error: (err) => {
        this.processing = false;
        console.error('Error creating course:', err);
        this.toastr.error('Failed to create course');
      }
    });
  }

  edit(course: any) {
    this.isEditMode = true;
    this.selectedCourse = course;
    this.CreateCourseForm.patchValue({
      code: course.code,
      name: course.name,
      description: course.description,
      specialityiId: course.specialityList?.[0]?.id || ''
    });
    this.modalRef = this.modalService.show(this.editTemplate, {
      class: 'modal-xl',
      backdrop: 'static'
    });
  }

  updateCourse() {
    if (this.CreateCourseForm.invalid || !this.selectedCourse) {
      return;
    }

    this.processing = true;
    const updatedCourse = {
      id: this.selectedCourse.id,
      code: this.f.code.value,
      name: this.f.name.value,
      description: this.f.description.value,
      specialityiId: this.f.specialityiId.value
    };

    // TODO: Implémenter la méthode update dans CourseService
    // this.courseService.update(updatedCourse).subscribe({
    //   next: (response) => {
    //     this.processing = false;
    //     this.modalRef?.hide();
    //     this.loadCourses();
    //     this.selectedCourse = null;
    //     this.toastr.success('Course updated successfully');
    //   },
    //   error: (err) => {
    //     this.processing = false;
    //     console.error('Error updating course:', err);
    //     this.toastr.error('Failed to update course');
    //   }
    // });

    // Simulation de mise à jour
    setTimeout(() => {
      this.processing = false;
      this.modalRef?.hide();
      this.loadCourses();
      this.selectedCourse = null;
      this.toastr.success('Course updated successfully');
    }, 1000);
  }

  delete(course: any) {
    if (confirm(`Are you sure you want to delete "${course.name}" course?`)) {
      this.processing = true;
      // TODO: Implémenter la méthode delete dans CourseService
      // this.courseService.delete(course.id).subscribe({
      //   next: (response) => {
      //     this.processing = false;
      //     this.loadCourses();
      //     this.toastr.success('Course deleted successfully');
      //   },
      //   error: (err) => {
      //     this.processing = false;
      //     console.error('Error deleting course:', err);
      //     this.toastr.error('Failed to delete course');
      //   }
      // });

      // Simulation de suppression
      setTimeout(() => {
        this.processing = false;
        this.loadCourses();
        this.toastr.success('Course deleted successfully');
      }, 1000);
    }
  }

  getSpecialities(course: any): string {
    return course.specialityList?.map((s: any) => s.name).join(', ') || '';
  }
}