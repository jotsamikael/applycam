import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/core/models/auth.models';
import { GetDivisionByRegion$Params } from 'src/app/services/fn/division/get-division-by-region';
import { CreateTainingCenterRequest, Division, TrainingCenterResponse } from 'src/app/services/models';
import { DivisionService, TrainingcenterService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-training-center-management',
  templateUrl: './training-center-management.component.html',
  styleUrls: ['./training-center-management.component.scss']
})
export class TrainingCenterManagementComponent {

  breadCrumbItems: Array<{}>;
  displayedColumns: string[] = [
    "fullName", "acronym", "agreementNumber",
    "centerPresentCandidateForCqp", "centerPresentCandidateForDqp", "division", "actions"
  ];
  dataSource: MatTableDataSource<TrainingCenterResponse>;
  errorMsg: Array<string> = [];
  regions: string[] = [
    'Center', 'Littoral', 'West', 'Adamawa', 'East',
    'South', 'North', 'North-West', 'South-West', 'Far-North'
  ];
  divisions: Division[] = [];

  user: User;
  trainingcenters: TrainingCenterResponse[];
  followUpStat = [
    { title: "Total Campus", value: "4", icon: "bx-building" },
    { title: "Total Candidates", value: "97", icon: "bxs-graduation" },
    { title: "Agreement Exp", value: "2025-05-26", icon: "bx-wind" }
  ];

  showAdvancedFilters = false;
  isEditMode = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  modalRef?: BsModalRef;
  processing: boolean = false;

  constructor(
    private tokenService: TokenService,
    private trainingcenterService: TrainingcenterService,
    private modalService: BsModalService,
    private divisionService: DivisionService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Promoter' }, { label: 'Training Centers', active: true }];
    this.getTrainingCentersOfLoggedInUser();
    this.CreateTrainingCenterForm.get('region')?.valueChanges.subscribe(selectedRegion => {
      if (selectedRegion) {
        const params: GetDivisionByRegion$Params = { region: selectedRegion };
        this.getDivisionsList(params);
      } else {
        this.divisions = [];
        this.CreateTrainingCenterForm.get('division')?.reset();
      }
    });
  }

