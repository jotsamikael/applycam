import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/app/services/services/candidate.service';
import { TrainingcenterService } from 'src/app/services/services/trainingcenter.service';
import { ExamCenterControllerService } from 'src/app/services/services/exam-center-controller.service';
import { SessionService } from 'src/app/services/services/session.service';
import { ApplicationService } from 'src/app/services/services/application.service';
import { PaymentService } from 'src/app/services/services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview-staff',
  templateUrl: './overview-staff.component.html',
  styleUrls: ['./overview-staff.component.scss']
})
export class OverviewStaffComponent implements OnInit {
  totalCandidates = 0;
  totalTrainingCenters = 0;
  totalExamCenters = 0;
  totalSessions = 0;
  totalApplications = 0;
  totalPayments = 0;

  pendingApplications = 0;
  upcomingSessions = 0;
  anomalousPayments = 0;

  // Pour les graphiques (exemples)
  applicationsByMonth: { month: string, count: number }[] = [];
  candidatesByRegion: { region: string, count: number }[] = [];
  examCentersByRegion: { region: string, count: number }[] = [];
  applicationStatusStats: { status: string, count: number }[] = [];

  loading = true;
  showAdvancedFilters: boolean = false;

  constructor(
    private candidateService: CandidateService,
    private trainingcenterService: TrainingcenterService,
    private examCenterService: ExamCenterControllerService,
    private sessionService: SessionService,
    private applicationService: ApplicationService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    // Nombre total de candidats
    this.candidateService.getAllCandidates({ offset: 0, pageSize: 1 }).subscribe(res => {
      this.totalCandidates = res.totalElements || 0;
    });
    // Nombre total de centres de formation
    this.trainingcenterService.getAllTrainingCenters({ offset: 0, pageSize: 1 }).subscribe(res => {
      this.totalTrainingCenters = res.totalElements || 0;
    });
    // Nombre total de centres d'examen
    this.examCenterService.getAllExamCenters({ offset: 0, pageSize: 1 }).subscribe(res => {
      this.totalExamCenters = res.totalElements || 0;
    });
    // Nombre total de sessions
    this.sessionService.getall({ offset: 0, pageSize: 1 }).subscribe(res => {
      this.totalSessions = res.totalElements || 0;
    });
    // Nombre total de candidatures
    this.applicationService.getAllApplications({ offset: 0, pageSize: 1 }).subscribe(res => {
      this.totalApplications = res.totalElements || 0;
    });
    // Nombre total de paiements
    this.paymentService.getAllPayments({ offset: 0, pageSize: 1 }).subscribe(res => {
      this.totalPayments = res.totalElements || 0;
    });
    // Alertes et widgets
    this.loadPendingApplications();
    this.loadUpcomingSessions();
    this.loadAnomalousPayments();
    // Graphiques
    this.loadApplicationsByMonth();
    this.loadCandidatesByRegion();
    this.loadExamCentersByRegion();
    this.loadApplicationStatusStats();
    this.loading = false;
  }

  loadPendingApplications() {
    // À adapter selon l'API : ici on suppose qu'on peut filtrer par statut
    this.applicationService.getAllApplications({ offset: 0, pageSize: 1, field: 'status', order: true }).subscribe(res => {
      this.pendingApplications = (res.content || []).filter(app => app.status === 'PENDING').length;
    });
  }

  loadUpcomingSessions() {
    // À adapter selon l'API : ici on suppose qu'on peut filtrer par date
    this.sessionService.getall({ offset: 0, pageSize: 100 }).subscribe(res => {
      const now = new Date();
      this.upcomingSessions = (res.content || []).filter(session => new Date(session.examDate) > now).length;
    });
  }

  loadAnomalousPayments() {
    // Il n'y a pas de champ 'status' dans PaymentResponse, donc on ne peut pas détecter les anomalies ici
    this.anomalousPayments = 0;
  }

  loadApplicationsByMonth() {
    // Utilisation de 'examDate' pour l'évolution par mois
    this.applicationService.getAllApplications({ offset: 0, pageSize: 1000 }).subscribe(res => {
      const byMonth: { [key: string]: number } = {};
      (res.content || []).forEach(app => {
        const date = app.examDate ? new Date(app.examDate) : null;
        if (date) {
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          byMonth[key] = (byMonth[key] || 0) + 1;
        }
      });
      this.applicationsByMonth = Object.entries(byMonth).map(([month, count]) => ({ month, count }));
    });
  }

  loadCandidatesByRegion() {
    // Utilisation de 'townOfResidence' comme proxy pour la région
    this.candidateService.getAllCandidates({ offset: 0, pageSize: 1000 }).subscribe(res => {
      const byRegion: { [key: string]: number } = {};
      (res.content || []).forEach(candidate => {
        const region = candidate.townOfResidence || 'Inconnu';
        byRegion[region] = (byRegion[region] || 0) + 1;
      });
      this.candidatesByRegion = Object.entries(byRegion).map(([region, count]) => ({ region, count }));
    });
  }

  loadExamCentersByRegion() {
    // À adapter selon l'API : ici on suppose que chaque centre d'examen a une propriété 'region'
    this.examCenterService.getAllExamCenters({ offset: 0, pageSize: 1000 }).subscribe(res => {
      const byRegion: { [key: string]: number } = {};
      (res.content || []).forEach(center => {
        const region = center.region || 'Inconnu';
        byRegion[region] = (byRegion[region] || 0) + 1;
      });
      this.examCentersByRegion = Object.entries(byRegion).map(([region, count]) => ({ region, count }));
    });
  }

  loadApplicationStatusStats() {
    // À adapter selon l'API : ici on suppose que chaque candidature a un statut
    this.applicationService.getAllApplications({ offset: 0, pageSize: 1000 }).subscribe(res => {
      const byStatus: { [key: string]: number } = {};
      (res.content || []).forEach(app => {
        const status = app.status || 'Inconnu';
        byStatus[status] = (byStatus[status] || 0) + 1;
      });
      this.applicationStatusStats = Object.entries(byStatus).map(([status, count]) => ({ status, count }));
    });
  }

  // Accès rapide
  goTo(route: string) {
    this.router.navigate([route]);
  }
}
