import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { 
  TrainingCenterResponse,
  CreateTainingCenterRequest,
  TrainingCenter
} from '../../../services/models';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { TokenService } from '../../../services/token/token.service';

@Component({
  selector: 'app-training-center-management',
  templateUrl: './training-center-management.component.html',
  styleUrls: ['./training-center-management.component.scss']
})
export class TrainingCenterManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('createModal') createModal!: TemplateRef<any>;
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  @ViewChild('editModal') editModal!: TemplateRef<any>;

  private destroy$ = new Subject<void>();
  
  modalRef?: BsModalRef;
  processing = false;
  errorMessages: string[] = [];

  // Table configuration
  displayedColumns: string[] = [
    'fullName', 'acronym', 'agreementNumber', 
    'centerPresentCandidateForCqp', 'centerPresentCandidateForDqp', 
    'division', 'actions'
  ];
  dataSource = new MatTableDataSource<TrainingCenterResponse>();
  
  // Form configuration
  createForm!: FormGroup;
  editForm!: FormGroup;
  selectedCenter: TrainingCenter | null = null;
  currentUser = this.tokenService.getUsername();

  // Statistics
  stats = [
    { title: 'Total Centers', value: 0, icon: 'school' },
    { title: 'CQP Centers', value: 0, icon: 'verified' },
    { title: 'DQP Centers', value: 0, icon: 'verified_user' }
  ];

  // Location data
  regions: string[] = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
  ];
  divisions: any[] = [];

  // Add breadCrumbItems property
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Training Centers', active: true }
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private trainingCenterService: TrainingcenterService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTrainingCenters();
    this.setupRegionListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

   private initForm(): void {
    this.createForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      acronym: ['', [Validators.required, Validators.maxLength(20)]],
      agreementNumber: ['', [Validators.required, Validators.maxLength(50)]],
      startDateOfAgreement: ['', Validators.required],
      endDateOfAgreement: ['', Validators.required],
      centerPresentCandidateForCqp: [false, Validators.required],
      centerPresentCandidateForDqp: [false, Validators.required],
      region: ['', Validators.required],
      division: ['', Validators.required],
      fullAddress: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.editForm = this.fb.group({
      id: [''],
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      acronym: ['', [Validators.required, Validators.maxLength(20)]],
      agreementNumber: ['', [Validators.required, Validators.maxLength(50)]],
      startDateOfAgreement: ['', Validators.required],
      endDateOfAgreement: ['', Validators.required],
      isCenterPresentCandidateForCqp: ['No', Validators.required],
      isCenterPresentCandidateForDqp: ['No', Validators.required],
      region: ['', Validators.required],
      division: ['', Validators.required],
      fullAddress: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  private setupRegionListeners(): void {
    this.createForm.get('region')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => this.updateDivisions(region));

    this.editForm.get('region')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => this.updateDivisions(region));
  }

  private updateDivisions(region: string): void {
    // In a real app, you would fetch divisions from a service
    const departmentsByRegion: Record<string, any[]> = {
      'Adamaoua': [{ department: 'Djérem' }, { department: 'Faro-et-Déo' }],
      'Centre': [{ department: 'Haute-Sanaga' }, { department: 'Lekié' }],
      // Add other regions...
    };
    
    this.divisions = departmentsByRegion[region] || [];
    this.createForm.get('division')?.reset();
    this.editForm.get('division')?.reset();
  }

  private loadTrainingCenters(): void {
    this.processing = true;
    this.trainingCenterService.getTrainingCenterOfConnectedPromoter()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (centers) => {
          this.dataSource.data = centers;
          this.updateStatistics(centers);
          this.processing = false;
        },
        error: (err) => {
          this.handleError(err, 'Failed to load training centers');
          this.processing = false;
        }
      });
  }

  private updateStatistics(centers: TrainingCenterResponse[]): void {
    const cqpCount = centers.filter(c => c.centerPresentCandidateForCqp).length;
    const dqpCount = centers.filter(c => c.centerPresentCandidateForDqp).length;
    
    this.stats = [
      { title: 'Total Centers', value: centers.length, icon: 'school' },
      { title: 'CQP Centers', value: cqpCount, icon: 'verified' },
      { title: 'DQP Centers', value: dqpCount, icon: 'verified_user' }
    ];
  }

  private handleError(error: any, defaultMessage: string): void {
    this.errorMessages = error.error?.validationErrors || 
                        [error.error?.businessErrorDescription || defaultMessage];
    console.error('Error:', error);
  }

  // UI Methods
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateModal(): void {
    this.createForm.reset({
      centerPresentCandidateForCqp: false,
      centerPresentCandidateForDqp: false
    });
    this.errorMessages = [];
    this.modalRef = this.modalService.show(this.createModal, {
      class: 'modal-dialog-centered modal-lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  createTrainingCenter(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.errorMessages = ['Please fill all required fields correctly'];
      return;
    }

    this.processing = true;
    const formValue = this.createForm.value;

    const request: CreateTainingCenterRequest = {
      fullName: formValue.fullName,
      acronym: formValue.acronym,
      agreementNumber: formValue.agreementNumber,
      startDateOfAgreement: formValue.startDateOfAgreement,
      endDateOfAgreement: formValue.endDateOfAgreement,
      centerPresentCandidateForCqp: formValue.centerPresentCandidateForCqp,
      centerPresentCandidateForDqp: formValue.centerPresentCandidateForDqp,
      division: formValue.division,
      fullAddress: formValue.fullAddress
    };

    this.trainingCenterService.createTrainingCenter({ body: request })
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Success!',
            text: 'Training center created successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.modalRef?.hide();
          this.processing = false;
        },
        error: (err) => {
          this.errorMessages = err.error?.validationErrors || 
                             [err.error?.businessErrorDescription || 'Failed to create training center'];
          this.processing = false;
        }
      });
  }

  viewCenterDetails(center: TrainingCenterResponse): void {
    // Convert to TrainingCenter type if needed
    this.selectedCenter = center as TrainingCenter;
    this.modalRef = this.modalService.show(this.detailsModal, { class: 'modal-lg' });
  }

  openEditModal(center: TrainingCenterResponse): void {
    // Convert to TrainingCenter type if needed
    this.selectedCenter = center as TrainingCenter;
    this.editForm.patchValue({
      id: this.selectedCenter.id,
      fullName: this.selectedCenter.fullName,
      acronym: this.selectedCenter.acronym,
      agreementNumber: this.selectedCenter.agreementNumber,
      startDateOfAgreement: this.selectedCenter.startDateOfAgreement,
      endDateOfAgreement: this.selectedCenter.endDateOfAgreement,
      isCenterPresentCandidateForCqp: this.selectedCenter.centerPresentCandidateForCqp ? 'Yes' : 'No',
      isCenterPresentCandidateForDqp: this.selectedCenter.centerPresentCandidateForDqp ? 'Yes' : 'No',
      region: this.selectedCenter.region,
      division: this.selectedCenter.division,
      fullAddress: this.selectedCenter.fullAddress
    });

    this.errorMessages = [];
    this.modalRef = this.modalService.show(this.editModal, { 
      class: 'modal-lg',
      ignoreBackdropClick: true
    });
  }

  updateTrainingCenter(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.errorMessages = ['Please fill all required fields correctly'];
      return;
    }

    this.processing = true;
    const formValue = this.editForm.value;

    // Create a proper request object based on your API requirements
    const request = {
      id: formValue.id,
      fullName: formValue.fullName,
      acronym: formValue.acronym,
      agreementNumber: formValue.agreementNumber,
      startDateOfAgreement: formValue.startDateOfAgreement,
      endDateOfAgreement: formValue.endDateOfAgreement,
      centerPresentCandidateForCqp: formValue.isCenterPresentCandidateForCqp === 'Yes',
      centerPresentCandidateForDqp: formValue.isCenterPresentCandidateForDqp === 'Yes',
      division: formValue.division,
      fullAddress: formValue.fullAddress
    };

    // Note: You'll need to implement updateTrainingCenter in your service
    // This is just a placeholder - adjust according to your API
    this.trainingCenterService.updateTrainingCenter(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Training center updated successfully', 'success');
          this.modalRef?.hide();
          this.loadTrainingCenters();
        },
        error: (err) => {
          this.handleError(err, 'Failed to update training center');
          this.processing = false;
        }
      });
  }

  confirmDelete(center: TrainingCenterResponse): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${center.fullName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed && this.selectedCenter?.id) {
        this.deleteTrainingCenter(this.selectedCenter.id);
      }
    });
  }

  private deleteTrainingCenter(id: number): void {
    this.processing = true;
    // Note: You'll need to implement deleteTrainingCenter in your service
    // This is just a placeholder - adjust according to your API
    this.trainingCenterService.deleteTrainingCenter(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.fire('Deleted!', 'The training center has been deleted.', 'success');
          this.loadTrainingCenters();
        },
        error: (err) => {
          this.handleError(err, 'Failed to delete training center');
          this.processing = false;
        }
      });
  }

  // Form control getters
  get createFormControls() {
    return this.createForm.controls;
  }

  get editFormControls() {
    return this.editForm.controls;
  }
}