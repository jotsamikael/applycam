import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PromoterService } from '../../../services/services/promoter.service';
import { FileControllerService } from '../../../services/services/file-controller.service';
import { PromoterResponse } from '../../../services/models/promoter-response';
import { PageResponsePromoterResponse } from '../../../services/models/page-response-promoter-response';

@Component({
  selector: 'app-promoter',
  templateUrl: './promoter.component.html',
  styleUrls: ['./promoter.component.scss']
})
export class PromoterComponent implements OnInit {
  dataSource = new MatTableDataSource<PromoterResponse>([]);
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phoneNumber', 'enabled', 'actions'];
  showModal = false;
  isEditMode = false;
  processing = false;
  promoterForm: FormGroup;
  selectedPromoter: PromoterResponse | null = null;

  // Ajouts pour les boutons d'actualisation, filtres et exportation
  showAdvancedFilters = false;
  filterForm!: FormGroup;
  refreshing = false;
  stats: { title: string, value: number, icon: string }[] = [];

  breadCrumbItems = [
    { label: 'Dashboard', url: '/' },
    { label: 'Promoters', url: '/staff/promoter' }
  ];

  confirmDialog = {
    show: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  };

  private readonly fileBaseUrl = 'http://localhost:8080/files/promoter-files'; // ✅ à adapter selon ton backend

  constructor(
    private promoterService: PromoterService,
    private fileControllerService: FileControllerService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.promoterForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: [''],
      nationalIdNumber: [''],
      accountLocked: [false],
      enabled: [true]
    });

    // Formulaire de filtres avancés
    this.filterForm = this.fb.group({
      status: [''],
      email: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadPromoters();
    (window as any).activatePromoter = (email: string) => this.activatePromoter(email);
  }

  get f() { return this.promoterForm.controls; }

  loadPromoters() {
    this.promoterService.getAllStaffs({ offset: 0, pageSize: 1000 }).subscribe({
      next: (res: PageResponsePromoterResponse) => {
        this.dataSource.data = res.content || [];
        this.updateStats();
      }
    });
  }

  updateStats() {
    const all = this.dataSource.data;
    this.stats = [
      { title: 'Total Promoteurs', value: all.length, icon: 'bx bx-user' },
      { title: 'Actifs', value: all.filter(p => p.enabled).length, icon: 'bx bx-check-circle' },
      { title: 'Inactifs', value: all.filter(p => !p.enabled).length, icon: 'bx bx-block' }
    ];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedPromoter = null;
    this.promoterForm.reset({ enabled: true, accountLocked: false });
    this.showModal = true;
  }

  edit(promoter: PromoterResponse) {
    this.isEditMode = true;
    this.selectedPromoter = promoter;
    this.promoterForm.patchValue(promoter);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.promoterForm.reset();
    this.selectedPromoter = null;
  }

  onSubmit() {
    if (this.promoterForm.invalid) return;
    const action = this.isEditMode ? 'modifier' : 'créer';

    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${action} ce promoteur ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        const formValue = this.promoterForm.value;

        if (this.isEditMode && this.selectedPromoter?.email) {
          this.promoterService.updatePromoter({
            email: this.selectedPromoter.email,
            body: formValue
          }).subscribe({
            next: () => {
              this.loadPromoters();
              this.closeModal();
              this.processing = false;
              this.showSuccess();
            },
            error: () => this.processing = false
          });
        } else {
          // Ajouter ici la logique de création si activée
          this.processing = false;
          this.closeModal();
          this.showSuccess();
        }
      }
    });
  }

  delete(promoter: PromoterResponse) {
    if (!promoter.email) return;
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous supprimer ou désactiver ce promoteur ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.promoterService.togglePromoter({ email: promoter.email }).subscribe({
          next: () => {
            this.loadPromoters();
            this.processing = false;
            Swal.fire('Succès', 'Action réalisée avec succès', 'success');
          },
          error: () => this.processing = false
        });
      }
    });
  }

  toggleActivation(promoter: PromoterResponse) {
    this.delete(promoter);
  }
// à placer dans la classe PromoterComponent

isImage(url: string): boolean {
  if (!url) return false;
  const ext = url.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');
}

/**
 * Convertit un chemin de fichier en URL valide pour l'affichage
 * @param filePath - Chemin du fichier (peut être relatif, absolu ou déjà une URL)
 * @returns URL complète et valide
 */
toValidUrl(filePath: string): string {
  // 1. Gestion des valeurs vides
  if (!filePath?.trim()) return '';

  // 2. Si c'est déjà une URL complète (http/https), on la retourne telle quelle
  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  // 3. Nettoyage du chemin
  let cleanPath = filePath
    .replace(/\\/g, '/')          // Remplace les antislashs Windows
    .replace(/^[./]+/, '')       // Supprime ./ ou ../ au début
    .replace(/\/+/g, '/')        // Supprime les doubles slashes
    .replace(/^\//, '');         // Supprime le slash initial si présent

  // 4. Construction de l'URL finale
  const baseUrl = this.fileBaseUrl.endsWith('/') 
    ? this.fileBaseUrl.slice(0, -1) 
    : this.fileBaseUrl;

  return `${baseUrl}/${cleanPath}`;
}


 openDetailModal(promoter: PromoterResponse) {
  this.loadPromoterFiles(promoter).then(files => {
    const modalContent = this.generateDetailModalContent(promoter, files);

    Swal.fire({
      title: 'Détails du promoteur',
      html: modalContent,
      width: '55%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'scrollable-swal-popup'
      }
    });
  });
}

