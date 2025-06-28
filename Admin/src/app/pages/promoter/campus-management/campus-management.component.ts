import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CampusService } from '../../../services/services/campus.service';
import { CampusResponse } from '../../../services/models/campus-response';
import { TokenService } from '../../../services/token/token.service';

@Component({
  selector: 'app-campus-management',
  templateUrl: './campus-management.component.html',
  styleUrls: ['./campus-management.component.scss']
})
export class CampusManagementComponent implements OnInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'My Campuses', active: true }
  ];
  displayedColumns: string[] = ['name', 'town', 'quarter', 'capacity', 'actions'];
  dataSource = new MatTableDataSource<CampusResponse>([]);
  stats = [
    { title: 'Total Campuses', value: 0, icon: 'bx-buildings', color: 'primary' },
    { title: 'Total Capacity', value: 0, icon: 'bx-group', color: 'success' }
  ];
  isLoading = false;
  processing = false;
  createForm!: FormGroup;
  editForm!: FormGroup;
  selectedCampus: CampusResponse | null = null;
  errorMessages: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Pour les modals
  @ViewChild('createModal') createModalTpl!: TemplateRef<any>;
  @ViewChild('editModal') editModalTpl!: TemplateRef<any>;
  @ViewChild('detailsModal') detailsModalTpl!: TemplateRef<any>;
  modalRef?: MatDialogRef<any>;

  constructor(
    private campusService: CampusService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCampuses();
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      town: ['', Validators.required],
      quarter: [''],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      town: ['', Validators.required],
      quarter: [''],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  loadCampuses() {
    this.isLoading = true;
    this.campusService.findAllCampusesOfPromoter().subscribe({
      next: (campuses) => {
        this.dataSource.data = campuses;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.stats[0].value = campuses.length;
        this.stats[1].value = campuses.reduce((sum, c) => sum + (c.capacity || 0), 0);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateModal() {
    this.createForm.reset();
    this.modalRef = this.dialog.open(this.createModalTpl, { width: '500px', panelClass: 'modal-colored' });
  }

  createCampus() {
    if (this.createForm.invalid) return;
    this.processing = true;
    const campus = this.createForm.value;
    this.campusService.createCampus(campus).subscribe({
      next: () => {
        this.loadCampuses();
        this.processing = false;
        this.modalRef?.close();
      },
      error: () => {
        this.processing = false;
        this.errorMessages = ['Erreur lors de la création du campus.'];
      }
    });
  }

  openEditModal(campus: CampusResponse) {
    this.selectedCampus = campus;
    this.editForm.patchValue({
      name: campus.name,
      town: campus.town,
      quarter: campus.quarter,
      capacity: campus.capacity
    });
    this.modalRef = this.dialog.open(this.editModalTpl, { width: '500px', panelClass: 'modal-colored' });
  }

  updateCampus() {
    if (this.editForm.invalid || !this.selectedCampus) return;
    this.processing = true;
    const updatedCampus = { ...this.selectedCampus, ...this.editForm.value };
    // Appeler le service pour mettre à jour le campus (méthode à adapter selon l'API)
    // Exemple : this.campusService.updateCampus({ id: updatedCampus.id, body: updatedCampus }).subscribe(...)
    this.processing = false;
    this.modalRef?.close();
  }

  viewCampusDetails(campus: CampusResponse) {
    this.selectedCampus = campus;
    this.modalRef = this.dialog.open(this.detailsModalTpl, { width: '500px', panelClass: 'modal-colored' });
  }

  confirmDelete(campus: CampusResponse) {
    // Ouvre un modal de confirmation, puis supprime si confirmé
    // Exemple : this.campusService.deleteCampus({ id: campus.id }).subscribe(...)
    this.loadCampuses();
  }
}