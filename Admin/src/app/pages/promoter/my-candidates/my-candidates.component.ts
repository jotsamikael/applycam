import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateResponse } from '../../../services/models/candidate-response';
import { CandidateService } from '../../../services/services/candidate.service';
import { CandidateByCenterRequest } from '../../../services/models/candidate-request';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { TrainingCenterResponse } from '../../../services/models/training-center-response';
import Swal from 'sweetalert2';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PageResponseCandidateResponse } from '../../../services/models/page-response-candidate-response';
import { TokenService } from '../../../services/token/token.service';

@Component({
  selector: 'app-my-candidates',
  templateUrl: './my-candidates.component.html',
  styleUrls: ['./my-candidates.component.scss']
})
export class MyCandidatesComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Candidates', active: true },
    { label: 'Management', active: true }
  ];

  followUpStat = [
    { title: 'Total Candidates', value: '0', icon: 'bx bx-user' },
    { title: 'Approved', value: '0', icon: 'bx bx-check-circle' },
    { title: 'Pending', value: '0', icon: 'bx bx-time' }
  ];

  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];
  dataSource: MatTableDataSource<CandidateResponse>;
  candidates: CandidateResponse[] = [
    {
    
    },
    {
     
    }
  ];

  candidateForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentCandidateId: number | null = null;
  processing = false;
  trainingCenters: TrainingCenterResponse[] = [];
  languages: string[] = ['Français', 'Anglais', 'Espagnol', 'Allemand'];
  isSingleTrainingCenter = false;
  candidatesByCenter: { [centerName: string]: CandidateResponse[] } = {};
  selectedYear: number = new Date().getFullYear();
  loadingCandidates = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private candidateService: CandidateService,
    private trainingcenterService: TrainingcenterService,
    private tokenService: TokenService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (!this.tokenService.hasRole('PROMOTER')) {
      Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas les droits pour accéder à la gestion des candidats par centre.',
        confirmButtonText: 'Retour'
      });
      return;
    }
    this.loadTrainingCenters();
    this.loadAllCandidatesByCenter();
  }

  loadAllCandidatesByCenter(): void {
    this.loadingCandidates = true;
    this.candidateService.getCandidatesOfConnectedpromoterid({
      year: this.selectedYear,
      offset: 0,
      pageSize: 1000, // pour tout charger
      field: 'firstname',
      order: true
    }).subscribe({
      next: (res: PageResponseCandidateResponse) => {
        const allCandidates = res.content || [];
        this.candidatesByCenter = {};
        for (const center of this.trainingCenters) {
          this.candidatesByCenter[center.fullName!] = allCandidates.filter(c => {
            return c.hasSchooledList?.some((hs: any) => hs.trainingCenterName === center.fullName);
          });
        }
        this.loadingCandidates = false;
      },
      error: () => {
        this.candidatesByCenter = {};
        this.loadingCandidates = false;
      }
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    // Si tu veux charger à la demande, tu peux le faire ici
  }

  initForm(): void {
    this.candidateForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      language: ['', [Validators.required]],
      startYear: ['', [Validators.required]],
      endYear: ['', [Validators.required]],
      trainingCenterName: ['', [Validators.required]],
    });
  }

  loadCandidates(): void {
    this.dataSource = new MatTableDataSource(this.candidates);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updateStats();
  }

  loadTrainingCenters(): void {
    this.trainingcenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next: (centers) => {
        this.trainingCenters = centers || [];
        if (this.trainingCenters.length === 1) {
          this.isSingleTrainingCenter = true;
          this.candidateForm.patchValue({ trainingCenterName: this.trainingCenters[0].fullName });
          this.candidateForm.get('trainingCenterName')?.disable();
        } else {
          this.isSingleTrainingCenter = false;
          this.candidateForm.get('trainingCenterName')?.enable();
        }
      },
      error: () => {
        this.trainingCenters = [];
        this.isSingleTrainingCenter = false;
      }
    });
  }

  updateStats(): void {
    this.followUpStat[0].value = this.candidates.length.toString();
    this.followUpStat[1].value = this.candidates.filter(c => c.contentStatus === 'VALIDATED').length.toString(); // corrigé
    this.followUpStat[2].value = this.candidates.filter(c => c.contentStatus === 'DRAFT').length.toString(); // corrigé
  }

  openCreatePopup(): void {
    const htmlForm = `
      <form id="swal-candidate-form">
        <div class='mb-2'><input id='swal-input-firstname' class='swal2-input' placeholder='First Name' required maxlength='50'></div>
        <div class='mb-2'><input id='swal-input-lastname' class='swal2-input' placeholder='Last Name' required maxlength='50'></div>
        <div class='mb-2'><input id='swal-input-email' class='swal2-input' placeholder='Email' type='email' required></div>
        <div class='mb-2'><input id='swal-input-phone' class='swal2-input' placeholder='Phone Number' required pattern='[0-9]{9,15}'></div>
        <div class='mb-2'>
          <select id='swal-input-language' class='swal2-input'>
            ${this.languages.map(lang => `<option value='${lang}'>${lang}</option>`).join('')}
          </select>
        </div>
        <div class='mb-2'>
          <select id='swal-input-trainingcenter' class='swal2-input' ${this.isSingleTrainingCenter ? 'disabled' : ''}>
            ${this.trainingCenters.map(center => `<option value='${center.fullName}'>${center.fullName}</option>`).join('')}
          </select>
        </div>
        <div class='mb-2'><input id='swal-input-startyear' class='swal2-input' placeholder='Start Year (YYYY-MM-DD)' required></div>
        <div class='mb-2'><input id='swal-input-endyear' class='swal2-input' placeholder='End Year (YYYY-MM-DD)' required></div>
      </form>
    `;
    Swal.fire({
      title: 'Create Candidate',
      html: htmlForm,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const firstname = (document.getElementById('swal-input-firstname') as HTMLInputElement).value;
        const lastname = (document.getElementById('swal-input-lastname') as HTMLInputElement).value;
        const email = (document.getElementById('swal-input-email') as HTMLInputElement).value;
        const phoneNumber = (document.getElementById('swal-input-phone') as HTMLInputElement).value;
        const language = (document.getElementById('swal-input-language') as HTMLSelectElement).value;
        const trainingCenterName = this.isSingleTrainingCenter && this.trainingCenters.length === 1
          ? this.trainingCenters[0].fullName
          : (document.getElementById('swal-input-trainingcenter') as HTMLSelectElement).value;
        const startYear = (document.getElementById('swal-input-startyear') as HTMLInputElement).value;
        const endYear = (document.getElementById('swal-input-endyear') as HTMLInputElement).value;
        if (!firstname || !lastname || !email || !phoneNumber || !language || !trainingCenterName || !startYear || !endYear) {
          Swal.showValidationMessage('All fields are required');
          return;
        }
        return { firstname, lastname, email, phoneNumber, language, trainingCenterName, startYear, endYear };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.candidateService.createCandidateByCenter(result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Candidate created successfully',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadAllCandidatesByCenter();
          },
          error: (err) => {
            this.showSnackBar('Error creating candidate: ' + (err?.error?.message || 'Unknown error'));
          }
        });
      }
    });
  }

  edit(candidate: any): void {
    this.isEditMode = true;
    this.currentCandidateId = candidate.idUser || null;
    this.candidateForm.patchValue({
      firstname: candidate.firstname,
      lastname: candidate.lastname,
      email: candidate.email,
      phoneNumber: candidate.phoneNumber,
      nationalIdNumber: candidate.nationalIdNumber,
      sex: candidate.sex,
      contentStatus: candidate.contentStatus
    });
    this.showModal = true;
  }

  delete(candidate: any): void {
    if (confirm(`Are you sure you want to delete ${candidate.firstname} ${candidate.lastname}?`)) {
      this.candidates = this.candidates.filter((c: any) => c.idUser !== candidate.idUser);
      this.loadCandidates();
      this.showSnackBar('Candidate deleted successfully');
    }
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      return;
    }
    this.processing = true;
    const candidateData: CandidateByCenterRequest = this.candidateForm.value;
    this.candidateService.createCandidateByCenter(candidateData).subscribe({
      next: () => {
        this.showSnackBar('Candidate created successfully');
        this.closeModal();
        this.loadCandidates();
        this.processing = false;
      },
      error: (err) => {
        this.showSnackBar('Error creating candidate: ' + (err?.error?.message || 'Unknown error'));
        this.processing = false;
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }

  get f() {
    return this.candidateForm.controls;
  }
}