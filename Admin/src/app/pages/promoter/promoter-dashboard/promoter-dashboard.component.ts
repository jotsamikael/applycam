import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-promoter-dashboard',
  templateUrl: './promoter-dashboard.component.html',
  styleUrls: ['./promoter-dashboard.component.scss']
})
export class PromoterDashboardComponent implements OnInit {
  // Statistiques
  stats = [
    { title: 'Total Candidates', value: 124, icon: 'bx bx-user', color: 'primary' },
    { title: 'Active Trainings', value: 8, icon: 'bx bx-book', color: 'success' },
    { title: 'Pending Approvals', value: 5, icon: 'bx bx-time', color: 'warning' },
    { title: 'Certifications', value: 42, icon: 'bx bx-certification', color: 'info' }
  ];

  // Dernières activités
  recentActivities = [
    { 
      title: 'New candidate registered', 
      description: 'Jean Dupont joined the program',
      time: '10 min ago',
      icon: 'bx bx-user-plus',
      color: 'success'
    },
    { 
      title: 'Training completed', 
      description: 'Batch #23 finished Web Development course',
      time: '2 hours ago',
      icon: 'bx bx-check-circle',
      color: 'primary'
    },
    { 
      title: 'Payment received', 
      description: 'Payment for certification fees',
      time: '1 day ago',
      icon: 'bx bx-dollar',
      color: 'info'
    },
    { 
      title: 'New training scheduled', 
      description: 'Mobile Development starts next week',
      time: '2 days ago',
      icon: 'bx bx-calendar',
      color: 'warning'
    }
  ];

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
  upcomingEvents = [
    { title: 'Certification Exam', date: '2023-07-15', type: 'exam' },
    { title: 'New Batch Start', date: '2023-07-20', type: 'training' },
    { title: 'Progress Review', date: '2023-07-25', type: 'meeting' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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