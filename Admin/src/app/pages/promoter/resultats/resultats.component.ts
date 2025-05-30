import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ExamResult {
  id: number;
  candidateName: string;
  examName: string;
  score: number;
  passingScore: number;
  passed: boolean;
  date: string;
}

@Component({
  selector: 'app-resultats',
  templateUrl: './resultats.component.html',
  styleUrls: ['./resultats.component.scss']
})
export class ResultatsComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Exams', active: true },
    { label: 'Results', active: true }
  ];

  followUpStat = [
    { title: 'Total Results', value: '0', icon: 'bx bx-file' },
    { title: 'Passed', value: '0', icon: 'bx bx-check' },
    { title: 'Failed', value: '0', icon: 'bx bx-x' }
  ];

  displayedColumns: string[] = ['candidateName', 'examName', 'score', 'status', 'date', 'actions'];
  dataSource: MatTableDataSource<ExamResult>;
  results: ExamResult[] = [
    { id: 1, candidateName: 'Jean Dupont', examName: 'Mathematics', score: 85, passingScore: 50, passed: true, date: '2023-06-15' },
    { id: 2, candidateName: 'Marie Kamga', examName: 'French', score: 42, passingScore: 50, passed: false, date: '2023-06-16' },
    { id: 3, candidateName: 'Paul Biya', examName: 'English', score: 78, passingScore: 50, passed: true, date: '2023-06-17' }
  ];

  resultForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentResultId: number | null = null;
  processing = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadResults();
  }

  initForm(): void {
    this.resultForm = this.fb.group({
      candidateName: ['', [Validators.required, Validators.maxLength(100)]],
      examName: ['', [Validators.required, Validators.maxLength(100)]],
      score: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      passingScore: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      date: ['', [Validators.required]]
    });
  }

  loadResults(): void {
    this.dataSource = new MatTableDataSource(this.results);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updateStats();
  }

  updateStats(): void {
    this.followUpStat[0].value = this.results.length.toString();
    this.followUpStat[1].value = this.results.filter(r => r.passed).length.toString();
    this.followUpStat[2].value = this.results.filter(r => !r.passed).length.toString();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentResultId = null;
    this.resultForm.reset({
      passingScore: 50,
      date: new Date().toISOString().split('T')[0]
    });
    this.showModal = true;
    this.changeDetectorRef.detectChanges();
  }

  edit(result: ExamResult): void {
    this.isEditMode = true;
    this.currentResultId = result.id;
    this.resultForm.patchValue({
      candidateName: result.candidateName,
      examName: result.examName,
      score: result.score,
      passingScore: result.passingScore,
      date: result.date
    });
    this.showModal = true;
    this.changeDetectorRef.detectChanges();
  }

  delete(result: ExamResult): void {
    if (confirm(`Are you sure you want to delete this result?`)) {
      this.results = this.results.filter(r => r.id !== result.id);
      this.loadResults();
      this.showSnackBar('Result deleted successfully');
    }
  }

  onSubmit(): void {
    if (this.resultForm.invalid) {
      return;
    }

    this.processing = true;
    const formValue = this.resultForm.value;
    const resultData: ExamResult = {
      ...formValue,
      passed: formValue.score >= formValue.passingScore,
      id: this.isEditMode && this.currentResultId ? this.currentResultId : Math.max(...this.results.map(r => r.id)) + 1
    };

    setTimeout(() => {
      if (this.isEditMode && this.currentResultId) {
        const index = this.results.findIndex(r => r.id === this.currentResultId);
        if (index !== -1) {
          this.results[index] = resultData;
          this.showSnackBar('Result updated successfully');
        }
      } else {
        this.results.push(resultData);
        this.showSnackBar('Result added successfully');
      }

      this.closeModal();
      this.loadResults();
      this.processing = false;
    }, 1000);
  }

  closeModal(): void {
    this.showModal = false;
    this.changeDetectorRef.detectChanges();
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
    return this.resultForm.controls;
  }
}