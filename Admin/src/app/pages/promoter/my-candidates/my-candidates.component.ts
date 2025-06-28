import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Candidate } from '../../../services/models/candidate';

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
  dataSource: MatTableDataSource<Candidate>;
  candidates: Candidate[] = [
    {
      idUser: 1,
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      phoneNumber: '123456789',
      contentStatus: 'VALIDATED', // corrigé
      nationalIdNumber: '1234567890',
      sex: 'M'
    },
    {
      idUser: 2,
      firstname: 'Marie',
      lastname: 'Kamga',
      email: 'marie.kamga@example.com',
      phoneNumber: '987654321',
      contentStatus: 'DRAFT', // corrigé
      nationalIdNumber: '0987654321',
      sex: 'F'
    }
  ];

  candidateForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentCandidateId: number | null = null;
  processing = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCandidates();
  }

  initForm(): void {
    this.candidateForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      nationalIdNumber: ['', [Validators.required]],
      sex: ['M', [Validators.required]],
      contentStatus: ['DRAFT', [Validators.required]]
    });
  }

  loadCandidates(): void {
    this.dataSource = new MatTableDataSource(this.candidates);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updateStats();
  }

  updateStats(): void {
    this.followUpStat[0].value = this.candidates.length.toString();
    this.followUpStat[1].value = this.candidates.filter(c => c.contentStatus === 'VALIDATED').length.toString(); // corrigé
    this.followUpStat[2].value = this.candidates.filter(c => c.contentStatus === 'DRAFT').length.toString(); // corrigé
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentCandidateId = null;
    this.candidateForm.reset({
      sex: 'M',
      contentStatus: 'DRAFT'
    });
    this.showModal = true;
  }

  edit(candidate: Candidate): void {
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

  delete(candidate: Candidate): void {
    if (confirm(`Are you sure you want to delete ${candidate.firstname} ${candidate.lastname}?`)) {
      this.candidates = this.candidates.filter(c => c.idUser !== candidate.idUser);
      this.loadCandidates();
      this.showSnackBar('Candidate deleted successfully');
    }
  }

  onSubmit(): void {
    if (this.candidateForm.invalid) {
      return;
    }

    this.processing = true;
    const candidateData = this.candidateForm.value;

    setTimeout(() => {
      if (this.isEditMode && this.currentCandidateId) {
        // Update
        const index = this.candidates.findIndex(c => c.idUser === this.currentCandidateId);
        if (index !== -1) {
          this.candidates[index] = { ...this.candidates[index], ...candidateData };
          this.showSnackBar('Candidate updated successfully');
        }
      } else {
        // Create
        const newId = Math.max(...this.candidates.map(c => c.idUser || 0)) + 1;
        this.candidates.push({ ...candidateData, idUser: newId });
        this.showSnackBar('Candidate added successfully');
      }

      this.closeModal();
      this.loadCandidates();
      this.processing = false;
    }, 1000);
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