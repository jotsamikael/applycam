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
  displayedColumns: string[] = ["fullName","acronym","agreementNumber","centerPresentCandidateForCqp","centerPresentCandidateForDqp","division","actions"];
  dataSource: MatTableDataSource<TrainingCenterResponse>;
  errorMsg: Array<string> = [];
  regions: string[] = ['Center', 'Littoral', 'West', 'Adamawa', 'East','South','North','North-West','South-West','Far-North'];
  divisions: Division[] = []; // This will be updated dynamically


  user: User;
  trainingcenters: TrainingCenterResponse[];
  followUpStat = [
    {
      title:"Total Campus",
      value :"4",
      icon:"bx-building"
    },
    {
      title:"Total Candidates",
      value :"97",
      icon:"bxs-graduation"
    },
    {
      title:"Agreement Exp",
      value :"2025-05-26",
      icon:"bx-wind"
    }
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  modalRef?:BsModalRef;
  processing: boolean = false;

  constructor(
    private tokenService: TokenService,
    private trainingcenterService: TrainingcenterService,
    private modalService: BsModalService,
    private divisionService: DivisionService,
    private router: Router,
    public dialog: MatDialog
    
  ) {
   
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Promoter' }, { label: 'Training Centers', active: true }];
    this.getTrainingCentersOfLoggedInUser()
  
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

  /**
   * 
   * Get divisons based on region 
   */


  getDivisionsList(region: GetDivisionByRegion$Params) {
    console.log("selected region "+region.region)

    this.divisionService.getDivisionByRegion(region).subscribe((divisions: Division[]) => {
      this.divisions = divisions;
      console.log(divisions)

  
      // Optionally reset division control if needed
      this.CreateTrainingCenterForm.get('division')?.reset();
    });
  }
  
  


  ngAfterViewInit() { 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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


});


disableForm() {
  this.CreateTrainingCenterForm.controls['fullName'].disable();
  this.CreateTrainingCenterForm.controls['acronym'].disable();
  this.CreateTrainingCenterForm.controls['agreementNumber'].disable();
  this.CreateTrainingCenterForm.controls['startDateOfAgreement'].disable();
  this.CreateTrainingCenterForm.controls['endDateOfAgreement'].disable();
  this.CreateTrainingCenterForm.controls['division'].disable();
  this.CreateTrainingCenterForm.controls['isCenterPresentCandidateForCqp'].disable();
  this.CreateTrainingCenterForm.controls['isCenterPresentCandidateForDqp'].disable();

}


enableForm() {
  this.CreateTrainingCenterForm.controls['fullName'].enable();
  this.CreateTrainingCenterForm.controls['acronym'].enable();
  this.CreateTrainingCenterForm.controls['agreementNumber'].enable();
  this.CreateTrainingCenterForm.controls['startDateOfAgreement'].enable();
  this.CreateTrainingCenterForm.controls['endDateOfAgreement'].enable();
  this.CreateTrainingCenterForm.controls['division'].enable();
  this.CreateTrainingCenterForm.controls['isCenterPresentCandidateForCqp'].enable();
  this.CreateTrainingCenterForm.controls['isCenterPresentCandidateForDqp'].enable();

}


get f() {

  return this.CreateTrainingCenterForm.controls;

}


  getTrainingCentersOfLoggedInUser() {
    this.trainingcenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next:(res)=>{

      this.dataSource = new MatTableDataSource(res);
      console.log(this.dataSource)

      },
      error: (err)=>{
        //stop isprocessing

        this.processing = false;

        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
        //reset form
      }
    })
  }

 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  goToTrainingCenterDetails(trainingCenterItem:TrainingCenterResponse){
    console.log(trainingCenterItem)
    localStorage.setItem('trainingCenter',JSON.stringify(trainingCenterItem))
    this.router.navigate(['backend/training-center-details']);

  }

  openCreateNewModal(addNew: any) {
    this.modalRef = this.modalService.show(addNew,{class: 'modal-lg'})

    }

    createNewTrainingCenter(){
      const createNewTrainingCenterRequest: CreateTainingCenterRequest = {
        acronym: this.CreateTrainingCenterForm.controls['acronym'].value,
        agreementNumber: this.CreateTrainingCenterForm.controls['agreementNumber'].value,
        centerPresentCandidateForCqp: this.getTrueOrFalse(this.CreateTrainingCenterForm.controls['isCenterPresentCandidateForCqp'].value),
        centerPresentCandidateForDqp: this.getTrueOrFalse(this.CreateTrainingCenterForm.controls['isCenterPresentCandidateForDqp'].value),
        division: this.CreateTrainingCenterForm.controls['division'].value,
        endDateOfAgreement: this.CreateTrainingCenterForm.controls['endDateOfAgreement'].value,
        fullName: this.CreateTrainingCenterForm.controls['fullName'].value,
        startDateOfAgreement: this.CreateTrainingCenterForm.controls['startDateOfAgreement'].value
      }

      console.log(createNewTrainingCenterRequest)

      //submit to endpoint
    }



  getTrueOrFalse(value: string): boolean {
    if(value == 'Yes'){
      return true;

    }else{
      return false;
    }
  }

}
