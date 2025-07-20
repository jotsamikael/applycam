import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { PromoterService } from 'src/app/services/services/promoter.service';
import { TokenService } from 'src/app/services/token/token.service';
import { PromoterResponse } from 'src/app/services/models/promoter-response';
import { CandidateService } from 'src/app/services/services/candidate.service';
import { TrainingcenterService } from 'src/app/services/services/trainingcenter.service';
import { ApplicationService } from 'src/app/services/services/application.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-promoter-dashboard',
  templateUrl: './promoter-dashboard.component.html',
  styleUrls: ['./promoter-dashboard.component.scss']
})
export class PromoterDashboardComponent implements OnInit, AfterViewInit {
  promoter: PromoterResponse | null = null;
  loading = true;
  error = false;
  errorMessage = '';

  // Statistiques réelles
  stats = [
    { title: 'Total candidats', value: 0, icon: 'bx bx-user', color: 'primary', loading: true },
    { title: 'Centres de formation', value: 0, icon: 'bx bx-building', color: 'success', loading: true },
    { title: 'Candidatures en attente', value: 0, icon: 'bx bx-time', color: 'warning', loading: true },
    { title: 'Candidatures validées', value: 0, icon: 'bx bx-check-circle', color: 'info', loading: true }
  ];

  // Activités récentes
  recentActivities: any[] = [];
  loadingActivities = true;

  // Événements à venir
  upcomingEvents: any[] = [];
  loadingEvents = true;

  // Graphique 1: Répartition des candidats par statut
  @ViewChild('candidateChart') candidateChartRef!: ElementRef;
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Répartition des candidats par statut',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['En cours', 'Validés', 'En attente', 'Rejetés'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };
  public pieChartType: ChartType = 'pie';