  refreshTrainingCenters() {
    this.getTrainingCentersOfLoggedInUser();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  CreateTrainingCenterForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    acronym: new FormControl('', [Validators.required]),
    agreementNumber: new FormControl('', [Validators.required]),
    startDateOfAgreement: new FormControl('', [Validators.required]),
    endDateOfAgreement: new FormControl('', [Validators.required]),
    isCenterPresentCandidateForCqp: new FormControl('No'),
    isCenterPresentCandidateForDqp: new FormControl('No'),
    region: new FormControl('', [Validators.required]),
    division: new FormControl('', [Validators.required]),
    fullAddress: new FormControl('', [Validators.required])  // ✅ Ajouté
  });

  disableForm() {
    Object.keys(this.CreateTrainingCenterForm.controls).forEach(control => {
      this.CreateTrainingCenterForm.controls[control].disable();
    });
  }

  enableForm() {
    Object.keys(this.CreateTrainingCenterForm.controls).forEach(control => {
      this.CreateTrainingCenterForm.controls[control].enable();
    });
  }

  get f() {
    return this.CreateTrainingCenterForm.controls;
  }

  getDivisionsList(region: GetDivisionByRegion$Params) {
    this.divisionService.getDivisionByRegion(region).subscribe((divisions: Division[]) => {
      this.divisions = divisions;
      this.CreateTrainingCenterForm.get('division')?.reset();
    });
  }

  getTrainingCentersOfLoggedInUser() {
    this.trainingcenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.processing = false;
        this.errorMsg = err.error.validationErrors ?? [err.error.error];
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

  goToTrainingCenterDetails(trainingCenterItem: TrainingCenterResponse) {
    localStorage.setItem('trainingCenter', JSON.stringify(trainingCenterItem));
    this.router.navigate(['backend/training-center-details']);
  }

  openCreateNewModal(addNew: any) {
    this.isEditMode = false;
    this.CreateTrainingCenterForm.reset();
    this.modalRef = this.modalService.show(addNew, { class: 'modal-lg' });
  }

  createNewTrainingCenter() {
    const createNewTrainingCenterRequest: CreateTainingCenterRequest = {
      acronym: this.f['acronym'].value,
      agreementNumber: this.f['agreementNumber'].value,
      isCenterPresentCandidateForCqp: this.getTrueOrFalse(this.f['isCenterPresentCandidateForCqp'].value),
      isCenterPresentCandidateForDqp: this.getTrueOrFalse(this.f['isCenterPresentCandidateForDqp'].value),
      division: this.f['division'].value,
      endDateOfAgreement: this.f['endDateOfAgreement'].value,
      fullName: this.f['fullName'].value,
      startDateOfAgreement: this.f['startDateOfAgreement'].value,
      fullAddress: this.f['fullAddress'].value  // ✅ Inclus dans l'objet
    };

    console.log(createNewTrainingCenterRequest);

    // TODO: appel à l'API pour envoyer la requête
  }

  edit(row: TrainingCenterResponse) {
    this.isEditMode = true;
    // Pré-remplir le formulaire avec les données du centre sélectionné
    this.CreateTrainingCenterForm.patchValue({
      fullName: row.fullName,
      acronym: row.acronym,
      agreementNumber: row.agreementNumber,
      startDateOfAgreement: row.startDateOfAgreement,
      endDateOfAgreement: row.endDateOfAgreement,
      isCenterPresentCandidateForCqp: row.centerPresentCandidateForCqp ? 'Yes' : 'No',
      isCenterPresentCandidateForDqp: row.centerPresentCandidateForDqp ? 'Yes' : 'No',
      division: row.division
    });
    
    // Ouvrir le modal d'édition
    this.modalRef = this.modalService.show('addNew', { class: 'modal-lg' });
  }

  updateTrainingCenter() {
    if (this.CreateTrainingCenterForm.valid) {
      this.processing = true;
      
      const updateRequest = {
        fullName: this.f['fullName'].value,
        acronym: this.f['acronym'].value,
        agreementNumber: this.f['agreementNumber'].value,
        startDateOfAgreement: this.f['startDateOfAgreement'].value,
        endDateOfAgreement: this.f['endDateOfAgreement'].value,
        isCenterPresentCandidateForCqp: this.getTrueOrFalse(this.f['isCenterPresentCandidateForCqp'].value),
        isCenterPresentCandidateForDqp: this.getTrueOrFalse(this.f['isCenterPresentCandidateForDqp'].value),
        division: this.f['division'].value
      };

      // TODO: Appeler le service de mise à jour
      console.log('Mise à jour du centre:', updateRequest);
      
      // Simuler la mise à jour
      setTimeout(() => {
        this.processing = false;
        this.isEditMode = false;
        this.modalRef?.hide();
        this.getTrainingCentersOfLoggedInUser(); // Recharger la liste
        Swal.fire('Succès', 'Centre de formation mis à jour avec succès', 'success');
      }, 1000);
    }
  }

  getTrueOrFalse(value: string): boolean {
    return value === 'Yes';
  }

  exportData() {
    // TODO: Implémenter l'export des données
    console.log('Export des données demandé');
  }

  showDetails(row: TrainingCenterResponse) {
    const detailsHtml = `
      <div class="text-start">
        <div class="row">
          <div class="col-md-6">
            <p><strong>Nom complet :</strong> ${row.fullName || 'N/A'}</p>
            <p><strong>Acronyme :</strong> ${row.acronym || 'N/A'}</p>
            <p><strong>N° d'accord :</strong> ${row.agreementNumber || 'N/A'}</p>
            <p><strong>Division :</strong> ${row.division || 'N/A'}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Date début accord :</strong> ${row.startDateOfAgreement || 'N/A'}</p>
            <p><strong>Date fin accord :</strong> ${row.endDateOfAgreement || 'N/A'}</p>
            <p><strong>Présente CQP :</strong> ${row.centerPresentCandidateForCqp ? 'Oui' : 'Non'}</p>
            <p><strong>Présente DQP :</strong> ${row.centerPresentCandidateForDqp ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </div>
    `;
    Swal.fire({
      title: `Détails du centre de formation`,
      html: detailsHtml,
      width: '600px',
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3085d6',
      showCloseButton: true,
      customClass: { popup: 'swal-wide' }
    });
  }
}
