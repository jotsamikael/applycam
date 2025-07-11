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

  getTrueOrFalse(value: string): boolean {
    return value === 'Yes';
  }
}
