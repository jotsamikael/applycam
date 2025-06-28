import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { CandidateService } from '../../../services/services/candidate.service';
import { CandidateRequest } from '../../../services/models/candidate-request';

@Component({
  selector: 'app-candidates-management',
  templateUrl: './candidates-management.component.html',
  styleUrls: ['./candidates-management.component.scss']
})
export class CandidatesManagementComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Candidates Management', active: true }
  ];

  displayedColumns: string[] = [
    'lastname', 'firstname', 'email', 'dateOfBirth', 'nationality', 'contentStatus', 'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);
  processing = false;
  modalRef?: BsModalRef;
  CandidateForm!: FormGroup;
  selectedCandidate: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('addNew') addNewTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCandidates();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm() {
    this.CandidateForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(64)]],
      lastname: ['', [Validators.required, Validators.maxLength(64)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      highestSchoolLevel: ['', [Validators.required]],
      nationalIdNumber: ['', [Validators.required]],
      fatherFullName: ['', [Validators.required]],
      fatherProfession: ['', [Validators.required]],
      motherFullName: ['', [Validators.required]],
      motherProfession: ['', [Validators.required]],
      birthCertificateUrl: [''],
      highestDiplomatUrl: [''],
      nationalIdCardUrl: [''],
      contentStatus: ['DRAFT', [Validators.required]]
    });
  }

  get f() {
    return this.CandidateForm.controls;
  }

  loadCandidates() {
    this.candidateService.getAllCandidates().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.content || [];
      },
      error: () => {
        Swal.fire('Error', 'Failed to load candidates', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateNewModal() {
    this.selectedCandidate = null;
    this.CandidateForm.reset();
    this.CandidateForm.patchValue({ contentStatus: 'DRAFT' });
    this.modalRef = this.modalService.show(this.addNewTemplate);
  }

  createNewCandidate() {
    if (this.CandidateForm.invalid) return;
    this.processing = true;
    const formValue: CandidateRequest = this.CandidateForm.value;
    this.candidateService.updateCandidate({ email: formValue.email!, body: formValue }).subscribe({
      next: () => {
        this.loadCandidates();
        this.processing = false;
        this.modalRef?.hide();
        Swal.fire('Success', 'Candidate created/updated successfully', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Error', 'Failed to create/update candidate', 'error');
      }
    });
  }

  edit(row: any) {
    this.selectedCandidate = row;
    this.CandidateForm.patchValue(row);
    this.modalRef = this.modalService.show(this.editTemplate);
  }

  updateCandidate() {
    if (this.CandidateForm.invalid || !this.selectedCandidate) return;
    this.processing = true;
    const formValue = this.CandidateForm.value;
    this.candidateService.updateCandidate({ email: this.selectedCandidate.email, body: formValue }).subscribe({
      next: () => {
        this.loadCandidates();
        this.processing = false;
        this.modalRef?.hide();
        Swal.fire('Success', 'Candidate updated successfully', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Error', 'Failed to update candidate', 'error');
      }
    });
  }

  delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        // Pas de méthode delete côté service, suppression locale
        this.dataSource.data = this.dataSource.data.filter((c: any) => c.email !== row.email);
        this.candidateService.toggleCandidate(row.email).subscribe({
          next: () => {
            this.loadCandidates();
            Swal.fire('Deleted!', 'Candidate has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete candidate', 'error');
          }
        });
      }
    });
  }
}
