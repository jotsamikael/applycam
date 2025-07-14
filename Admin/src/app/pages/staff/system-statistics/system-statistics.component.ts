import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/app/services/services/candidate.service';
import { TrainingcenterService } from 'src/app/services/services/trainingcenter.service';
import { ExamCenterControllerService } from 'src/app/services/services/exam-center-controller.service';
import { SessionService } from 'src/app/services/services/session.service';
import { ApplicationService } from 'src/app/services/services/application.service';
import { PaymentService } from 'src/app/services/services/payment.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-system-statistics',
  templateUrl: './system-statistics.component.html',
  styleUrls: ['./system-statistics.component.scss']
})
export class SystemStatisticsComponent implements OnInit {
  // Totaux
  totalCandidates = 0;
  totalTrainingCenters = 0;
  totalExamCenters = 0;
  totalSessions = 0;
  totalApplications = 0;
  totalPayments = 0;

  // Datasets pour graphiques
  applicationsByMonthLabels: string[] = [];
  applicationsByMonthData: number[] = [];
  candidatesByRegionLabels: string[] = [];
  candidatesByRegionData: number[] = [];
  examCentersByRegionLabels: string[] = [];
  examCentersByRegionData: number[] = [];
  applicationStatusLabels: string[] = [];
  applicationStatusData: number[] = [];

  // Chart.js configs
  lineChartConfig: ChartConfiguration<'line'>;
  doughnutChartConfigCandidates: ChartConfiguration<'doughnut'>;
  doughnutChartConfigCenters: ChartConfiguration<'doughnut'>;
  barChartConfigStatus: ChartConfiguration<'bar'>;

  loading = true;

  // Ajout : méthode pour rafraîchir les stats
  refreshStats() {
    if (!this.loading) {
      this.loadStats();
    }
  }

  constructor(
    private candidateService: CandidateService,
    private trainingcenterService: TrainingcenterService,
    private examCenterService: ExamCenterControllerService,
    private sessionService: SessionService,
    private applicationService: ApplicationService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    // Charger les totaux
    forkJoin([
      this.candidateService.getAllCandidates({ offset: 0, pageSize: 1 }),
      this.trainingcenterService.getAllTrainingCenters({ offset: 0, pageSize: 1 }),
      this.examCenterService.getAllExamCenters({ offset: 0, pageSize: 1 }),
      this.sessionService.getall({ offset: 0, pageSize: 10 }),
      this.applicationService.getAllApplications({ offset: 0, pageSize: 1 }),
      this.paymentService.getAllPayments({ offset: 0, pageSize: 1 })
    ]).subscribe(([candidates, centers, exams, sessions, applications, payments]) => {
      console.log('CANDIDATES', candidates);
      this.totalCandidates = candidates.totalElements || 0;
      this.totalTrainingCenters = centers.totalElements || 0;
      this.totalExamCenters = exams.totalElements || 0;
      this.totalSessions = sessions.totalElements || 0;
      this.totalApplications = applications.totalElements || 0;
      this.totalPayments = payments.totalElements || 0;

      // Charger les graphiques en parallèle
      forkJoin([
        this.loadApplicationsByMonth$(),
        this.loadCandidatesByRegion$(),
        this.loadExamCentersByRegion$(),
        this.loadApplicationStatusStats$()
      ]).subscribe(() => {
        this.loading = false;
      });
    });
  }

  loadApplicationsByMonth$(): Observable<void> {
    return this.applicationService.getAllApplications({ offset: 0, pageSize: 1000 }).pipe(
      map(res => {
        console.log('Réponse applications par mois:', res);
        const byMonth: { [key: string]: number } = {};
        (res.content || []).forEach(app => {
          const date = app.examDate ? new Date(app.examDate) : null;
          if (date) {
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            byMonth[key] = (byMonth[key] || 0) + 1;
          }
        });
        this.applicationsByMonthLabels = Object.keys(byMonth);
        this.applicationsByMonthData = Object.values(byMonth);
        this.lineChartConfig = {
          type: 'line',
          data: {
            labels: this.applicationsByMonthLabels,
            datasets: [
              {
                data: this.applicationsByMonthData,
                label: 'Candidatures',
                fill: true,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0,123,255,0.2)',
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        };
      })
    );
  }

  loadCandidatesByRegion$(): Observable<void> {
    return this.candidateService.getAllCandidates({ offset: 0, pageSize: 1000 }).pipe(
      map(res => {
        console.log('Réponse candidats par région:', res);
        const byRegion: { [key: string]: number } = {};
        (res.content || []).forEach(candidate => {
          const region = candidate.townOfResidence || 'Inconnu';
          byRegion[region] = (byRegion[region] || 0) + 1;
        });
        this.candidatesByRegionLabels = Object.keys(byRegion);
        this.candidatesByRegionData = Object.values(byRegion);
        this.doughnutChartConfigCandidates = {
          type: 'doughnut',
          data: {
            labels: this.candidatesByRegionLabels,
            datasets: [
              {
                data: this.candidatesByRegionData,
                backgroundColor: [
                  '#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8', '#6610f2', '#fd7e14', '#20c997', '#e83e8c'
                ]
              }
            ]
          },
          options: { responsive: true }
        };
      })
    );
  }

  loadExamCentersByRegion$(): Observable<void> {
    return this.examCenterService.getAllExamCenters({ offset: 0, pageSize: 1000 }).pipe(
      map(res => {
        console.log('Réponse centres d\'examen par région:', res);
        const byRegion: { [key: string]: number } = {};
        (res.content || []).forEach(center => {
          const region = center.region || 'Inconnu';
          byRegion[region] = (byRegion[region] || 0) + 1;
        });
        this.examCentersByRegionLabels = Object.keys(byRegion);
        this.examCentersByRegionData = Object.values(byRegion);
        this.doughnutChartConfigCenters = {
          type: 'doughnut',
          data: {
            labels: this.examCentersByRegionLabels,
            datasets: [
              {
                data: this.examCentersByRegionData,
                backgroundColor: [
                  '#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8', '#6610f2', '#fd7e14', '#20c997', '#e83e8c'
                ]
              }
            ]
          },
          options: { responsive: true }
        };
      })
    );
  }

  loadApplicationStatusStats$(): Observable<void> {
    return this.applicationService.getAllApplications({ offset: 0, pageSize: 1000 }).pipe(
      map(res => {
        console.log('Réponse statut des candidatures:', res);
        const byStatus: { [key: string]: number } = {};
        (res.content || []).forEach(app => {
          const status = app.status || 'Inconnu';
          byStatus[status] = (byStatus[status] || 0) + 1;
        });
        this.applicationStatusLabels = Object.keys(byStatus);
        this.applicationStatusData = Object.values(byStatus);
        this.barChartConfigStatus = {
          type: 'bar',
          data: {
            labels: this.applicationStatusLabels,
            datasets: [
              {
                data: this.applicationStatusData,
                label: 'Candidatures',
                backgroundColor: '#007bff'
              }
            ]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        };
      })
    );
  }
}
