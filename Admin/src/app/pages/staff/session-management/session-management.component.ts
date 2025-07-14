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
  displayedColumns: string[] = ['sessionYear', 'examType', 'examDate', 'registrationStartDate', 'registrationEndDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<SessionResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  sessionForm: FormGroup;
  searchForm: FormGroup;
  isEditMode = false;
  selectedSession: SessionResponse | null = null;
  processing = false;
  showInactive = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Propriétés pour le template
  Date = Date;
  Math = Math;

  // Statistiques
  statistics = {
    totalSessions: 0,
    activeSessions: 0,
    inactiveSessions: 0,
    sessionsThisYear: 0
  };

  breadCrumbItems: Array<{}> = [{ label: 'Minister' }, { label: 'Sessions', active: true }];

  constructor(
    private sessionService: SessionService,
    private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      sessionYear: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      examType: ['', Validators.required],
      examDate: ['', Validators.required],
      registrationStartDate: ['', Validators.required],
      registrationEndDate: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      sessionYear: [''],
      examType: [''],
      examDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadSessions();
    this.loadStatistics();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Méthodes utilitaires pour le template
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  loadSessions(): void {
    this.processing = true;
    console.log('Chargement des sessions...');
    
    this.sessionService.getall({ 
      field: 'sessionYear', 
      order: true,
      offset: this.currentPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (res: any) => {
        console.log('Réponse du serveur:', res);
        this.dataSource.data = res?.content ?? [];
        this.totalElements = res?.totalElements ?? 0;
        this.totalPages = res?.totalPages ?? 0;
        this.processing = false;
        console.log('Sessions chargées:', this.dataSource.data.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sessions:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de charger les sessions', 'error');
      }
    });
  }

  loadOpenRegistrationSessions(): void {
    this.processing = true;
    this.sessionService['http'].get<SessionResponse[]>(this.sessionService.rootUrl + '/session/open-registrations').subscribe({
      next: (sessions) => {
        this.dataSource.data = sessions;
        this.totalElements = sessions.length;
        this.totalPages = 1;
        this.processing = false;
      },
      error: (error) => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de charger les sessions ouvertes à l\'inscription', 'error');
      }
    });
  }

  loadStatistics(): void {
    // Calcul des statistiques basiques
    this.statistics.totalSessions = this.dataSource.data.length;
    this.statistics.activeSessions = this.dataSource.data.filter(s => s.examType !== 'Cette session a été supprimée.').length;
    this.statistics.inactiveSessions = this.dataSource.data.filter(s => s.examType === 'Cette session a été supprimée.').length;
    this.statistics.sessionsThisYear = this.dataSource.data.filter(s => 
      s.sessionYear === new Date().getFullYear().toString()
    ).length;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedSession = null;
    this.sessionForm.reset();
    this.showFormModal();
  }

  openEditModal(session: SessionResponse): void {
    if (session.examType === 'Cette session a été supprimée.') {
      Swal.fire('Erreur', 'Impossible de modifier une session supprimée', 'error');
      return;
    }

    this.isEditMode = true;
    this.selectedSession = session;
    this.sessionForm.patchValue({
      sessionYear: session.sessionYear,
      examType: session.examType,
      examDate: session.examDate ? session.examDate.substring(0, 10) : '',
      registrationStartDate: session.registrationStartDate ? session.registrationStartDate.substring(0, 10) : '',
      registrationEndDate: session.registrationEndDate ? session.registrationEndDate.substring(0, 10) : ''
    });
    this.showFormModal();
  }

  showFormModal(): void {
    Swal.fire({
      title: this.isEditMode ? 'Modifier la session' : 'Créer une session',
      html: `
        <form id="sessionForm">
          <div class="mb-3">
            <label class="form-label">Année de session *</label>
            <input name="sessionYear" class="form-control" required 
                   pattern="[0-9]{4}" 
                   title="L'année doit être au format YYYY"
                   value="${this.sessionForm.value.sessionYear || ''}"
                   placeholder="Ex: 2024">
            <div class="form-text">Format: YYYY (ex: 2024)</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Type d'examen *</label>
            <select name="examType" class="form-control" required>
              <option value="">Sélectionner un type</option>
              <option value="CQP" ${this.sessionForm.value.examType === 'CQP' ? 'selected' : ''}>CQP - Certificat de Qualification Professionnelle</option>
              <option value="DQP" ${this.sessionForm.value.examType === 'DQP' ? 'selected' : ''}>DQP - Diplôme de Qualification Professionnelle</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Date d'examen *</label>
            <input name="examDate" type="date" class="form-control" required 
                   value="${this.sessionForm.value.examDate || ''}"
                   min="${new Date().toISOString().split('T')[0]}">
            <div class="form-text">La date doit être future</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Date début inscription *</label>
            <input name="registrationStartDate" type="date" class="form-control" required 
                   value="${this.sessionForm.value.registrationStartDate || ''}">
          </div>
          <div class="mb-3">
            <label class="form-label">Date fin inscription *</label>
            <input name="registrationEndDate" type="date" class="form-control" required 
                   value="${this.sessionForm.value.registrationEndDate || ''}">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const form = document.getElementById('sessionForm') as HTMLFormElement;
        if (form && form.checkValidity()) {
          const formData = new FormData(form);
          const value: any = {};
          formData.forEach((v, k) => value[k] = v);

          // Validation supplémentaire
          if (!value.sessionYear || !value.examType || !value.examDate || !value.registrationStartDate || !value.registrationEndDate) {
            Swal.showValidationMessage('Tous les champs obligatoires doivent être remplis.');
            return false;
          }
          if (value.sessionYear && (value.sessionYear < 2020 || value.sessionYear > 2030)) {
            Swal.showValidationMessage('L\'année doit être entre 2020 et 2030');
            return false;
          }
          if (value.examDate && new Date(value.examDate) < new Date()) {
            Swal.showValidationMessage('La date d\'examen doit être future');
            return false;
          }
          if (value.registrationStartDate > value.registrationEndDate) {
            Swal.showValidationMessage('La date de début d\'inscription doit être antérieure ou égale à la date de fin d\'inscription.');
            return false;
          }
          if (value.registrationStartDate > value.examDate) {
            Swal.showValidationMessage('La date de début d\'inscription doit être antérieure ou égale à la date d\'examen.');
            return false;
          }
          if (value.registrationEndDate > value.examDate) {
            Swal.showValidationMessage('La date de fin d\'inscription doit être antérieure ou égale à la date d\'examen.');
            return false;
          }
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
    console.log('Création de session:', formValue);
    
    this.sessionService.createSession({
      body: {
        sessionYear: formValue.sessionYear,
        examType: formValue.examType,
        examDate: formValue.examDate,
        registrationStartDate: formValue.registrationStartDate,
        registrationEndDate: formValue.registrationEndDate
      }
    }).subscribe({
      next: (response) => {
        console.log('Session créée:', response);
        this.loadSessions();
        this.loadStatistics();
        Swal.fire('Succès', 'Session créée avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur création session:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de créer la session', 'error');
      }
    });
  }

  updateSession(sessionId: number, formValue: any): void {
    this.processing = true;
    console.log('Mise à jour session:', sessionId, formValue);
    
    this.sessionService.updateSession({
      body: {
        sessionId,
        sessionYear: formValue.sessionYear,
        examType: formValue.examType,
        examDate: formValue.examDate,
        registrationStartDate: formValue.registrationStartDate,
        registrationEndDate: formValue.registrationEndDate
      }
    }).subscribe({
      next: (response) => {
        console.log('Session mise à jour:', response);
        this.loadSessions();
        this.loadStatistics();
        Swal.fire('Succès', 'Session modifiée avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur mise à jour session:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de modifier la session', 'error');
      }
    });
  }

  confirmDelete(session: SessionResponse): void {
    const isDeleted = session.examType === 'Cette session a été supprimée.';
    
    Swal.fire({
      title: 'Confirmation',
      text: isDeleted 
        ? `Voulez-vous vraiment supprimer définitivement la session ${session.sessionYear} ?`
        : `Voulez-vous vraiment désactiver la session ${session.sessionYear} (${session.examType}) ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: isDeleted ? 'Oui, supprimer définitivement' : 'Oui, désactiver',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (result.isConfirmed && session.id) {
        if (isDeleted) {
          this.deleteSessionPermanently(session.id);
        } else {
          this.deactivateSession(session.id);
        }
      }
    });
  }

  deactivateSession(sessionId: number): void {
    this.processing = true;
    console.log('Désactivation session:', sessionId);
    
    this.sessionService.deactivateSession({ sessionId }).subscribe({
      next: () => {
        console.log('Session désactivée');
        this.loadSessions();
        this.loadStatistics();
        Swal.fire('Succès', 'Session désactivée avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur désactivation session:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de désactiver la session', 'error');
      }
    });
  }

  reactivateSession(sessionId: number): void {
    this.processing = true;
    console.log('Réactivation session:', sessionId);
    
    this.sessionService.reactivateSession({ sessionId }).subscribe({
      next: () => {
        console.log('Session réactivée');
        this.loadSessions();
        this.loadStatistics();
        Swal.fire('Succès', 'Session réactivée avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur réactivation session:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de réactiver la session', 'error');
      }
    });
  }

  deleteSessionPermanently(sessionId: number): void {
    this.processing = true;
    console.log('Suppression définitive session:', sessionId);
    
    this.sessionService.deleteSessionPermanently({ sessionId }).subscribe({
      next: () => {
        console.log('Session supprimée définitivement');
        this.loadSessions();
        this.loadStatistics();
        Swal.fire('Succès', 'Session supprimée définitivement', 'success');
      },
      error: (error) => {
        console.error('Erreur suppression définitive session:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de supprimer définitivement la session', 'error');
      }
    });
  }

  searchSessions(): void {
    const searchValue = this.searchForm.value;
    console.log('Recherche sessions:', searchValue);
    
    if (searchValue.sessionYear || searchValue.examType || searchValue.examDate) {
      // Recherche par année
      if (searchValue.sessionYear) {
        this.sessionService.findSessionByYear({
          sessionYear: searchValue.sessionYear,
          offset: 0,
          pageSize: 100,
          field: 'sessionYear',
          order: true
        }).subscribe({
          next: (res: any) => {
            this.dataSource.data = res?.content ?? [];
            this.totalElements = res?.totalElements ?? 0;
            this.totalPages = res?.totalPages ?? 0;
          },
          error: (error) => {
            console.error('Erreur recherche par année:', error);
            Swal.fire('Erreur', 'Erreur lors de la recherche', 'error');
          }
        });
      }
      // Recherche par date d'examen
      else if (searchValue.examDate) {
        this.sessionService.findByName2({
          examDate: searchValue.examDate
        }).subscribe({
          next: (sessions) => {
            this.dataSource.data = sessions;
            this.totalElements = sessions.length;
            this.totalPages = Math.ceil(sessions.length / this.pageSize);
          },
          error: (error) => {
            console.error('Erreur recherche par date:', error);
            Swal.fire('Erreur', 'Erreur lors de la recherche', 'error');
          }
        });
      }
    } else {
      this.loadSessions();
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadSessions();
  }

  exportToExcel(): void {
    const sessions = this.dataSource.data;
    if (sessions.length === 0) {
      Swal.fire('Information', 'Aucune donnée à exporter', 'info');
      return;
    }

    // Création du contenu CSV
    const headers = ['Année', 'Type d\'examen', 'Date d\'examen', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...sessions.map(session => [
        session.sessionYear || '',
        session.examType || '',
        session.examDate || '',
        session.examType === 'Cette session a été supprimée.' ? 'Inactive' : 'Active'
      ].join(','))
    ].join('\n');

    // Téléchargement du fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sessions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Succès', 'Export terminé avec succès', 'success');
  }

  refreshData(): void {
    this.loadSessions();
    this.loadStatistics();
    Swal.fire('Succès', 'Données actualisées', 'success');
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSessions();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusBadgeClass(session: SessionResponse): string {
    return session.examType === 'Cette session a été supprimée.' 
      ? 'badge bg-danger' 
      : 'badge bg-success';
  }

  getStatusText(session: SessionResponse): string {
    return session.examType === 'Cette session a été supprimée.' 
      ? 'Inactive' 
      : 'Active';
  }

  canEdit(session: SessionResponse): boolean {
    return session.examType !== 'Cette session a été supprimée.';
  }

  canDelete(session: SessionResponse): boolean {
    return true; // Toutes les sessions peuvent être supprimées
  }

  canReactivate(session: SessionResponse): boolean {
    return session.examType === 'Cette session a été supprimée.';
  }
}