  // Graphique 2: Inscriptions par mois
  @ViewChild('registrationChart') registrationChartRef!: ElementRef;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: 'Nombre d\'inscriptions'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Inscriptions par mois',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      { 
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        label: 'Inscriptions',
        backgroundColor: '#5b73e8',
        borderColor: '#4a5fd1',
        borderWidth: 1
      }
    ]
  };
  public barChartType: ChartType = 'bar';

  // Graphique 3: Performance des centres
  @ViewChild('performanceChart') performanceChartRef!: ElementRef;
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Centres de formation'
        }
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: 'Nombre de candidats'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Performance des centres de formation',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Candidats actifs',
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4
      },
      {
        data: [],
        label: 'Candidats validés',
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4
      }
    ]
  };
  public lineChartType: ChartType = 'line';

  // Filtres avancés
  showAdvancedFilters = false;
  filterStatus = '';
  filterCenter = '';
  centers: any[] = [];

  // Tableau principal
  dataSource = new MatTableDataSource<any>([]); // Utilise MatTableDataSource pour le filtrage
  displayedColumns: string[] = ['candidateName', 'email', 'center', 'status', 'actions'];

  // Pagination
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  // Ajout : stocker les candidats et centres pour les graphes
  allCandidates: any[] = [];
  allCenters: any[] = [];

  constructor(
    private promoterService: PromoterService,
    private tokenService: TokenService,
    private candidateService: CandidateService,
    private trainingCenterService: TrainingcenterService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadCenters();
    this.loadTableData();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Les graphiques seront initialisés après le chargement des données
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    const email = this.tokenService.getEmail();
    if (!email) {
      this.error = true;
      this.errorMessage = 'Email non trouvé dans le token';
      this.loading = false;
      return;
    }

    console.log('Chargement du dashboard pour:', email);
    
    // Diagnostic de l'authentification
    this.diagnoseAuthentication(email);

    // Charger les données du promoteur
    this.loadPromoterInfo(email);
    
    // Charger les statistiques
    this.loadStatistics();
    
    // Charger les activités récentes
    this.loadRecentActivities();
    
    // Charger les événements à venir
    this.loadUpcomingEvents();
  }

  diagnoseAuthentication(email: string): void {
    console.log('=== DIAGNOSTIC AUTHENTIFICATION ===');
    console.log('Email extrait du token:', email);
    console.log('Token complet:', this.tokenService.token);
    console.log('User info complète:', this.tokenService.getUserInfo());
    console.log('Roles:', this.tokenService.getRoles());
    console.log('Est authentifié:', this.tokenService.isAuthenticated());
    console.log('A le rôle PROMOTER:', this.tokenService.hasRole('PROMOTER'));
    console.log('====================================');
  }

  diagnoseToken(): void {
    console.log('=== DIAGNOSTIC TOKEN COMPLET ===');
    this.tokenService.diagnoseToken();
    console.log('=== FIN DIAGNOSTIC TOKEN ===');
  }

  loadPromoterInfo(email: string): void {
    console.log('Chargement des infos promoteur pour:', email);
    
    this.promoterService.findStaffByEmail({ email }).pipe(
      catchError((err) => {
        console.error('Erreur lors du chargement des infos promoteur:', err);
        console.error('Détails de l\'erreur:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.error = true;
        this.errorMessage = `Erreur lors du chargement des informations du promoteur: ${err.status} ${err.statusText}`;
        return of(null);
      }),
      finalize(() => {
        // Marquer le chargement comme terminé si c'est la dernière opération
        this.checkAllDataLoaded();
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.promoter = data;
          console.log('Infos promoteur chargées:', data);
        }
      }
    });
  }

  loadStatistics(): void {
    const currentYear = new Date().getFullYear();
    console.log('Chargement des statistiques pour l\'année:', currentYear);

    // Réinitialiser les listes
    this.allCandidates = [];
    this.allCenters = [];

    // Charger les candidats du promoteur
    this.candidateService.getCandidatesOfConnectedpromoterid({
      year: currentYear,
      offset: 0,
      pageSize: 1000
    }).pipe(
      catchError((err) => {
        console.error('Erreur lors du chargement des candidats:', err);
        this.stats[0].loading = false;
        this.stats[2].loading = false;
        this.stats[3].loading = false;
        this.error = true;
        this.errorMessage = `Erreur lors du chargement des candidats: ${err.status} ${err.statusText}`;
        return of({ content: [] });
      }),
      finalize(() => {
        this.checkAllDataLoaded();
      })
    ).subscribe({
      next: (response) => {
        const candidates = response?.content || [];
        this.allCandidates = candidates;
        console.log('Candidats chargés:', candidates.length);
        this.stats[0].value = candidates.length;
        this.stats[0].loading = false;
        // Calculer les statuts des candidatures
        const pendingCount = candidates.filter(c => c.contentStatus === 'PENDING').length;
        const validatedCount = candidates.filter(c => c.contentStatus === 'VALIDATED').length;
        this.stats[2].value = pendingCount;
        this.stats[2].loading = false;
        this.stats[3].value = validatedCount;
        this.stats[3].loading = false;
        // Mettre à jour le graphique camembert
        this.updatePieChart(candidates);
        // Mettre à jour le graphique des inscriptions
        this.updateRegistrationChart(candidates);
        // Si les centres sont déjà chargés, mettre à jour la performance
        if (this.allCenters.length > 0) {
          this.updatePerformanceChart(this.allCenters, this.allCandidates);
        }
      }
    });

    // Charger les centres de formation
    this.trainingCenterService.getTrainingCenterOfConnectedPromoter().pipe(
      catchError((err) => {
        console.error('Erreur lors du chargement des centres:', err);
        this.stats[1].loading = false;
        this.error = true;
        this.errorMessage = `Erreur lors du chargement des centres de formation: ${err.status} ${err.statusText}`;
        return of([]);
      }),
      finalize(() => {
        this.checkAllDataLoaded();
      })
    ).subscribe({
      next: (centers) => {
        this.allCenters = centers;
        console.log('Centres de formation chargés:', centers.length);
        this.stats[1].value = centers.length;
        this.stats[1].loading = false;
        // Mettre à jour le graphique de performance si les candidats sont déjà chargés
        if (this.allCandidates.length > 0) {
          this.updatePerformanceChart(this.allCenters, this.allCandidates);
        }
      }
    });
  }

  testApiCalls(year: number): void {
    console.log('=== TEST DES APPELS API ===');
    
    // Test 1: Vérifier le token
    const token = this.tokenService.token;
    console.log('Token présent:', !!token);
    
    // Test 2: Vérifier l'email
    const email = this.tokenService.getEmail();
    console.log('Email extrait:', email);
    
    // Test 3: Vérifier les rôles
    const roles = this.tokenService.getRoles();
    console.log('Rôles:', roles);
    
    // Test 4: Vérifier l'authentification
    const isAuth = this.tokenService.isAuthenticated();
    console.log('Authentifié:', isAuth);
    
    console.log('============================');
  }

  testAllApis(): void {
    console.log('=== TEST COMPLET DES APIS ===');
    
    // Diagnostic complet du token
    console.log('🔍 Diagnostic du token...');
    const token = this.tokenService.token;
    console.log('Token brut:', token);
    console.log('Token présent:', !!token);
    
    if (token) {
      try {
        const tokenParts = token.split('.');
        console.log('Nombre de parties du token:', tokenParts.length);
        
        if (tokenParts.length >= 2) {
          const payload = tokenParts[1];
          console.log('Payload encodé:', payload);
          
          try {
            const decodedPayload = JSON.parse(atob(payload));
            console.log('Payload décodé:', decodedPayload);
            console.log('Clés disponibles:', Object.keys(decodedPayload));
            
            // Vérifier les différentes clés possibles pour l'email
            const possibleEmailKeys = ['email', 'sub', 'username', 'user_email'];
            for (const key of possibleEmailKeys) {
              if (decodedPayload[key]) {
                console.log(`✅ Email trouvé avec la clé '${key}':`, decodedPayload[key]);
              }
            }
            
            // Vérifier les rôles
            const possibleRoleKeys = ['authorities', 'roles', 'role', 'user_roles'];
            for (const key of possibleRoleKeys) {
              if (decodedPayload[key]) {
                console.log(`✅ Rôles trouvés avec la clé '${key}':`, decodedPayload[key]);
              }
            }
            
          } catch (decodeError) {
            console.error('❌ Erreur lors du décodage du payload:', decodeError);
          }
        } else {
          console.error('❌ Token malformé - pas assez de parties');
        }
      } catch (tokenError) {
        console.error('❌ Erreur lors de l\'analyse du token:', tokenError);
      }
    }
    
    const email = this.tokenService.getEmail();
    console.log('Email extrait par le service:', email);
    
    if (!email) {
      console.error('❌ Email non trouvé dans le token');
      console.log('💡 Suggestions:');
      console.log('   - Vérifiez que vous êtes bien connecté');
      console.log('   - Essayez de vous déconnecter et reconnecter');
      console.log('   - Vérifiez que le token contient bien l\'email');
      return;
    }
    
    console.log('✅ Email trouvé:', email);
    const year = new Date().getFullYear();
    console.log('✅ Année:', year);
    
    // Test 1: API Promoteur
    console.log('🔍 Test API Promoteur...');
    this.promoterService.findStaffByEmail({ email }).subscribe({
      next: (data) => {
        console.log('✅ API Promoteur OK:', data);
      },
      error: (err) => {
        console.error('❌ API Promoteur ERREUR:', err);
        console.error('Status:', err.status, err.statusText);
        console.error('Message:', err.message);
        console.error('Error:', err.error);
      }
    });
    
    // Test 2: API Candidats
    console.log('🔍 Test API Candidats...');
    this.candidateService.getCandidatesOfConnectedpromoterid({
      year: year,
      offset: 0,
      pageSize: 10
    }).subscribe({
      next: (data) => {
        console.log('✅ API Candidats OK:', data);
      },
      error: (err) => {
        console.error('❌ API Candidats ERREUR:', err);
        console.error('Status:', err.status, err.statusText);
        console.error('Message:', err.message);
        console.error('Error:', err.error);
      }
    });
    
    // Test 3: API Centres de formation
    console.log('🔍 Test API Centres de formation...');
    this.trainingCenterService.getTrainingCenterOfConnectedPromoter().subscribe({
      next: (data) => {
        console.log('✅ API Centres OK:', data);
      },
      error: (err) => {
        console.error('❌ API Centres ERREUR:', err);
        console.error('Status:', err.status, err.statusText);
        console.error('Message:', err.message);
        console.error('Error:', err.error);
      }
    });
    
    console.log('=== FIN DES TESTS ===');
  }

  // Correction : utiliser les vrais candidats pour le camembert
  updatePieChart(candidates: any[]): void {
    try {
      const statusCounts = {
        'En cours': candidates.filter(c => c.contentStatus === 'DRAFT').length,
        'Validés': candidates.filter(c => c.contentStatus === 'VALIDATED').length,
        'En attente': candidates.filter(c => c.contentStatus === 'PENDING').length,
        'Rejetés': candidates.filter(c => c.contentStatus === 'REJECTED').length
      };
      this.pieChartData = {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      };
      console.log('Graphique camembert mis à jour:', statusCounts);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du graphique camembert:', error);
    }
  }

  // Correction : utiliser les vrais candidats pour le graphique barres
  updateRegistrationChart(candidates: any[]): void {
    try {
      const monthlyData = new Array(12).fill(0);
      candidates.forEach(candidate => {
        if (candidate.createdDate) {
          try {
            const date = new Date(candidate.createdDate);
            if (!isNaN(date.getTime())) {
              const month = date.getMonth();
              monthlyData[month]++;
            }
          } catch (dateError) {
            console.warn('Date invalide pour le candidat:', candidate.createdDate);
          }
        }
      });
      this.barChartData = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          data: monthlyData,
          label: 'Inscriptions',
          backgroundColor: '#5b73e8',
          borderColor: '#4a5fd1',
          borderWidth: 1
        }]
      };
      console.log('Graphique des inscriptions mis à jour:', monthlyData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du graphique des inscriptions:', error);
    }
  }

  // Correction : utiliser les vrais candidats et centres pour le graphique de performance
  updatePerformanceChart(centers: any[], candidates: any[]): void {
    try {
      const centerNames = centers.map(c => c.acronym || c.fullName || 'Centre inconnu');
      // On suppose que chaque candidat a un champ centerId ou centerName qui correspond à un centre
      const activeCandidates = centers.map(center =>
        candidates.filter(c => (c.centerId === center.id || c.centerName === center.fullName || c.centerName === center.acronym) && c.contentStatus === 'DRAFT').length
      );
      const validatedCandidates = centers.map(center =>
        candidates.filter(c => (c.centerId === center.id || c.centerName === center.fullName || c.centerName === center.acronym) && c.contentStatus === 'VALIDATED').length
      );
      this.lineChartData = {
        labels: centerNames,
        datasets: [
          {
            data: activeCandidates,
            label: 'Candidats actifs',
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.4
          },
          {
            data: validatedCandidates,
            label: 'Candidats validés',
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4
          }
        ]
      };
      console.log('Graphique de performance mis à jour:', centerNames);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du graphique de performance:', error);
    }
  }

  loadRecentActivities(): void {
    this.loadingActivities = true;
    console.log('Chargement des activités récentes');
    
    // Simuler des activités récentes basées sur les données réelles
    setTimeout(() => {
      try {
        this.recentActivities = [
          { 
            title: 'Nouveau candidat inscrit', 
            description: 'Un nouveau candidat a rejoint le programme de formation', 
            time: 'il y a 10 min', 
            icon: 'bx bx-user-plus', 
            color: 'success',
            timestamp: new Date(Date.now() - 10 * 60 * 1000)
          },
          { 
            title: 'Candidature validée', 
            description: 'La candidature de Jean Dupont a été approuvée', 
            time: 'il y a 2h', 
            icon: 'bx bx-check-circle', 
            color: 'primary',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          { 
            title: 'Nouveau centre créé', 
            description: 'Le centre de formation "Tech Academy" a été créé', 
            time: 'il y a 1 jour', 
            icon: 'bx bx-building', 
            color: 'info',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          { 
            title: 'Examen programmé', 
            description: 'L\'examen de certification Web Development est programmé', 
            time: 'il y a 2 jours', 
            icon: 'bx bx-calendar-event', 
            color: 'warning',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ];
        this.loadingActivities = false;
        console.log('Activités récentes chargées:', this.recentActivities.length);
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        this.loadingActivities = false;
        this.recentActivities = [];
      }
      this.checkAllDataLoaded();
    }, 1000);
  }

  loadUpcomingEvents(): void {
    this.loadingEvents = true;
    console.log('Chargement des événements à venir');
    
    // Simuler des événements à venir
    setTimeout(() => {
      try {
        this.upcomingEvents = [
          { 
            title: 'Examen de certification Web Development', 
            date: '2025-07-20', 
            type: 'exam',
            description: 'Examen final pour la certification en développement web'
          },
          { 
            title: 'Réunion des promoteurs', 
            date: '2025-07-25', 
            type: 'meeting',
            description: 'Réunion mensuelle des promoteurs de centres de formation'
          },
          { 
            title: 'Formation des formateurs', 
            date: '2025-08-01', 
            type: 'training',
            description: 'Session de formation pour les nouveaux formateurs'
          },
          { 
            title: 'Clôture des inscriptions', 
            date: '2025-08-15', 
            type: 'deadline',
            description: 'Date limite pour les inscriptions de la session Septembre'
          }
        ];
        this.loadingEvents = false;
        console.log('Événements à venir chargés:', this.upcomingEvents.length);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        this.loadingEvents = false;
        this.upcomingEvents = [];
      }
      this.checkAllDataLoaded();
    }, 1000);
  }

  checkAllDataLoaded(): void {
    // Vérifier si toutes les données sont chargées
    const allStatsLoaded = this.stats.every(stat => !stat.loading);
    const activitiesLoaded = !this.loadingActivities;
    const eventsLoaded = !this.loadingEvents;
    
    if (allStatsLoaded && activitiesLoaded && eventsLoaded) {
      this.loading = false;
      console.log('Toutes les données du dashboard sont chargées');
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Date invalide';
    }
  }

  getEventIcon(type: string): string {
    switch(type) {
      case 'exam': return 'bx bx-test-tube';
      case 'training': return 'bx bx-book';
      case 'meeting': return 'bx bx-calendar-event';
      case 'deadline': return 'bx bx-time';
      default: return 'bx bx-calendar';
    }
  }

  getEventColor(type: string): string {
    switch(type) {
      case 'exam': return 'danger';
      case 'training': return 'primary';
      case 'meeting': return 'info';
      case 'deadline': return 'warning';
      default: return 'secondary';
    }
  }

  refreshDashboard(): void {
    console.log('Actualisation du dashboard');
    this.loadDashboardData();
  }

  getTimeAgo(timestamp: Date): string {
    try {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (days > 0) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
      if (hours > 0) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
      if (minutes > 0) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
      return 'à l\'instant';
    } catch (error) {
      console.error('Erreur lors du calcul du temps écoulé:', error);
      return 'Temps inconnu';
    }
  }

  // Chargement des centres (à adapter selon ton service)
  loadCenters() {
    // Exemple statique, à remplacer par un appel à ton service
    this.centers = [
      { id: 1, fullName: 'Centre Alpha' },
      { id: 2, fullName: 'Centre Beta' }
    ];
  }

  // Chargement des données du tableau (à adapter selon ton service)
  loadTableData() {
    // Exemple statique, à remplacer par un appel à ton service
    const data = [
      { candidateName: 'Jean Dupont', email: 'jean@exemple.com', centerName: 'Centre Alpha', status: 'VALIDATED' },
      { candidateName: 'Marie Curie', email: 'marie@exemple.com', centerName: 'Centre Beta', status: 'PENDING' }
    ];
    this.dataSource.data = data;
    this.totalElements = data.length;
  }

  // Recherche dans le tableau
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Pagination
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTableData();
  }

  // Filtres avancés
  applyAdvancedFilters() {
    this.pageIndex = 0;
    this.loadTableData();
  }
  clearFilters() {
    this.filterStatus = '';
    this.filterCenter = '';
    this.applyAdvancedFilters();
  }

  // Actions du tableau (à adapter selon tes besoins)
  showDetails(row: any) {
    // Affiche les détails du candidat/centre
    alert('Détails: ' + JSON.stringify(row));
  }
  edit(row: any) {
    // Ouvre le formulaire d'édition
    alert('Édition: ' + JSON.stringify(row));
  }
  validate(row: any) {
    // Valide la candidature
    alert('Validation: ' + JSON.stringify(row));
  }
  reject(row: any) {
    // Rejette la candidature
    alert('Rejet: ' + JSON.stringify(row));
  }
}