import { Component, OnInit } from '@angular/core';

interface Payment {
  label: string;
  amount: string;
  date: string;
  status: string;
  method: string;
  receiptUrl?: string;
}

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.scss']
})
export class MyPaymentsComponent implements OnInit {
  payments: Payment[] = [
    {
      label: 'Frais d\'inscription CQP',
      amount: '15 000 FCFA',
      date: '10/08/2023',
      status: 'Validé',
      method: 'Mobile Money',
      receiptUrl: 'assets/receipts/receipt-cqp.pdf'
    },
    {
      label: 'Frais d\'inscription DQP',
      amount: '20 000 FCFA',
      date: '12/08/2022',
      status: 'Validé',
      method: 'Banque',
      receiptUrl: 'assets/receipts/receipt-dqp.pdf'
    },
    {
      label: 'Frais session spéciale',
      amount: '10 000 FCFA',
      date: '05/12/2021',
      status: 'En attente',
      method: 'Espèces'
    }
  ];

  ngOnInit(): void {
    // Charger les paiements depuis un service si besoin
  }

  downloadReceipt(payment: Payment) {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    }
  }
}