private async loadPromoterFiles(promoter: PromoterResponse): Promise<{ [key: string]: string[] }> {
  const files: { [key: string]: string[] } = {};

  const fileTypes = [
    { key: 'CNI', label: 'nationalIdCard' },
    { key: 'PHOTO', label: 'photo' }
  ];

  for (const type of fileTypes) {
    try {
      const url = this.fileControllerService.generateFileUrl(promoter.idUser!, type.key);
      let fullUrl: string;

      if (url.startsWith('http')) {
        fullUrl = url;
      } else if (url.startsWith('files/promoter-files')) {
        // Correction : ajoute /api/v1/ devant
        fullUrl = `http://localhost:8088/api/v1/${url}`;
      } else {
        // Sinon on concatène avec fileBaseUrl
        fullUrl = `${this.fileBaseUrl}/${url}`;
      }

      files[type.label] = [fullUrl];
      
    } catch (error) {
      console.error(`Erreur chargement fichier ${type.key}:`, error);
      files[type.label] = [];
    }
  }

  return files;
}


private generateDetailModalContent(promoter: PromoterResponse, files: { [key: string]: string[] }): string {
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return 'Non renseignée';
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };



  const generateFileSection = (label: string, urls: string[]): string => {
    if (!urls || urls.length === 0) {
      return `<div class="mb-3"><strong>${label} :</strong><br/><em>Aucun fichier</em></div>`;
    }

    let html = `<div class="mb-3"><strong>${label} :</strong><br/>`;

    urls.forEach((url) => {
      const fullUrl = this.toValidUrl(url);
      const fileName = fullUrl.split('/').pop() || 'Document';

      html += `
        <div class="mt-2">
          <a href="${fullUrl}" target="_blank" class="btn btn-sm btn-outline-primary">Télécharger ${fileName}</a>
        </div>
      `;
    });

    html += '</div>';
    return html;
  };


  const htmlContent = `
    <div style="max-height:70vh; overflow-y:auto; text-align:left;">
      <div style="display: flex; gap: 32px; flex-wrap: wrap;">
        <div style="flex: 1 1 300px; min-width: 250px; max-width: 400px;">
          <h5 class="text-primary">Informations personnelles</h5>
          <p><strong>Nom :</strong> ${promoter.lastname || '-'}</p>
          <p><strong>Prénom :</strong> ${promoter.firstname || '-'}</p>
          <p><strong>Email :</strong> ${promoter.email || '-'}</p>
          <p><strong>Téléphone :</strong> ${promoter.phoneNumber || '-'}</p>
          <p><strong>Date de naissance :</strong> ${formatDate(promoter.dateOfBirth)}</p>
          <p><strong>Numéro CNI :</strong> ${promoter.nationalIdNumber || '-'}</p>
        </div>
        <div style="flex: 1 1 300px; min-width: 250px; max-width: 500px;">
          <h5 class="text-primary">Documents</h5>
          ${generateFileSection('CNI', files['nationalIdCard'])}
          ${generateFileSection('Photo', files['photo'])}
         
        </div>
      </div>
    </div>
  `;

  console.groupEnd(); // 🔚 Fin du groupe de logs

  return htmlContent;
}




  showSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Succès',
      html: `<div style='text-align:left'>
        <p>Votre compte promoteur a été créé avec succès.</p>
        <p>Vous recevrez un mail une fois que le compte est activé.</p>
      </div>`,
      showConfirmButton: true
    });
  }

  activatePromoter(email: string) {
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment activer le compte de ${email} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        this.promoterService.togglePromoter({ email }).subscribe({
          next: () => {
            this.loadPromoters();
            this.processing = false;
            Swal.fire('Succès', 'Compte activé avec succès', 'success');
          },
          error: () => {
            this.processing = false;
            Swal.fire('Erreur', 'Impossible d\'activer le compte', 'error');
          }
        });
      }
    });
  }

  // ==================== MÉTHODES POUR LES BOUTONS D'ACTUALISATION, FILTRES ET EXPORTATION ====================

  refreshPromoters(): void {
    this.refreshing = true;
    this.loadPromoters();
    setTimeout(() => {
      this.refreshing = false;
    }, 1000);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applyAdvancedFilters(): void {
    const filterValue = this.filterForm.value;
    let filterString = '';
    
    Object.keys(filterValue).forEach(key => {
      if (filterValue[key]) {
        filterString += `${key}:${filterValue[key]} `;
      }
    });
    
    this.dataSource.filter = filterString.trim();
    Swal.fire('Succès', 'Filtres appliqués pour les promoteurs', 'success');
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.dataSource.filter = '';
    Swal.fire('Info', 'Filtres effacés pour les promoteurs', 'info');
  }

  exportPromotersToExcel(): void {
    // TODO: Implémenter l'export Excel pour les promoteurs
    Swal.fire('Info', 'Fonctionnalité d\'export Excel pour les promoteurs en cours de développement', 'info');
  }
}
