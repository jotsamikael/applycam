import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpecialityService } from 'src/app/services/services/speciality.service';
import { PageResponseSpecialityResponse } from 'src/app/services/models/page-response-speciality-response';
import { SpecialityResponse } from 'src/app/services/models/speciality-response';
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
    { label: 'Staff', active: true },
    { label: 'Specialities', active: true }
  ];

  followUpStat = [
    { title: 'Total Specialities', value: '0', icon: 'bx bx-book' },
    { title: 'Active Specialities', value: '0', icon: 'bx bx-check-circle' },
    { title: 'Archived Specialities', value: '0', icon: 'bx bx-archive' }
  ];

  trainingCenters: TrainingCenterResponse[] = [];
  displayedColumns: string[] = ['name', 'code', 'description', 'examType', 'isActived', 'actions'];
  dataSource: MatTableDataSource<SpecialityResponse>;
  specialities: SpecialityResponse[] = [];
  specialityForm: FormGroup;
  processing = false;
  showModal = false;
  currentSpecialityId: number | null = null;
  isEditMode = false;
  selectedSpecialities: number[] = [];
  selectedTrainingCenterId: string = '';
  detailSpeciality: SpecialityResponse | null = null;
  sessions: SessionResponse[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private specialityService: SpecialityService,
    private fb: FormBuilder,
    private trainingCenterService: TrainingcenterService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSpecialities();
    this.loadTrainingCenters();
    this.loadSessions();
  }

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
    this.sessionService.getall1({ offset: 0, pageSize: 1000, field: 'examDate', order: true }).subscribe({
      next: (response) => {
        this.sessions = response.content || [];
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.showSnackBar('Error loading sessions', 'error');
      }
    });
  }

  initForm(): void {
    this.specialityForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      code: ['', [Validators.required, Validators.maxLength(20)]],
      examType: ['', [Validators.required, Validators.maxLength(50)]],
      trainingCenterId: ['', [Validators.required]]
    });
  }

  loadSpecialities(): void {
    this.specialityService.getall().subscribe({
      next: (response: PageResponseSpecialityResponse) => {
        this.specialities = response.content || [];
        this.dataSource = new MatTableDataSource(this.specialities);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading specialities:', error);
        this.showSnackBar('Error loading specialities', 'error');
      }
    });
  }

  updateStats(): void {
    this.followUpStat[0].value = this.specialities.length.toString();
    this.followUpStat[1].value = '0';
    this.followUpStat[2].value = '0';
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentSpecialityId = null;
    this.specialityForm.reset();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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

  edit(speciality: SpecialityResponse): void {
    this.isEditMode = true;
    this.currentSpecialityId = speciality.id || null;
    this.specialityForm.patchValue({
      name: speciality.name,
      description: speciality.description,
      code: speciality.code || '',
      trainingCenterId: ''
    });
    this.setExamTypeCheckboxes(speciality.examType || '');
    this.showModal = true;
  }

  // Popup détail avec state
  openDetailPopup(speciality: SpecialityResponse): void {
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
        this.processing = true;
        this.specialityService.addSpecialitiesToTrainingCenter({
          agreementNumber: this.selectedTrainingCenterId,
          body: this.selectedSpecialities
        }).subscribe({
          next: (msg) => {
            Swal.fire('Succès', 'Spécialités associées', 'success');
            this.loadSpecialities();
            this.processing = false;
          },
          error: (err) => {
            Swal.fire('Erreur', 'Erreur lors de l\'association', 'error');
            this.processing = false;
          }
        });
      }
    });
  }

  // Popup de confirmation pour la suppression
  delete(speciality: SpecialityResponse): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Supprimer la spécialité ${speciality.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        // TODO: Appeler le backend pour supprimer
        setTimeout(() => {
          Swal.fire('Suppression', 'Suppression fictive (à implémenter)', 'info');
          this.processing = false;
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

  onSubmit(): void {
    if (this.specialityForm.invalid) {
      return;
    }
    this.processing = true;
    const formValue = this.specialityForm.value;
    const createSpecialityRequest = {
      code: formValue.code,
      name: formValue.name,
      description: formValue.description || '',
      examType: formValue.examType || ''
    };
    if (this.isEditMode && this.currentSpecialityId) {
      // Update existing
      // this.specialityService.updateSpeciality({
      //   id: this.currentSpecialityId,
      //   body: createSpecialityRequest
      // }).subscribe({
      //   next: () => {
      //     this.handleSuccess('Speciality updated successfully');
      //   },
      //   error: (error) => {
      //     this.handleError('Error updating speciality', error);
      //   }
      // });
      console.warn('Update functionality is not implemented yet. This is a placeholder.');
      this.handleSuccess('Speciality updated successfully (placeholder)');
    } else {
      this.specialityService.createSpeciality({ 
        body: createSpecialityRequest
      }).subscribe({
        next: () => {
          this.handleSuccess('Speciality created successfully');
        },
        error: (error) => {
          this.handleError('Error creating speciality', error);
        }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.showSnackBar(message);
    this.closeModal();
    this.loadSpecialities();
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
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get f() {
    return this.specialityForm.controls;
  }
}
