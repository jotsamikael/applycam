import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TrainingCenterResponse, Campus } from 'src/app/services/models';

@Component({
  selector: 'app-training-center-details',
  templateUrl: './training-center-details.component.html',
  styleUrls: ['./training-center-details.component.scss']
})
export class TrainingCenterDetailsComponent implements OnInit {
  displayedColumnsCampus: string[] = ['name', 'capacity', 'town', 'actions'];
  dataSourceCampus: MatTableDataSource<Campus>;

  @ViewChild(MatPaginator) paginatorCampus: MatPaginator;
  @ViewChild(MatSort) sortCampus: MatSort;

  displayedColumnsSpeciality: string[] = ['name', 'code', 'description', 'actions'];
  dataSourceSpeciality: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginatorSpeciality: MatPaginator;
  @ViewChild(MatSort) sortSpeciality: MatSort;

  singleTrainingCenterStat = [
    {
      title: "Nombre de campus",
      value: "0",
      icon: "bx-building"
    },
    {
      title: "Spécialités offertes",
      value: "0",
      icon: "bxs-graduation"
    },
    {
      title: "Fin d'agrément",
      value: "",
      icon: "bx-calendar"
    }
  ];

  trainingCenter: TrainingCenterResponse;

  constructor(private router: Router) {
    this.dataSourceCampus = new MatTableDataSource();
    this.dataSourceSpeciality = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getTrainingCenterItemFromLocalStorage();
  }

  getTrainingCenterItemFromLocalStorage() {
    this.trainingCenter = JSON.parse(localStorage.getItem('trainingCenter'));
    
    if (this.trainingCenter) {
      // Mettre à jour les stats
      this.singleTrainingCenterStat[0].value = this.trainingCenter.campusList?.length.toString() || "0";
      this.singleTrainingCenterStat[1].value = this.trainingCenter.offersSpecialityList?.length.toString() || "0";
      this.singleTrainingCenterStat[2].value = this.trainingCenter.endDateOfAgreement || "Non défini";

      // Initialiser les données des campus
      if (this.trainingCenter.campusList) {
        this.dataSourceCampus = new MatTableDataSource(this.trainingCenter.campusList);
        this.dataSourceCampus.paginator = this.paginatorCampus;
        this.dataSourceCampus.sort = this.sortCampus;
      }

      // Initialiser les données des spécialités (si disponible)
      if (this.trainingCenter.offersSpecialityList) {
        this.dataSourceSpeciality = new MatTableDataSource(this.trainingCenter.offersSpecialityList);
        this.dataSourceSpeciality.paginator = this.paginatorSpeciality;
        this.dataSourceSpeciality.sort = this.sortSpeciality;
      }
    }
  }

  openCreateNewModalCampus(template: any) {
    // Implémentez la logique pour ouvrir le modal de création de campus
  }

  gotoMyTrainingCenter() {
    this.router.navigate(['backend/training-center-management']);
  }

  ngAfterViewInit() {
    if (this.dataSourceCampus) {
      this.dataSourceCampus.paginator = this.paginatorCampus;
      this.dataSourceCampus.sort = this.sortCampus;
    }

    if (this.dataSourceSpeciality) {
      this.dataSourceSpeciality.paginator = this.paginatorSpeciality;
      this.dataSourceSpeciality.sort = this.sortSpeciality;
    }
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