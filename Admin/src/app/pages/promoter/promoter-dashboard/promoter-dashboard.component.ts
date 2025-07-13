import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { PromoterService } from 'src/app/services/services/promoter.service';
import { TokenService } from 'src/app/services/token/token.service';
import { PromoterResponse } from 'src/app/services/models/promoter-response';

@Component({
  selector: 'app-promoter-dashboard',
  templateUrl: './promoter-dashboard.component.html',
  styleUrls: ['./promoter-dashboard.component.scss']
})
export class PromoterDashboardComponent implements OnInit {
  promoter: PromoterResponse | null = null;
  // Statistiques
  stats = [
    { title: 'Total candidats', value: 0, icon: 'bx bx-user', color: 'primary' },
    { title: 'Formations actives', value: 0, icon: 'bx bx-book', color: 'success' },
    { title: 'Demandes en attente', value: 0, icon: 'bx bx-time', color: 'warning' },
    { title: 'Certifications', value: 0, icon: 'bx bx-certification', color: 'info' }
  ];

  // Dernières activités
  recentActivities: any[] = [];

  // Graphique 1: Répartition des candidats
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['In Progress', 'Certified', 'Dropped Out', 'Pending'],
    datasets: [{
      data: [65, 42, 12, 5],
      backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384', '#FFCE56'],
    }]
  };
  public pieChartType: ChartType = 'pie';

  // Graphique 2: Inscriptions par mois
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { 
        data: [15, 22, 18, 25, 30, 28], 
        label: 'Registrations',
        backgroundColor: '#5b73e8'
      }
    ]
  };
  public barChartType: ChartType = 'bar';

  // Calendrier (prochaines dates importantes)
  upcomingEvents: any[] = [];

  constructor(
    private promoterService: PromoterService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const email = this.tokenService.getEmail();
    if (email) {
      this.promoterService.findStaffByEmail({ email }).subscribe({
        next: (data) => {
          this.promoter = data;
          // Ici, tu peux charger d'autres stats ou activités liées au promoteur
          // Par exemple, charger le nombre de candidats, formations, etc. via d'autres services
        }
      });
    }

    // Exemple statique pour les activités récentes et événements à venir
    this.recentActivities = [
      { title: 'Nouveau candidat inscrit', description: 'Jean Dupont a rejoint le programme', time: 'il y a 10 min', icon: 'bx bx-user-plus', color: 'success' },
      { title: 'Formation terminée', description: 'Batch #23 a terminé le cours Web', time: 'il y a 2h', icon: 'bx bx-check-circle', color: 'primary' }
    ];
    this.upcomingEvents = [
      { title: 'Examen de certification', date: '2025-07-15', type: 'exam' }
    ];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  }

  getEventIcon(type: string): string {
    switch(type) {
      case 'exam': return 'bx bx-test-tube';
      case 'training': return 'bx bx-book';
      case 'meeting': return 'bx bx-calendar-event';
      default: return 'bx bx-calendar';
    }
  }
}