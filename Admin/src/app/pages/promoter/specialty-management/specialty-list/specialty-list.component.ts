import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpecialityControllerService } from '../../../../services/services/speciality-controller.service';
import { PageResponseSpecialityResponse, SpecialityRequest, SpecialityResponse, TrainingCenterResponse } from '../../../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingcenterService } from 'src/app/services/services';

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
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<SpecialityResponse>;
  specialties: SpecialityResponse[] = [];
  specialtyForm: FormGroup;
  processing = false;
  showModal = false;
  currentSpecialtyId: number | null = null;
  isEditMode = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private specialtyService: SpecialityControllerService,
    private fb: FormBuilder,
   private trainingCenterService: TrainingcenterService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSpecialties();
    this.loadTrainingCenters();
  }

   loadTrainingCenters(): void {
    this.trainingCenterService.getAllTrainingCenters().subscribe({
      next: (response) => {
        this.trainingCenters = response.content || [];
      },
      error: (error) => {
        console.error('Error loading training centers:', error);
        this.showSnackBar('Error loading training centers', 'error');
      }
    });
  }
  initForm(): void {
    this.specialtyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      trainingCenterId: ['', [Validators.required]]
    });
  }

  loadSpecialties(): void {
    this.specialtyService.getall().subscribe({
      next: (response: PageResponseSpecialityResponse) => {
        this.specialties = response.content || [];
        this.dataSource = new MatTableDataSource(this.specialties);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
        this.showSnackBar('Error loading specialties', 'error');
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

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentSpecialtyId = null;
    this.specialtyForm.reset();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  edit(specialty: SpecialityResponse): void {
    this.isEditMode = true;
    this.currentSpecialtyId = specialty.id || null;
    this.specialtyForm.patchValue({
      name: specialty.name,
      description: specialty.description,
      code: '', // 'code' property does not exist on SpecialityResponse, set to empty or handle accordingly
      trainingCenterId: '' // Set to empty string or replace with the correct property if available
    });
    this.showModal = true;
  }

  delete(specialty: SpecialityResponse): void {
    if (!specialty.id) return;
    
    this.processing = true;
    // TODO: Implement deleteSpeciality in SpecialityControllerService
    // this.specialtyService.deleteSpeciality(specialty.id).subscribe({
    //   next: () => {
    //     this.showSnackBar('Specialty deleted successfully');
    //     this.loadSpecialties();
    //   },
    //   error: (error) => {
    //     console.error('Error deleting specialty:', error);
    //     this.showSnackBar('Error deleting specialty', 'error');
    //   },
    //   complete: () => {
    //     this.processing = false;
    //   }
    // });
    console.log('Delete functionality is not implemented yet. This is a placeholder.');
    this.processing = false;
  }

  onSubmit(): void {
    if (this.specialtyForm.invalid) {
      return;
    }

    this.processing = true;
    const specialtyRequest: SpecialityRequest = this.specialtyForm.value;

    // Ensure description is always present for CreateSpecialityRequest
    const createSpecialtyRequest = {
      ...specialtyRequest,
      description: (specialtyRequest as any).description ?? ''
    };

    if (this.isEditMode && this.currentSpecialtyId) {
      // Update existing
      // this.specialtyService.updateSpeciality({
      //   id: this.currentSpecialtyId,
      //   body: createSpecialtyRequest
      // }).subscribe({
      //   next: () => {
      //     this.handleSuccess('Specialty updated successfully');
      //   },
      //   error: (error) => {
      //     this.handleError('Error updating specialty', error);
      //   }
      // });
      console.warn('Update functionality is not implemented yet. This is a placeholder.');
      this.handleSuccess('Specialty updated successfully (placeholder)');
    } else {
      // Create new
      this.specialtyService.createSpeciality({ 
        body: createSpecialtyRequest
      }).subscribe({
        next: () => {
          this.handleSuccess('Specialty created successfully');
        },
        error: (error) => {
          this.handleError('Error creating specialty', error);
        }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.showSnackBar(message);
    this.closeModal();
    this.loadSpecialties();
    this.processing = false;
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.showSnackBar(message, 'error');
    this.processing = false;
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

  get f() {
    return this.specialtyForm.controls;
  }
}