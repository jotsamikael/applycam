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
  displayedColumns: string[] = ['amount', 'paymentMethod', 'status', 'actions'];
  dataSource = new MatTableDataSource<PaymentResponse>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  paymentForm: FormGroup;
  searchForm: FormGroup;
  isEditMode = false;
  selectedPayment: PaymentResponse | null = null;
  processing = false;
  showInactive = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Méthodes utilitaires pour le template
  Date = Date;
  Math = Math;

  // Statistiques
  statistics = {
    totalPayments: 0,
    totalAmount: 0,
    averageAmount: 0,
    paymentsThisMonth: 0
  };

  breadCrumbItems: Array<{}> = [{ label: 'Staff' }, { label: 'Paiements', active: true }];

  constructor(
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['', Validators.required],
      secretCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });

    this.searchForm = this.fb.group({
      amount: [''],
      paymentMethod: [''],
      minAmount: [''],
      maxAmount: ['']
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.loadStatistics();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Méthodes utilitaires pour le template
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  loadPayments(): void {
    if (!localStorage.getItem('token')) {
      Swal.fire('Erreur', 'Vous devez être connecté pour voir les paiements', 'error');
      return;
    }
    
    this.processing = true;
    console.log('Chargement des paiements...');
    
    this.paymentService.getAllPayments({ 
      field: 'id', 
      order: true,
      offset: this.currentPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (res: any) => {
        console.log('Réponse du serveur:', res);
        this.dataSource.data = res?.content ?? [];
        this.totalElements = res?.totalElements ?? 0;
        this.totalPages = res?.totalPages ?? 0;
        this.processing = false;
        console.log('Paiements chargés:', this.dataSource.data.length);
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des paiements:', err);
        this.processing = false;
        if (err.status === 401 || err.status === 403) {
          Swal.fire('Erreur', 'Accès refusé : veuillez vous reconnecter', 'error');
        } else {
          Swal.fire('Erreur', 'Impossible de charger les paiements', 'error');
        }
      }
    });
  }

  loadStatistics(): void {
    const payments = this.dataSource.data;
    this.statistics.totalPayments = payments.length;
    this.statistics.totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    this.statistics.averageAmount = payments.length > 0 ? this.statistics.totalAmount / payments.length : 0;
    
    // Pour l'instant, on ne peut pas filtrer par mois car createdDate n'existe pas
    // Cette fonctionnalité peut être ajoutée quand le backend fournira cette information
    this.statistics.paymentsThisMonth = 0;
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
      secretCode: '' // Le code secret n'est pas affiché pour des raisons de sécurité
    });
    this.showFormModal();
  }

  showFormModal(): void {
    Swal.fire({
      title: this.isEditMode ? 'Modifier le paiement' : 'Créer un paiement',
      html: `
        <form id="paymentForm">
          <div class="mb-3">
            <label class="form-label">Montant (XAF) *</label>
            <input name="amount" class="form-control" required type="number" 
                   min="0.01" step="0.01"
                   value="${this.paymentForm.value.amount || ''}"
                   placeholder="Ex: 50000">
            <div class="form-text">Montant en francs CFA</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Méthode de paiement *</label>
            <select name="paymentMethod" class="form-control" required>
              <option value="">Sélectionner une méthode</option>
              <option value="Mobile Money" ${this.paymentForm.value.paymentMethod === 'Mobile Money' ? 'selected' : ''}>Mobile Money</option>
              <option value="Carte Bancaire" ${this.paymentForm.value.paymentMethod === 'Carte Bancaire' ? 'selected' : ''}>Carte Bancaire</option>
              <option value="Virement Bancaire" ${this.paymentForm.value.paymentMethod === 'Virement Bancaire' ? 'selected' : ''}>Virement Bancaire</option>
              <option value="Espèces" ${this.paymentForm.value.paymentMethod === 'Espèces' ? 'selected' : ''}>Espèces</option>
              <option value="Chèque" ${this.paymentForm.value.paymentMethod === 'Chèque' ? 'selected' : ''}>Chèque</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Code secret *</label>
            <input name="secretCode" class="form-control" required type="number" 
                   min="1000" max="999999"
                   value="${this.paymentForm.value.secretCode || ''}"
                   placeholder="Ex: 123456">
            <div class="form-text">Code à 4-6 chiffres</div>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const form = document.getElementById('paymentForm') as HTMLFormElement;
        if (form && form.checkValidity()) {
          const formData = new FormData(form);
          const value: any = {};
          formData.forEach((v, k) => value[k] = v);
          
          // Validation supplémentaire
          if (value.amount && Number(value.amount) <= 0) {
            Swal.showValidationMessage('Le montant doit être supérieur à 0');
            return false;
          }
          
          if (value.secretCode && (value.secretCode.length < 4 || value.secretCode.length > 6)) {
            Swal.showValidationMessage('Le code secret doit contenir 4 à 6 chiffres');
            return false;
          }
          
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
    console.log('Création de paiement:', formValue);
    
    this.paymentService.createPayment({
      body: {
        amount: Number(formValue.amount),
        paymentMethod: formValue.paymentMethod,
        secretCode: Number(formValue.secretCode)
      }
    }).subscribe({
      next: (response) => {
        console.log('Paiement créé:', response);
        this.loadPayments();
        Swal.fire('Succès', 'Paiement créé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur création paiement:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de créer le paiement', 'error');
      }
    });
  }

  updatePayment(paymentId: number, formValue: any): void {
    this.processing = true;
    console.log('Mise à jour paiement:', paymentId, formValue);
    
    this.paymentService.updatePayment({
      id: paymentId,
      body: {
        amount: Number(formValue.amount),
        paymentMethod: formValue.paymentMethod,
        secretCode: Number(formValue.secretCode)
      }
    }).subscribe({
      next: (response) => {
        console.log('Paiement mis à jour:', response);
        this.loadPayments();
        Swal.fire('Succès', 'Paiement modifié avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur mise à jour paiement:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de modifier le paiement', 'error');
      }
    });
  }

  confirmDelete(payment: PaymentResponse): void {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment supprimer ce paiement de ${this.formatCurrency(payment.amount)} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (result.isConfirmed && payment.id) {
        this.deletePayment(payment.id);
      }
    });
  }

  deletePayment(paymentId: number): void {
    this.processing = true;
    console.log('Suppression paiement:', paymentId);
    
    this.paymentService.deletePayment({ id: paymentId }).subscribe({
      next: () => {
        console.log('Paiement supprimé');
        this.loadPayments();
        Swal.fire('Succès', 'Paiement supprimé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur suppression paiement:', error);
        this.processing = false;
        Swal.fire('Erreur', 'Impossible de supprimer le paiement', 'error');
      }
    });
  }

  searchPayments(): void {
    const searchValue = this.searchForm.value;
    console.log('Recherche paiements:', searchValue);
    
    // Pour l'instant, on recharge tous les paiements
    // Une implémentation plus avancée pourrait filtrer côté serveur
    this.loadPayments();
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.loadPayments();
  }

  exportToExcel(): void {
    const payments = this.dataSource.data;
    if (payments.length === 0) {
      Swal.fire('Information', 'Aucune donnée à exporter', 'info');
      return;
    }

    // Création du contenu CSV
    const headers = ['ID', 'Montant (XAF)', 'Méthode de paiement'];
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        payment.id || '',
        payment.amount || '',
        payment.paymentMethod || ''
      ].join(','))
    ].join('\n');

    // Téléchargement du fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `paiements_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Succès', 'Export terminé avec succès', 'success');
  }

  refreshData(): void {
    this.loadPayments();
    Swal.fire('Succès', 'Données actualisées', 'success');
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPayments();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusBadgeClass(payment: PaymentResponse): string {
    // Pour l'instant, tous les paiements sont considérés comme actifs
    // Cette logique peut être étendue selon les besoins
    return 'badge bg-success';
  }

  getStatusText(payment: PaymentResponse): string {
    return 'Payé';
  }

  canEdit(payment: PaymentResponse): boolean {
    return true; // Tous les paiements peuvent être modifiés
  }

  canDelete(payment: PaymentResponse): boolean {
    return true; // Tous les paiements peuvent être supprimés
  }
}
