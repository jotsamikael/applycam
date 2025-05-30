import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CampusService } from '../../../services/services/campus.service';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { 
  CampusResponse, 
  PageResponseCampusResponse,
  TrainingCenterResponse 
} from '../../../services/models';
import { 
  FindCampusByTown$Params
} from '../../../services/fn/campus/find-campus-by-town';
import { 
  CreateCampus$Params,
} from '../../../services/fn/campus/create-campus';

@Component({
  selector: 'app-campus-management',
  templateUrl: './campus-management.component.html',
  styleUrls: ['./campus-management.component.scss']
})
export class CampusManagementComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Management', active: true },
    { label: 'Campus', active: true }
  ];

  // Table data
  dataSource = new MatTableDataSource<CampusResponse>();
  displayedColumns: string[] = ['name', 'town', 'quarter', 'capacity', 'trainingCenter', 'actions'];
  
  // Pagination
  totalItems = 0;
  currentPage = 0;
  pageSize = 10;
  
  // Stats
  followUpStat = [
    { title: 'Total Campuses', value: 0, icon: 'bx bx-building' },
    { title: 'By Town', value: 0, icon: 'bx bx-map' }
  ];

  // Modals
  @ViewChild('addNew') addNewModal!: TemplateRef<any>;
  @ViewChild('editModal') editModal!: TemplateRef<any>;
  modalRef?: BsModalRef;
  
  // Forms
  createCampusForm!: FormGroup;
  editCampusForm!: FormGroup;
  
  // Loading states
  loading = true;
  processing = false;
  
  // Data for dropdowns
  towns: string[] = [];
  trainingCenters: TrainingCenterResponse[] = [];

  constructor(
    private campusService: CampusService,
    private trainingCenterService: TrainingcenterService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadTowns();
    this.loadTrainingCenters();
    this.loadCampuses();
  }

  initForms(): void {
    this.createCampusForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      town: ['', Validators.required],
      quarter: ['', [Validators.required, Validators.maxLength(100)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      xcoor: [''],
      ycoor: [''],
      trainingCenterId: [null, Validators.required]
    });

    this.editCampusForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      town: ['', Validators.required],
      quarter: ['', [Validators.required, Validators.maxLength(100)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      xcoor: [''],
      ycoor: [''],
      trainingCenterId: [null, Validators.required]
    });
  }

  loadTowns(): void {
    // Liste statique des villes - à remplacer par un appel API si disponible
    this.towns = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Maroua', 'Ngaoundéré', 'Bertoua'];
  }

 loadTrainingCenters(): void {
  this.trainingCenterService.getAllTrainingCenters().subscribe({
    next: (response) => {
      // Handle both paginated and non-paginated responses
      if (response.content) {
        this.trainingCenters = response.content; // Paginated response
      } else if (Array.isArray(response)) {
        this.trainingCenters = response; // Direct array response
      } else {
        this.trainingCenters = [];
      }
    },
    error: (err) => {
      this.toastr.error('Failed to load training centers', 'Error');
      console.error('Error loading training centers:', err);
      this.trainingCenters = []; // Fallback empty array
    }
  });
}

  loadCampuses(): void {
    this.loading = true;
    const params: FindCampusByTown$Params = {
      town: ''
    };
    
    this.campusService.findCampusByTown(params).subscribe({
      next: (response) => {
        this.dataSource.data = response.content || [];
        this.totalItems = response.totalElements || 0;
        this.updateStats(response.content || []);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load campuses', 'Error');
        this.loading = false;
      }
    });
  }

  updateStats(campuses: CampusResponse[]): void {
    this.followUpStat[0].value = campuses.length;
    const uniqueTowns = new Set(campuses.map(c => c.town));
    this.followUpStat[1].value = uniqueTowns.size;
  }

  // Modal operations
  openCreateNewModal(template: TemplateRef<any>): void {
    this.createCampusForm.reset();
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openEditModal(template: TemplateRef<any>, campus: any): void {
    this.editCampusForm.patchValue({
      id: campus.id,
      name: campus.name,
      town: campus.town,
      quarter: campus.quarter,
      capacity: campus.capacity,
      xcoor: campus.xcoor,
      ycoor: campus.ycoor,
      trainingCenterId: campus.trainingCenterCampus?.id
    });
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  // Form getters
  get cf() { return this.createCampusForm.controls; }
  get ef() { return this.editCampusForm.controls; }

  // CRUD Operations
  createCampus(): void {
    if (this.createCampusForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Validation');
      return;
    }

    this.processing = true;
    const formData = this.createCampusForm.value;
    
    const params: CreateCampus$Params = {
      request: {
        name: formData.name,
        town: formData.town,
        quarter: formData.quarter,
        capacity: formData.capacity,
        xcoor: formData.xcoor,
        ycoor: formData.ycoor,
        trainingCenter: { id: formData.trainingCenterId }
      }
    };
    
    this.campusService.createCampus(params).subscribe({
      next: () => {
        this.toastr.success('Campus created successfully', 'Success');
        this.modalRef?.hide();
        this.loadCampuses();
        this.processing = false;
      },
      error: (err) => {
        this.toastr.error('Failed to create campus', 'Error');
        this.processing = false;
      }
    });
  }

  updateCampus(): void {
    if (this.editCampusForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Validation');
      return;
    }

    this.processing = true;
    const formData = this.editCampusForm.value;
    
    // Implémentez la logique de mise à jour ici
    this.toastr.success('Campus updated successfully', 'Success');
    this.modalRef?.hide();
    this.loadCampuses();
    this.processing = false;
  }

  deleteCampus(campus: any): void {
    if (confirm(`Are you sure you want to delete ${campus.name}?`)) {
      // Implémentez la logique de suppression ici
      this.toastr.success('Campus deleted successfully', 'Success');
      this.loadCampuses();
    }
  }

  // Helper methods
  compareTown(t1: string, t2: string): boolean {
    return t1 && t2 ? t1 === t2 : t1 === t2;
  }

  compareTrainingCenter(t1: number, t2: number): boolean {
    return t1 && t2 ? t1 === t2 : t1 === t2;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCampuses();
  }
}