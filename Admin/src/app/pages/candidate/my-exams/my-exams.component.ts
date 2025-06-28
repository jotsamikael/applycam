import { Component, OnInit } from '@angular/core';

interface Exam {
  title: string;
  session: string;
  examCenter: string;
  status: string;
  result?: string;
}

@Component({
  selector: 'app-my-exams',
  templateUrl: './my-exams.component.html',
  styleUrls: ['./my-exams.component.scss']
})
export class MyExamsComponent implements OnInit {
  exams: Exam[] = [
    {
      title: 'CQP - Électricien',
      session: 'Septembre 2023',
      examCenter: 'Lycée Technique Douala',
      status: 'Terminé',
      result: 'Admis'
    },
    {
      title: 'DQP - Plombier',
      session: 'Septembre 2022',
      examCenter: 'CFA Yaoundé',
      status: 'Terminé',
      result: 'Ajourné'
    },
    {
      title: 'CQP - Soudeur',
      session: 'Décembre 2021',
      examCenter: 'CFA Douala',
      status: 'En attente',
      result: '-'
    }
  ];

  ngOnInit(): void {
    // Charger les examens depuis un service si besoin
  }
}
