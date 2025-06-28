import { Component, OnInit } from '@angular/core';

interface Result {
  title: string;
  session: string;
  examCenter: string;
  status: string;
  score?: string;
  result?: string;
}

@Component({
  selector: 'app-my-results',
  templateUrl: './my-results.component.html',
  styleUrls: ['./my-results.component.scss']
})
export class MyResultsComponent implements OnInit {
  results: Result[] = [
    {
      title: 'CQP - Électricien',
      session: 'Septembre 2023',
      examCenter: 'Lycée Technique Douala',
      status: 'Terminé',
      score: '15.5/20',
      result: 'Admis'
    },
    {
      title: 'DQP - Plombier',
      session: 'Septembre 2022',
      examCenter: 'CFA Yaoundé',
      status: 'Terminé',
      score: '9.5/20',
      result: 'Ajourné'
    },
    {
      title: 'CQP - Soudeur',
      session: 'Décembre 2021',
      examCenter: 'CFA Douala',
      status: 'En attente',
      score: '-',
      result: '-'
    }
  ];

  ngOnInit(): void {
    // Charger les résultats depuis un service si besoin
  }
}
