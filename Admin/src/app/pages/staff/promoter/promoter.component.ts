import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PromoterService } from '../../../services/services/promoter.service';
import { PromoterResponse } from '../../../services/models/promoter-response';
import { CreatePromoterRequest } from '../../../services/models/create-promoter-request';
import { PageResponsePromoterResponse } from '../../../services/models/page-response-promoter-response';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { FileControllerService } from '../../../services/services/file-controller.service'; // adapte le chemin
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
  breadCrumbItems = [
    { label: 'Dashboard', url: '/' },
    { label: 'Ministers', url: '/staff/promoter' }
  ];

  confirmDialog = {
    show: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  };
  detailFiles: { [key: string]: string[] } = {};
  showDetailModal = false;
  detailPromoter: PromoterResponse | null = null;

  constructor(
    private promoterService: PromoterService,
    private fb: FormBuilder,
    private fileControllerService: FileControllerService, // <-- ajoute ceci
    private cdr: ChangeDetectorRef
  ) {
    this.promoterForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      dateOfBirth: [''],
      nationalIdNumber: [''],
      accountLocked: [false],
      enabled: [true],
    });
  }

  ngOnInit(): void {
    this.loadPromoters();
  }

  get f() { return this.promoterForm.controls; }

  loadPromoters() {
    this.promoterService.getAllStaffs1({ offset: 0, pageSize: 1000 }).subscribe({
      next: (res: PageResponsePromoterResponse) => {
        this.dataSource.data = res.content || [];
      }
    });
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
  closeDetailModal() {
    this.showDetailModal = false;
    this.detailPromoter = null;
    this.cdr.detectChanges();
  }

  // Succès après création
// onSubmit() {
//   if (this.promoterForm.invalid) return;
//   const action = this.isEditMode ? 'modifier' : 'créer';
//   Swal.fire({
//     title: 'Confirmation',
//     text: `Voulez-vous vraiment ${action} ce promoteur ?`,
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonText: 'Oui',
//     cancelButtonText: 'Annuler'
//   }).then(result => {
//     if (result.isConfirmed) {
//       this.processing = true;
//       const formValue = this.promoterForm.value;
//       if (this.isEditMode && this.selectedPromoter?.email) {
//         this.promoterService.updatePromoter1({
//           email: this.selectedPromoter.email,
//           body: formValue
//         }).subscribe({
//           next: () => {
//             this.loadPromoters();
//             this.closeModal();
//             this.processing = false;
//             Swal.fire('Succès', 'Promoteur modifié avec succès', 'success');
//           },
//           error: () => { this.processing = false; }
//         });
//       } else {
//         // this.promoterService.createPromoterOnly({ body: ... }).subscribe(...)
//         this.processing = false;
//         this.closeModal();
//         Swal.fire('Succès', 'Promoteur créé avec succès', 'success');
//       }
//     }
//   });
// }
 // Confirmation avant suppression
delete(promoter: PromoterResponse) {
  if (!promoter.email) return;
  Swal.fire({
    title: 'Confirmation',
    text: `Voulez-vous vraiment supprimer ou désactiver ce promoteur (${promoter.firstname} ${promoter.lastname}) ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, confirmer',
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
        error: () => { this.processing = false; }
      });
    }
  });
}

// Succès après création
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
        this.promoterService.updatePromoter1({
          email: this.selectedPromoter.email,
          body: formValue
        }).subscribe({
          next: () => {
            this.loadPromoters();
            this.closeModal();
            this.processing = false;
            this.showSuccess();
          },
          error: () => { this.processing = false; }
        });
      } else {
        // this.promoterService.createPromoterOnly({ body: ... }).subscribe(...)
        this.processing = false;
        this.closeModal();
        this.showSuccess();
      }
    }
  });
}
  toggleActivation(promoter: PromoterResponse) {
    this.delete(promoter);
  }

  openConfirm(message: string, onConfirm: () => void) {
    this.confirmDialog = {
      show: true,
      message,
      onConfirm,
      onCancel: () => { this.confirmDialog.show = false; }
    };
  }



openDetailModal(promoter: PromoterResponse) {
  this.detailPromoter = promoter;
  this.detailFiles = {};

  const fileTypes = [
    { key: 'CNI', label: 'nationalIdCard' },
    { key: 'PHOTO', label: 'photo' },
    { key: 'SIGNATURE', label: 'signatureLetter' },
    { key: 'LOCALISATION', label: 'localisationFile' },
    { key: 'REGULATION', label: 'internalRegulationFile' }
  ];

  let remainingRequests = fileTypes.length;

  fileTypes.forEach(type => {
    this.fileControllerService.getPromoterFileByType({
      promoterId: promoter.idUser,
      fileType: type.key
    }).subscribe(urls => {
      this.detailFiles[type.label] = urls;
      remainingRequests--;

      // Lorsque tous les fichiers sont récupérés
      if (remainingRequests === 0) {
        this.showSwalDetail();
      }
      this.cdr.detectChanges();
    });
  });
}

showSwalDetail() {
  const promoter = this.detailPromoter!;
  Swal.fire({
    title: 'Détails du promoteur',
    html: `
      <ul class="list-group text-start">
        <li class="list-group-item"><strong>Prénom :</strong> ${promoter.firstname}</li>
        <li class="list-group-item"><strong>Nom :</strong> ${promoter.lastname}</li>
        <li class="list-group-item"><strong>Email :</strong> ${promoter.email}</li>
        <li class="list-group-item"><strong>Téléphone :</strong> ${promoter.phoneNumber}</li>
        <li class="list-group-item"><strong>Date de naissance :</strong> ${promoter.dateOfBirth}</li>
        <li class="list-group-item"><strong>Numéro d'identité :</strong> ${promoter.nationalIdNumber}</li>
        <li class="list-group-item"><strong>Statut :</strong> ${promoter.enabled ? 'Actif' : 'Inactif'}</li>
      </ul>
      <hr/>
      <h5>Documents</h5>
      ${this.generateFilePreview('CNI', this.detailFiles['nationalIdCard']?.[0])}
      ${this.generateFilePreview('Photo', this.detailFiles['photo']?.[0])}
      ${this.generateFilePreview('Lettre d\'engagement', this.detailFiles['signatureLetter']?.[0])}
      ${this.generateFilePreview('Plan de localisation', this.detailFiles['localisationFile']?.[0])}
      ${this.generateFilePreview('Règlement intérieur', this.detailFiles['internalRegulationFile']?.[0])}
    `,
    showCloseButton: true,
    showConfirmButton: false,
    width: 800,
  });
}

generateFilePreview(label: string, fileUrl?: string): string {
  if (!fileUrl || typeof fileUrl !== 'string') return '';

  const ext = fileUrl.split('.').pop()?.toLowerCase();
  const isPdf = ext === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

  if (isPdf) {
    return `
      <div class="mb-3">
        <strong>${label} :</strong><br/>
        <embed src="${fileUrl}" type="application/pdf" width="100%" height="400px" />
      </div>
    `;
  } else if (isImage) {
    return `
      <div class="mb-3">
        <strong>${label} :</strong><br/>
        <a href="${fileUrl}" target="_blank">Voir</a><br/>
        <img src="${fileUrl}" alt="${label}" class="img-thumbnail mt-2" style="max-width: 200px;">
      </div>
    `;
  } else {
    return `
      <div class="mb-3">
        <strong>${label} :</strong> <a href="${fileUrl}" target="_blank">Télécharger</a>
      </div>
    `;
  }
}


  

  showSuccess() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Succès',
      html: `<div style='text-align:left'>
        <p>Votre compte promoteur a été créé avec succès.</p>
        <p>Après vérification de vos documents, vous recevrez un mail de confirmation lorsque votre compte sera activé.</p>
        <p>Vous pourrez alors vous connecter sur la plateforme.</p>
      </div>`,
      showConfirmButton: true
    });
  }
}
