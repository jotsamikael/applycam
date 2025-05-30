import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TrainingCenterResponse } from 'src/app/services/models';

@Component({
  selector: 'app-training-center-details',
  templateUrl: './training-center-details.component.html',
  styleUrls: ['./training-center-details.component.scss']
})
export class TrainingCenterDetailsComponent {
  displayedColumnsCampus: string[] = ['name', 'capacity', 'town', 'actions'];
  dataSourceCampus: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginatorCampus: MatPaginator;
  @ViewChild(MatSort) sortCampus: MatSort;

  displayedColumnsSpeciality: string[] = ['name', 'code', 'description', 'actions'];
  dataSourceSpeciality: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginatorSpeciality: MatPaginator;
  @ViewChild(MatSort) sortSpeciality: MatSort;


  singleTrainingCenterStat = [
    {
      title:"Total activities",
      value :"13",
      icon:"bx-user-plus"
    },
    {
      title:"Total meetings",
      value :"2",
      icon:"bxs-hot"
    },
    {
      title:"Interactions/mo",
      value :"4",
      icon:"bx-wind"
    }
  ]


  trainingCenter:TrainingCenterResponse
  constructor(private router: Router){

  }

  ngOnInit(): void {
    //get followup form localstorage
    this.getTrainingCenterItemFromLocalStrotage()
  }


  getTrainingCenterItemFromLocalStrotage(){
    this.trainingCenter = JSON.parse(localStorage.getItem('trainingCenter'))
    console.log(this.trainingCenter)
  }


  openCreateNewModalCampus(_t23: any) {
    throw new Error('Method not implemented.');
    }


    gotoMyTrainingCenter() {
    this.router.navigate(['backend/training-center-management'])
    }

    ngAfterViewInit() {
      this.dataSourceCampus.paginator = this.paginatorCampus;
      this.dataSourceCampus.sort = this.sortCampus;

      this.dataSourceSpeciality.paginator = this.paginatorSpeciality;
      this.dataSourceSpeciality.sort = this.sortSpeciality;
    }
  
    applyFilterCampus(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceCampus.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceCampus.paginator) {
        this.dataSourceCampus.paginator.firstPage();
      }
    }

    applyFilterSpecialty(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceSpeciality.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceSpeciality.paginator) {
        this.dataSourceSpeciality.paginator.firstPage();
      }
    }
  

}
