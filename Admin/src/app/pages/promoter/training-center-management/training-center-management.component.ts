import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
  UpdateTrainingCenterRequest
} from '../../../services/models';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { TokenService } from '../../../services/token/token.service';

@Component({
  selector: 'app-training-center-management',
  templateUrl: './training-center-management.component.html',
  styleUrls: ['./training-center-management.component.scss']
})
export class TrainingCenterManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('createModal') createModal!: TemplateRef<any>;
  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;
  @ViewChild('editModal') editModal!: TemplateRef<any>;

  private destroy$ = new Subject<void>();
  
  modalRef?: BsModalRef;
  processing = false;
  errorMessages: string[] = [];

  displayedColumns: string[] = [
    'fullName', 'acronym', 'agreementNumber', 
    'centerPresentCandidateForCqp', 'centerPresentCandidateForDqp', 
    'division', 'actions'
  ];
  dataSource = new MatTableDataSource<TrainingCenterResponse>();
  
  createForm!: FormGroup;
  editForm!: FormGroup;
  selectedCenter: TrainingCenterResponse | null = null;
  currentUser = this.tokenService.getUsername();

  stats = [
    { title: 'Total Centers', value: 0, icon: 'school' },
    { title: 'CQP Centers', value: 0, icon: 'verified' },
    { title: 'DQP Centers', value: 0, icon: 'verified_user' }
  ];

  regions: string[] = [
    'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 
    'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
  ];
  divisions: any[] = [];

  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'My Training Centers', active: true }
  ];

  agreementFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private trainingCenterService: TrainingcenterService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.initForms();
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

  private initForms(): void {
    this.createForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      acronym: ['', [Validators.required, Validators.maxLength(20)]],
      agreementNumber: ['', [Validators.required, Validators.maxLength(50)]],
      startDateOfAgreement: ['', Validators.required],
      endDateOfAgreement: ['', Validators.required],
      isCenterPresentCandidateForCqp: [false],
      isCenterPresentCandidateForDqp: [false],
      region: ['', Validators.required],
      division: ['', Validators.required],
      fullAddress: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.editForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      acronym: ['', [Validators.required, Validators.maxLength(20)]],
      agreementNumber: ['', [Validators.required, Validators.maxLength(50)]],
      startDateOfAgreement: ['', Validators.required],
      endDateOfAgreement: ['', Validators.required],
      centerPresentCandidateForCqp: [false],
      centerPresentCandidateForDqp: [false],
      division: ['', Validators.required],
      fullAddress: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  private setupRegionListeners(): void {
    this.createForm.get('region')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => this.updateDivisions(region));
  }

  private updateDivisions(region: string): void {
    const departmentsByRegion: Record<string, any[]> = {
      'Adamaoua': [{ department: 'Djérem' }, { department: 'Faro-et-Déo' }],
      'Centre': [{ department: 'Haute-Sanaga' }, { department: 'Lekié' }],
      'Est': [{ department: 'Boumba-et-Ngoko' }, { department: 'Haut-Nyong' }],
      'Extrême-Nord': [{ department: 'Diamaré' }, { department: 'Mayo-Danay' }],
      'Littoral': [{ department: 'Moungo' }, { department: 'Nkam' }],
      'Nord': [{ department: 'Bénoué' }, { department: 'Mayo-Louti' }],
      'Nord-Ouest': [{ department: 'Boyo' }, { department: 'Menchum' }],
      'Ouest': [{ department: 'Bamboutos' }, { department: 'Hauts-Plateaux' }],
      'Sud': [{ department: 'Mvila' }, { department: 'Océan' }],
      'Sud-Ouest': [{ department: 'Fako' }, { department: 'Meme' }]
    };
    
    this.divisions = departmentsByRegion[region] || [];
    this.createForm.get('division')?.reset();
  }

 private loadTrainingCenters(): void {
  this.processing = true;
  console.log('Début du chargement des centres...'); // Debug
  
  this.trainingCenterService.getTrainingCenterOfConnectedPromoter()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (centers) => {
        console.log('Centres reçus:', centers); // Debug
        this.dataSource.data = centers;
        this.updateStatistics(centers);
        this.processing = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err); // Debug
        this.handleError(err, 'Failed to load training centers');
        this.processing = false;
      },
      complete: () => console.log('Chargement terminé') // Debug
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateModal(): void {
    this.createForm.reset({
      fullName: 'Centre Test',
      acronym: 'CTEST',
      agreementNumber: 'AGR-12345',
      startDateOfAgreement: '2024-01-01',
      endDateOfAgreement: '2025-01-01',
      isCenterPresentCandidateForCqp: true,
      isCenterPresentCandidateForDqp: false,
      region: 'Centre',
      division: 'Mfoundi',
      fullAddress: 'Yaoundé, Quartier Test'
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
      isCenterPresentCandidateForCqp: formValue.isCenterPresentCandidateForCqp,
      isCenterPresentCandidateForDqp: formValue.isCenterPresentCandidateForDqp,
      division: formValue.division,
      fullAddress: formValue.fullAddress
    };

    this.trainingCenterService.createTrainingCenter({ body: request })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Upload du fichier d’agrément si présent
          if (this.agreementFile) {
            this.uploadAgreementFile(formValue.agreementNumber);
          }
          Swal.fire({
            title: 'Success!',
            text: 'Training center created successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.modalRef?.hide();
          this.loadTrainingCenters();
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
    this.selectedCenter = center;
    this.modalRef = this.modalService.show(this.detailsModal, { class: 'modal-lg' });
  }

  openEditModal(center: TrainingCenterResponse): void {
    this.selectedCenter = center;
    this.editForm.patchValue({
      fullName: center.fullName,
      acronym: center.acronym,
      agreementNumber: center.agreementNumber,
      startDateOfAgreement: center.startDateOfAgreement,
      endDateOfAgreement: center.endDateOfAgreement,
      centerPresentCandidateForCqp: center.centerPresentCandidateForCqp,
      centerPresentCandidateForDqp: center.centerPresentCandidateForDqp,
      division: center.division || '',
      
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

    const request: UpdateTrainingCenterRequest = {
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

    this.trainingCenterService.updatePromoter({
      fullname: this.selectedCenter?.fullName || '',
      body: request
    })
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
      if (result.isConfirmed) {
        Swal.fire('Info', 'Delete functionality not implemented in API', 'info');
      }
    });
  }

  onAgreementFileChange(event: any) {
    const file = event.target.files[0];
    this.agreementFile = file ? file : null;
  }

 uploadAgreementFile(agreementNumber: string) {
  if (!this.agreementFile) return;

  // Déduire le type de fichier ou le fixer à 'pdf'
  const fileType = this.agreementFile.type || 'pdf';

  this.trainingCenterService.uploadAgreementFile({
    'agreement-number': agreementNumber,
    fileType: fileType,
    body: {
      file: this.agreementFile
    }
  }).subscribe({
    next: () => {
      Swal.fire('Succès', 'Fichier d’agrément uploadé avec succès', 'success');
      this.agreementFile = null;
    },
    error: (err) => {
      Swal.fire('Erreur', 'Erreur lors de l’upload du fichier d’agrément', 'error');
      this.agreementFile = null;
    }
  });
}

  get createFormControls() {
    return this.createForm.controls;
  }

  get editFormControls() {
    return this.editForm.controls;
  }
}