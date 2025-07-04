import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { CandidateService } from '../../../services/services/candidate.service';
import { CandidateRequest } from '../../../services/models/candidate-request';
import { CandidateResponse } from '../../../services/models/candidate-response';
import { ExamCenterControllerService } from '../../../services/services/exam-center-controller.service';
import { ExamCenterResponse } from '../../../services/models/exam-center-response';
import { PageResponseCandidateResponse } from 'src/app/services/models';
import { TrainingcenterService } from 'src/app/services/services';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-candidates-management',
  templateUrl: './candidates-management.component.html',
  styleUrls: ['./candidates-management.component.scss']
})
export class CandidatesManagementComponent implements OnInit, AfterViewInit {
  breadCrumbItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Candidates Management', active: true }
  ];

  displayedColumns: string[] = [
    'lastname', 'firstname', 'email', 'dateOfBirth', 'nationality', 'contentStatus', 'actions'
  ];
  dataSource = new MatTableDataSource<CandidateResponse>([]);
  processing = false;
  modalRef?: BsModalRef;
  CandidateForm!: FormGroup;
  selectedCandidate: CandidateResponse | null = null;
  examCenters: ExamCenterResponse[] = [];
  isEditMode = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  // Statistiques pour les cartes
  stats: { title: string, value: number, icon: string, color: string }[] = [];

  countries: string[] = [
    // Afrique
    'Cameroun', 'Nigeria', 'Ghana', 'Sénégal', 'Côte d\'Ivoire', 'Togo', 'Bénin',
    'Niger', 'Tchad', 'Gabon', 'Congo', 'Maroc', 'Algérie', 'Tunisie', 'Égypte',
    // Europe
    'France', 'Allemagne', 'Royaume-Uni', 'Espagne', 'Italie', 'Portugal', 'Belgique',
    'Suisse', 'Pays-Bas', 'Suède', 'Norvège', 'Danemark', 'Finlande', 'Pologne', 'Russie'
  ].sort(); // Trié par ordre alphabétique

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formModal') formModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private candidateService: CandidateService,
    private examCenterService: ExamCenterControllerService,
    private trainingCenterService: TrainingcenterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCandidates();
    this.loadExamCenters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: CandidateResponse, filter: string) => {
      const allText = `${data.firstname || ''} ${data.lastname || ''} ${data.email || ''} ${data.contentStatus || ''}`.toLowerCase();
      return allText.includes(filter);
    };
  }

  loadExamCenters() {
    this.trainingCenterService.getAllTrainingCenters()
      .pipe(
        switchMap(trainingCentersResponse => {
          const divisions = [...new Set(
            (trainingCentersResponse.content || [])
              .map(tc => tc.division)
              .filter((d): d is string => !!d)
          )];

          if (divisions.length === 0) {
            console.warn("Aucune division trouvée, la recherche de centres d'examen ne peut pas continuer.");
            return forkJoin([]);
          }

          const examCenterRequests = divisions.map(division =>
            this.examCenterService.findByName4({ division })
          );

          return forkJoin(examCenterRequests);
        }),
        map(responses => {
          return responses.flatMap(response => response.content || []);
        })
      ).subscribe({
        next: (allCenters) => {
          this.examCenters = allCenters;
          if (this.examCenters.length === 0) {
            console.warn("La liste des centres d'examen est vide après avoir interrogé toutes les divisions.");
          }
        },
        error: (err) => {
          console.error("Erreur lors du chargement des centres d'examen:", err);
          Swal.fire('Erreur', "Impossible de charger les centres d'examen. Vérifiez la console pour les détails.", 'error');
        }
      });
  }

  initForm() {
    this.CandidateForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      sex: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      placeOfBirth: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      highestSchoolLevel: [''],
      fatherFullName: [''],
      fatherProfession: [''],
      motherFullName: [''],
      motherProfession: [''],
      examCenterId: [null, [Validators.required]],
      contentStatus: ['DRAFT', [Validators.required]],
    });
  }

  get f() {
    return this.CandidateForm.controls;
  }

  showDetails(candidate: CandidateResponse) {
    const formatDate = (date: string | undefined): string => {
      return date ? new Date(date).toLocaleDateString('fr-FR') : 'Non renseigné';
    };

    // 1. Récupérer l'ID du centre d'examen depuis l'objet candidat.
    // L'objet `examCenter` peut exister sur l'objet `candidate` même si le type ne le déclare pas.
    const examCenterId = (candidate as any).examCenter?.id;

    // 2. Chercher le nom du centre dans la liste `this.examCenters`
    let examCenterName = 'Non assigné';
    if (examCenterId) {
      const center = this.examCenters.find(c => c.id === examCenterId);
      examCenterName = center?.name || 'Inconnu (ID introuvable)';
    }

    // 3. Afficher le popup avec le nom trouvé
    Swal.fire({
      title: `<strong>Détails du candidat</strong>`,
      html: `
        <div style="text-align: left;">
          <div class="row">
            <div class="col-md-6">
              <h6 class="text-primary">Infos personnelles</h6>
              <p><strong>Nom:</strong> ${candidate.lastname || ''} ${candidate.firstname || ''}</p>
              <p><strong>Email:</strong> ${candidate.email || ''}</p>
              <p><strong>Téléphone:</strong> ${candidate.phoneNumber || ''}</p>
              <p><strong>Né(e) le:</strong> ${formatDate(candidate.dateOfBirth)} à ${candidate.placeOfBirth || ''}</p>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary">Infos académiques & Parents</h6>
              <p><strong>Niveau:</strong> ${candidate.highestSchoolLevel || 'Non renseigné'}</p>
              <p><strong>Père:</strong> ${candidate.fatherFullName || 'N/A'}</p>
              <p><strong>Mère:</strong> ${candidate.motherFullName || 'N/A'}</p>
            </div>
          </div>
          <hr/>
          <h6 class="text-primary">Centre & Statut</h6>
          <p><strong>Centre d'examen:</strong> ${examCenterName}</p>
          <p><strong>Statut du dossier:</strong> <span class="badge bg-info">${candidate.contentStatus || 'DRAFT'}</span></p>
        </div>
      `,
      width: 800,
      showCloseButton: true,
      showConfirmButton: false,
    });
  }

  loadCandidates(event?: any) {
    const pageIndex = event?.pageIndex ?? this.pageIndex;
    const pageSize = event?.pageSize ?? this.pageSize;

    this.candidateService.getAllCandidates({
      offset: pageIndex,
      pageSize: pageSize,
      field: 'firstname', // ou autre champ de tri
      order: true
    }).subscribe({
      next: (res) => {
        this.dataSource.data = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.pageSize = res.size || pageSize;
        this.pageIndex = res.number || pageIndex;
        // Calcul des stats
        const all = this.dataSource.data;
        this.stats = [
          { title: 'Total', value: all.length, icon: 'bx bx-group', color: 'primary' },
          { title: 'Validés', value: all.filter(c => c.contentStatus === 'VALIDATED').length, icon: 'bx bx-check-circle', color: 'success' },
          { title: 'En attente', value: all.filter(c => c.contentStatus === 'PENDING').length, icon: 'bx bx-time', color: 'warning' },
          { title: 'Rejetés', value: all.filter(c => c.contentStatus === 'REJECTED').length, icon: 'bx bx-block', color: 'danger' },
          { title: 'Brouillons', value: all.filter(c => c.contentStatus === 'DRAFT').length, icon: 'bx bx-edit', color: 'secondary' },
          { title: 'Payés', value: all.filter(c => c.contentStatus === 'PAID').length, icon: 'bx bx-money', color: 'info' },
        ];
      },
      error: (err) => {
        console.error('Erreur API:', err);
        Swal.fire('Error', 'Failed to load candidates.', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.pageIndex = 0;
    this.loadCandidates();
  }

  openCreateNewModal() {
    this.isEditMode = false;
    this.selectedCandidate = null;
    this.CandidateForm.reset({
      contentStatus: 'DRAFT'
    });
    this.modalRef = this.modalService.show(this.formModal);
  }

  edit(row: CandidateResponse) {
    this.isEditMode = true;
    this.selectedCandidate = row;
    const candidateData = {
      ...row,
      examCenterId: (row as any).examCenter?.id
    };
    this.CandidateForm.patchValue(candidateData);
    this.modalRef = this.modalService.show(this.formModal);
  }

  onSubmit() {
    if (this.CandidateForm.invalid) {
      Swal.fire('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }
    
    if (this.isEditMode) {
      this.updateCandidate();
    } else {
      this.createNewCandidate();
    }
  }

  createNewCandidate() {
    this.processing = true;
    
    const formValue = this.CandidateForm.value;
    const request: CandidateRequest = {
        ...formValue,
        examCenter: { id: formValue.examCenterId }
    };
    delete (request as any).examCenterId;
    
    this.candidateService.updateCandidate({ email: request.email!, body: request }).subscribe({
      next: () => {
        this.loadCandidates();
        this.processing = false;
        this.modalRef?.hide();
        Swal.fire('Succès', 'Candidat créé avec succès !', 'success');
      },
      error: (err) => {
        this.processing = false;
        Swal.fire('Erreur', `Échec de la création du candidat: ${err.error?.message || 'Erreur inconnue'}`, 'error');
      }
    });
  }

  updateCandidate() {
    if (this.CandidateForm.invalid || !this.selectedCandidate || !this.selectedCandidate.email) return;
    this.processing = true;

    const formValue = this.CandidateForm.value;
    const request: CandidateRequest = {
        ...formValue,
        examCenter: { id: formValue.examCenterId }
    };
    delete (request as any).examCenterId;

    this.candidateService.updateCandidate({ email: this.selectedCandidate.email!, body: request }).subscribe({
      next: () => {
        this.loadCandidates();
        this.processing = false;
        this.modalRef?.hide();
        Swal.fire('Succès', 'Candidat mis à jour avec succès !', 'success');
      },
      error: (err) => {
        this.processing = false;
        Swal.fire('Erreur', `Échec de la mise à jour: ${err.error?.message || 'Erreur inconnue'}`, 'error');
      }
    });
  }

  delete(row: CandidateResponse) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.candidateService.toggleCandidate({email: row.email!}).subscribe({
          next: () => {
            this.loadCandidates();
            Swal.fire({
              icon: 'success',
              title: 'Supprimé !',
              text: 'Le candidat a été supprimé.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Échec de la suppression du candidat',
              timer: 2500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  openStatusModal(candidate: CandidateResponse) {
    Swal.fire({
      title: 'Changer le statut du candidat',
      input: 'select',
      inputOptions: {
        
        
        VALIDATED: 'Validé',
        
        REJECTED: 'Rejeté',
        PENDING: 'En attente'
      },
      inputValue: candidate.contentStatus,
      showCancelButton: true,
      confirmButtonText: 'Changer',
      cancelButtonText: 'Annuler',
      inputValidator: (value) => {
        if (!value) {
          return 'Veuillez choisir un statut';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed && result.value && result.value !== candidate.contentStatus) {
        this.changeCandidateStatus(candidate, result.value);
      }
    });
  }

  changeCandidateStatus(
    candidate: CandidateResponse,
    newStatus: 'VALIDATED' | 'REJECTED' | 'PENDING' 
  ) {
    const update: CandidateRequest = { ...candidate, contentStatus: newStatus };
    this.candidateService.updateCandidate({ email: candidate.email!, body: update }).subscribe({
      next: () => {
        this.loadCandidates();
        Swal.fire('Succès', 'Statut du candidat mis à jour !', 'success');
      },
      error: (err) => {
        Swal.fire('Erreur', `Impossible de changer le statut: ${err.error?.message || 'Erreur inconnue'}`, 'error');
      }
    });
  }
}
