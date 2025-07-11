import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PaymentService } from 'src/app/services/services/payment.service';
import { PaymentResponse } from 'src/app/services/models/payment-response';

@Component({
  selector: 'app-payment-gateways',
  templateUrl: './payment-gateways.component.html',
  styleUrls: ['./payment-gateways.component.scss']
})
export class PaymentGatewaysComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['amount', 'paymentMethod', 'actions'];
  dataSource = new MatTableDataSource<PaymentResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  paymentForm: FormGroup;
  isEditMode = false;
  selectedPayment: PaymentResponse | null = null;
  processing = false;
  breadCrumbItems: Array<{}> = [{ label: 'Staff' }, { label: 'Payments', active: true }];

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      secretCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPayments(): void {
    if (!localStorage.getItem('token')) {
      Swal.fire('Erreur', 'Vous devez être connecté pour voir les paiements', 'error');
      return;
    }
    this.processing = true;
    this.paymentService.getAllPayments({ field: 'id', order: true }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res?.content ?? [];
        this.processing = false;
      },
      error: (err) => {
        this.processing = false;
        if (err.status === 401 || err.status === 403) {
          Swal.fire('Erreur', 'Accès refusé : veuillez vous reconnecter', 'error');
        } else {
          Swal.fire('Erreur', 'Impossible de charger les paiements', 'error');
        }
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedPayment = null;
    this.paymentForm.reset();
    this.showFormModal();
  }

  openEditModal(payment: PaymentResponse): void {
    this.isEditMode = true;
    this.selectedPayment = payment;
    this.paymentForm.patchValue({
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      secretCode: '' // à remplir si tu veux éditer le code secret
    });
    this.showFormModal();
  }

  showFormModal(): void {
    Swal.fire({
      title: this.isEditMode ? 'Modifier le paiement' : 'Créer un paiement',
      html: `
        <form id="paymentForm">
          <div class="mb-2">
            <label>Montant</label>
            <input name="amount" class="form-control" required type="number" value="${this.paymentForm.value.amount || ''}">
          </div>
          <div class="mb-2">
            <label>Méthode de paiement</label>
            <input name="paymentMethod" class="form-control" required value="${this.paymentForm.value.paymentMethod || ''}">
          </div>
          <div class="mb-2">
            <label>Code secret</label>
            <input name="secretCode" class="form-control" required type="number" value="${this.paymentForm.value.secretCode || ''}">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const form = document.getElementById('paymentForm') as HTMLFormElement;
        if (form && form.checkValidity()) {
          const formData = new FormData(form);
          const value: any = {};
          formData.forEach((v, k) => value[k] = v);
          return value;
        } else {
          Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        if (this.isEditMode && this.selectedPayment?.id) {
          this.updatePayment(this.selectedPayment.id, result.value);
        } else {
          this.createPayment(result.value);
        }
      }
    });
  }

  createPayment(formValue: any): void {
    this.processing = true;
    this.paymentService.createPayment({
      body: {
        amount: Number(formValue.amount),
        paymentMethod: formValue.paymentMethod,
        secretCode: Number(formValue.secretCode)
      }
    }).subscribe({
      next: () => {
        this.loadPayments();
        Swal.fire('Succès', 'Paiement créé avec succès', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de créer le paiement', 'error');
      }
    });
  }

  updatePayment(paymentId: number, formValue: any): void {
    this.processing = true;
    this.paymentService.updatePayment({
      id: paymentId,
      body: {
        amount: Number(formValue.amount),
        paymentMethod: formValue.paymentMethod,
        secretCode: Number(formValue.secretCode)
      }
    }).subscribe({
      next: () => {
        this.loadPayments();
        Swal.fire('Succès', 'Paiement modifié avec succès', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de modifier le paiement', 'error');
      }
    });
  }

  confirmDelete(payment: PaymentResponse): void {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer ce paiement ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed && payment.id) {
        this.deletePayment(payment.id);
      }
    });
  }

  deletePayment(paymentId: number): void {
    this.processing = true;
    this.paymentService.deletePayment({ id: paymentId }).subscribe({
      next: () => {
        this.loadPayments();
        Swal.fire('Succès', 'Paiement supprimé avec succès', 'success');
      },
      error: () => {
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de supprimer le paiement', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
