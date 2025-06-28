import { Component, OnInit } from '@angular/core';

interface Certificate {
  title: string;
  session: string;
  dateIssued: string;
  status: string;
  fileUrl?: string;
}

@Component({
  selector: 'app-my-certificates',
  templateUrl: './my-certificates.component.html',
  styleUrls: ['./my-certificates.component.scss']
})
export class MyCertificatesComponent implements OnInit {
  certificates: Certificate[] = [
    {
      title: 'CQP - Électricien',
      session: 'Septembre 2023',
      dateIssued: '15/11/2023',
      status: 'Disponible',
      fileUrl: 'assets/certificates/cqp-electricien.pdf'
    },
    {
      title: 'DQP - Plombier',
      session: 'Septembre 2022',
      dateIssued: '20/11/2022',
      status: 'Disponible',
      fileUrl: 'assets/certificates/dqp-plombier.pdf'
    },
    {
      title: 'CQP - Soudeur',
      session: 'Décembre 2021',
      dateIssued: 'Non délivré',
      status: 'En attente'
    }
  ];

  ngOnInit(): void {
    // Charger les certificats depuis un service si besoin
  }

  download(cert: Certificate) {
    if (cert.fileUrl) {
      window.open(cert.fileUrl, '_blank');
    }
  }
}
