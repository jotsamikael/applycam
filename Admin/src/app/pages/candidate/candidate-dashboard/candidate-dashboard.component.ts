import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.scss']
})
export class CandidateDashboardComponent implements OnInit {
  candidateStats = [
    { title: "Statut du dossier", value: "En attente", icon: "bx-file" },
    { title: "Centre d'examen", value: "Non affecté", icon: "bx-building" },
    { title: "Session", value: "Septembre 2025", icon: "bx-calendar" }
  ];

  candidate: any = {
    lastName: "Doe",
    firstName: "Alex",
    email: "alex.doe@email.com",
    phone: "+237 6 99 99 99 99",
    session: "Septembre 2025",
    examCenter: "Non affecté"
  };

  attachments = [
    { name: "Acte de naissance", status: "Validée" },
    { name: "Diplôme requis", status: "En attente" },
    { name: "CNI", status: "Validée" }
  ];

  ngOnInit(): void {
    // Charger les infos du candidat depuis le service ou le localStorage
  }

  download(att: any) {
    // Logique de téléchargement
  }

  edit(att: any) {
    // Logique de modification
  }
}
