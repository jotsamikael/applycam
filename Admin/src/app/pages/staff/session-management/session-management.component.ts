import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/services/services/session.service';
import { SessionResponse } from 'src/app/services/models/session-response';

@Component({
  selector: 'app-session-management',
  templateUrl: './session-management.component.html',
  styleUrls: ['./session-management.component.scss']
})
export class SessionManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sessionYear', 'examType', 'examDate', 'actions'];
  dataSource = new MatTableDataSource<SessionResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  sessionForm: FormGroup;
  isEditMode = false;
  selectedSession: SessionResponse | null = null;
  processing = false;

  breadCrumbItems: Array<{}> = [{ label: 'Minister' }, { label: 'Sessions', active: true }];

  constructor(
    private sessionService: SessionService,
    private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      sessionYear: ['', Validators.required],
      examType: ['', Validators.required],
      examDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSessions(): void {
    this.processing = true;
    this.sessionService.getall({ field: 'sessionYear', order: true }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res?.content ?? [];
        this.processing = false;
      },
      error: () => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de charger les sessions', 'error');
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedSession = null;
    this.sessionForm.reset();
    this.showFormModal();
  }

  openEditModal(session: SessionResponse): void {
    this.isEditMode = true;
    this.selectedSession = session;
    this.sessionForm.patchValue({
      sessionYear: session.sessionYear,
      examType: session.examType,
      examDate: session.examDate ? session.examDate.substring(0, 10) : ''
    });
    this.showFormModal();
  }

  showFormModal(): void {
    Swal.fire({
      title: this.isEditMode ? 'Modifier la session' : 'Créer une session',
      html: `
        <form id="sessionForm">
          <div class="mb-2">
            <label>Année</label>
            <input name="sessionYear" class="form-control" required value="${this.sessionForm.value.sessionYear || ''}">
          </div>
          <div class="mb-2">
            <label>Type d'examen</label>
            <select name="examType" class="form-control" required>
              <option value="">Sélectionner</option>
              <option value="CQP" ${this.sessionForm.value.examType === 'CQP' ? 'selected' : ''}>CQP</option>
              <option value="DQP" ${this.sessionForm.value.examType === 'DQP' ? 'selected' : ''}>DQP</option>
            </select>
          </div>
          <div class="mb-2">
            <label>Date d'examen</label>
            <input name="examDate" type="date" class="form-control" required value="${this.sessionForm.value.examDate || ''}">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const form = document.getElementById('sessionForm') as HTMLFormElement;
        if (form && form.checkValidity()) {
          const formData = new FormData(form);
          const value: any = {};
          formData.forEach((v, k) => value[k] = v);
          return value;
        } else {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        if (this.isEditMode && this.selectedSession?.id) {
          this.updateSession(this.selectedSession.id, result.value);
        } else {
          this.createSession(result.value);
        }
      }
    });
  }

  createSession(formValue: any): void {
    this.processing = true;
    this.sessionService.createSession({
      body: {
        sessionYear: formValue.sessionYear,
        examType: formValue.examType,
        examDate: formValue.examDate
      }
    }).subscribe({
      next: () => {
        this.loadSessions();
        Swal.fire('Succès', 'Session créée avec succès', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Succès', 'Session créée avec succès', 'success');
      }
    });
  }

  updateSession(sessionId: number, formValue: any): void {
    this.processing = true;
    this.sessionService.updateSession({
      body: {
        sessionId,
        sessionYear: formValue.sessionYear,
        examType: formValue.examType,
        examDate: formValue.examDate
      }
    }).subscribe({
      next: () => {
        this.loadSessions();
        Swal.fire('Succès', 'Session modifiée avec succès', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Succès', 'Session modifiée avec succès', 'success');
      }
    });
  }

  confirmDelete(session: SessionResponse): void {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer la session ${session.sessionYear} (${session.examType}) ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed && session.id) {
        this.deleteSession(session.id);
      }
    });
  }

  deleteSession(sessionId: number): void {
    this.processing = true;
    this.sessionService.deleteSession({ sessionId }).subscribe({
      next: () => {
        this.loadSessions();
        Swal.fire('Succès', 'Session supprimée avec succès', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de supprimer la session', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
