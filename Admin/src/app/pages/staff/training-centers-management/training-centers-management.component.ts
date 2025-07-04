import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { TrainingcenterService } from '../../../services/services/trainingcenter.service';
import { TrainingCenterResponse } from '../../../services/models/training-center-response';
import { PageResponseTrainingCenterResponse } from '../../../services/models/page-response-training-center-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileControllerService } from '../../../services/services/file-controller.service';


@Component({
  selector: 'app-training-centers-management',
  templateUrl: './training-centers-management.component.html',
  styleUrls: ['./training-centers-management.component.scss']
})
export class TrainingCentersManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<TrainingCenterResponse>([]);
  displayedColumns: string[] = [
    'fullName', 'acronym', 'agreementNumber', 'division', 'promoter', 'startDateOfAgreement', 'endDateOfAgreement', 'centerPresentCandidateForCqp', 'centerPresentCandidateForDqp', 'status', 'actions'
  ];
  processing = false;
  selectedTrainingCenter: TrainingCenterResponse | null = null;
  showModal = false;
  isEditMode = false;
  trainingCenterForm: FormGroup;
  followUpStat: { title: string, value: number, icon: string }[] = [];

  constructor(private trainingCenterService: TrainingcenterService, private fb: FormBuilder, private fileControllerService: FileControllerService) {
    this.trainingCenterForm = this.fb.group({
      fullName: ['', Validators.required],
      acronym: ['', Validators.required],
      agreementNumber: ['', Validators.required],
      division: ['', Validators.required],
      promoter: [''],
      startDateOfAgreement: [''],
      endDateOfAgreement: [''],
      centerPresentCandidateForCqp: [false],
      centerPresentCandidateForDqp: [false]
      // Ajoute d'autres champs si besoin
    });
  }

  ngOnInit(): void {
    this.loadTrainingCenters();
  }

  loadTrainingCenters() {
    this.trainingCenterService.getAllTrainingCenters({
      offset: 0,
      pageSize: 1000,
      field: 'fullName',
      order: true
    }).subscribe({
      next: (res: PageResponseTrainingCenterResponse) => {
        this.dataSource.data = res.content || [];
        // Statistiques : total, actifs, inactifs (exemple)
        const total = this.dataSource.data.length;
        const actifs = this.dataSource.data.filter(c => c.centerPresentCandidateForCqp || c.centerPresentCandidateForDqp).length;
        const inactifs = total - actifs;
        this.followUpStat = [
          { title: 'Total', value: total, icon: 'bx bx-buildings' },
          { title: 'Actifs (CQP/DQP)', value: actifs, icon: 'bx bx-check-circle' },
          { title: 'Inactifs', value: inactifs, icon: 'bx bx-block' }
        ];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDetailModal(center: TrainingCenterResponse) {
    this.selectedTrainingCenter = center;
    const modalContent = this.generateDetailModalContent(center);
    Swal.fire({
      title: 'Détails du centre de formation',
      html: modalContent,
      width: '40%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: { popup: 'scrollable-swal-popup' }
    });
  }

  toggleActivation(center: TrainingCenterResponse) {
    if (!center.agreementNumber) return;
    const action = center.centerPresentCandidateForCqp || center.centerPresentCandidateForDqp ? 'désactiver' : 'activer';
    Swal.fire({
      title: 'Confirmation',
      text: `Voulez-vous vraiment ${action} ce centre de formation ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.processing = true;
        (this.trainingCenterService as any).toggleTrainingCenter({ agreementNumber: center.agreementNumber }).subscribe({
          next: () => {
            this.loadTrainingCenters();
            this.processing = false;
            Swal.fire('Succès', `Centre ${action} avec succès`, 'success');
          },
          error: () => {
            this.processing = false;
            Swal.fire('Erreur', `Impossible de ${action} le centre`, 'error');
          }
        });
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedTrainingCenter = null;
    this.trainingCenterForm.reset({ centerPresentCandidateForCqp: false, centerPresentCandidateForDqp: false });
    this.showModal = true;
    this.openFormModal();
  }

  edit(center: TrainingCenterResponse) {
    this.isEditMode = true;
    this.selectedTrainingCenter = center;
    this.trainingCenterForm.patchValue(center);
    this.showModal = true;
    this.openFormModal();
  }

  openFormModal() {
    Swal.fire({
      title: this.isEditMode ? 'Éditer le centre' : 'Créer un centre',
      html: this.generateFormModalContent(),
      showCancelButton: true,
      confirmButtonText: this.isEditMode ? 'Mettre à jour' : 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        // Récupère les valeurs du formulaire
        const form = document.getElementById('trainingCenterForm') as HTMLFormElement;
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
        // Appelle la méthode de création ou de mise à jour ici
        if (this.isEditMode) {
          // Appel update
          // this.trainingCenterService.updateTrainingCenter(...)
        } else {
          // Appel create
          // this.trainingCenterService.createTrainingCenter(...)
        }
        this.showModal = false;
        this.loadTrainingCenters();
      } else {
        this.showModal = false;
      }
    });
  }

  generateFormModalContent(): string {
    // Génère le HTML du formulaire (simple exemple)
    return `
      <form id="trainingCenterForm">
        <div class="mb-2">
          <label>Nom</label>
          <input name="fullName" class="form-control" required value="${this.trainingCenterForm.value.fullName || ''}">
        </div>
        <div class="mb-2">
          <label>Acronyme</label>
          <input name="acronym" class="form-control" required value="${this.trainingCenterForm.value.acronym || ''}">
        </div>
        <div class="mb-2">
          <label>Numéro d'agrément</label>
          <input name="agreementNumber" class="form-control" required value="${this.trainingCenterForm.value.agreementNumber || ''}">
        </div>
        <div class="mb-2">
          <label>Division</label>
          <input name="division" class="form-control" required value="${this.trainingCenterForm.value.division || ''}">
        </div>
        <div class="mb-2">
          <label>Promoteur</label>
          <input name="promoter" class="form-control" value="${this.trainingCenterForm.value.promoter || ''}">
        </div>
        <div class="mb-2">
          <label>Date début agrément</label>
          <input name="startDateOfAgreement" type="date" class="form-control" value="${this.trainingCenterForm.value.startDateOfAgreement || ''}">
        </div>
        <div class="mb-2">
          <label>Date fin agrément</label>
          <input name="endDateOfAgreement" type="date" class="form-control" value="${this.trainingCenterForm.value.endDateOfAgreement || ''}">
        </div>
        <div class="mb-2">
          <label><input type="checkbox" name="centerPresentCandidateForCqp" ${this.trainingCenterForm.value.centerPresentCandidateForCqp ? 'checked' : ''}> Présente candidats CQP</label>
        </div>
        <div class="mb-2">
          <label><input type="checkbox" name="centerPresentCandidateForDqp" ${this.trainingCenterForm.value.centerPresentCandidateForDqp ? 'checked' : ''}> Présente candidats DQP</label>
        </div>
      </form>
    `;
  }

  private generateDetailModalContent(center: TrainingCenterResponse): string {
    console.log('[TrainingCenter] Génération des détails pour:', center);
    
    const formatDate = (date: string | null | undefined): string =>
      date ? new Date(date).toLocaleDateString('fr-FR') : 'Non renseignée';

    const generateFileLink = (label: string, fileUrl?: string | null): string => {
      console.log(`[TrainingCenter] Génération lien pour ${label}:`, fileUrl);
      if (!fileUrl) {
        return `<div class="mb-2"><strong>${label} :</strong> <em>Aucun fichier</em></div>`;
      }
      const fileName = fileUrl.split('/').pop() || 'Document';
      return `<div class="mb-2"><strong>${label} :</strong><br/>
        <a href="${fileUrl}" target="_blank" class="btn btn-sm btn-outline-primary mb-1" 
           onclick="console.log('Clic sur ${label}:', '${fileUrl}'); return true;">
          <i class="bx bx-download me-1"></i>Télécharger ${fileName}
        </a>
        <button onclick="testFileUrl('${fileUrl}', '${label}')" class="btn btn-sm btn-outline-secondary ms-1">
          <i class="bx bx-test-tube"></i>Test
        </button></div>`;
    };

    // Générer les URLs des fichiers via le service
    console.log('[TrainingCenter] AgreementNumber:', center.agreementNumber);
    
    const internalRegulationUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'REGULATION') : null;
    console.log('[TrainingCenter] URL Règlement intérieur:', internalRegulationUrl);
    
    const signatureLetterUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'SIGNATURE') : null;
    console.log('[TrainingCenter] URL Lettre signature:', signatureLetterUrl);
    
    const localisationUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'LOCALISATION') : null;
    console.log('[TrainingCenter] URL Localisation:', localisationUrl);
    
    const agreementUrl = center.agreementNumber ? 
      this.fileControllerService.generateTrainingCenterFileUrl(center.agreementNumber, 'AGREEMENT') : null;
    console.log('[TrainingCenter] URL Accord:', agreementUrl);
    return `
      <div style="max-height:70vh; overflow-y:auto; text-align:left;">
        <h5 class="text-primary">Informations générales</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Nom :</strong> ${center.fullName || '-'}</p>
            <p><strong>Acronyme :</strong> ${center.acronym || '-'}</p>
            <p><strong>Numéro d'agrément :</strong> ${center.agreementNumber || '-'}</p>
            <p><strong>Division :</strong> ${center.division || '-'}</p>
            <p><strong>Promoteur :</strong> ${center.promoterName || center.promoter || '-'}</p>
            <p><strong>Date début agrément :</strong> ${formatDate(center.startDateOfAgreement)}</p>
            <p><strong>Date fin agrément :</strong> ${formatDate(center.endDateOfAgreement)}</p>
            <p><strong>Présente candidats CQP :</strong> ${center.centerPresentCandidateForCqp ? 'Oui' : 'Non'}</p>
            <p><strong>Présente candidats DQP :</strong> ${center.centerPresentCandidateForDqp ? 'Oui' : 'Non'}</p>
            <p><strong>Statut :</strong> <span class="badge bg-info">${center.status || 'DRAFT'}</span></p>
          </div>
          <div class="col-md-6">
            <p><strong>Liste des spécialités :</strong> ${
              (center.offersSpecialityList && center.offersSpecialityList.length > 0)
                ? center.offersSpecialityList.map(s => (s && (s as any).name ? (s as any).name : '-')).join(', ')
                : '-'
            }</p>
            <p><strong>Liste des campus :</strong> ${
              (center.campusList && center.campusList.length > 0)
                ? center.campusList.map(c => (c && (c as any).name ? (c as any).name : '-')).join(', ')
                : '-'
            }</p>
          </div>
        </div>
        
        <hr class="my-3">
        
        <h5 class="text-primary">Documents</h5>
        <div class="row">
          <div class="col-md-12">
            ${generateFileLink("Règlement intérieur", internalRegulationUrl)}
            ${generateFileLink("Lettre de signature", signatureLetterUrl)}
            ${generateFileLink("Fichier de localisation", localisationUrl)}
            ${generateFileLink("Fichiers d'agrément", agreementUrl)}
          </div>
        </div>
      </div>
    `;
  }

  get f() { return this.trainingCenterForm.controls; }

  onChangeStatus(center: TrainingCenterResponse) {
    console.log('Changement de statut demandé pour :', center);
    Swal.fire({
      title: `Changer le statut de ${center.fullName}`,
      html: `
        <div class="mb-2">
          <label for="statusSelect">Nouveau statut</label>
          <select id="statusSelect" class="form-control">
            <option value="VALIDATED">Validé</option>
            <option value="REJECTED">Rejeté</option>
            <option value="PENDING">En attente</option>
            <option value="DRAFT">Brouillon</option>
            <option value="INCOMPLETED">Incomplet</option>
            <option value="READYTOPAY">Prêt à payer</option>
            <option value="PAID">Payé</option>
          </select>
        </div>
        <div>
          <label for="commentInput">Commentaire</label>
          <textarea id="commentInput" class="form-control" rows="3"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const status = (document.getElementById('statusSelect') as HTMLSelectElement).value;
        const comment = (document.getElementById('commentInput') as HTMLTextAreaElement).value;
        if (!status) {
          Swal.showValidationMessage('Veuillez choisir un statut');
          return false;
        }
        return { status, comment };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const { status, comment } = result.value;
        console.log('Valeur choisie dans la modal :', { status, comment });
        this.processing = true;
        const payload = {
          agreementNumber: center.agreementNumber!,
          status,
          comment
        } as {
          agreementNumber: string;
          status: 'READYTOPAY' | 'DRAFT' | 'PAID' | 'VALIDATED' | 'INCOMPLETED' | 'REJECTED' | 'PENDING';
          comment: string;
        };
        console.log('Payload envoyé au service :', payload);
        this.trainingCenterService.changeStatus(payload).subscribe({
          next: (res) => {
            console.log('Réponse du backend (parsed):', res);
            Swal.fire('Succès', 'Statut modifié avec succès', 'success');
            this.loadTrainingCenters();
          },
          error: (err) => {
            console.error('Erreur lors du changement de statut :', err);
            Swal.fire('Erreur', 'Impossible de changer le statut', 'error');
          },
          complete: () => this.processing = false
        });
      }
    });
  }
  
  // Méthode pour tester les URLs des fichiers
  testFileUrl(url: string, label: string) {
    console.log(`[TrainingCenter] Test de l'URL ${label}:`, url);
    
    fetch(url)
      .then(response => {
        console.log(`[TrainingCenter] Réponse pour ${label}:`, response.status, response.statusText);
        if (!response.ok) {
          return response.text().then(text => {
            console.error(`[TrainingCenter] Erreur pour ${label}:`, text);
            Swal.fire('Erreur', `Erreur ${response.status}: ${text}`, 'error');
          });
        }
        return response.text().then(text => {
          console.log(`[TrainingCenter] Succès pour ${label}:`, text);
          Swal.fire('Succès', `Fichier ${label} accessible`, 'success');
        });
      })
      .catch(error => {
        console.error(`[TrainingCenter] Exception pour ${label}:`, error);
        Swal.fire('Erreur', `Exception: ${error.message}`, 'error');
      });
  }
}
