import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/services/authentication.service';
import { 
  CandidateRegistrationRequest, 
  CreatePromoterAndCenterRequest,
  CreatePromoterRequest,
  CreateTainingCenterRequest
} from '../services/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Candidate properties
  currentStepCandidate = 0;
  candidateSteps = ['Informations personnelles', 'Documents', 'Confirmation'];
  errorMessages: string[] = [];
  processing = false;
  currentYear = new Date().getFullYear();

  // Promoter properties
  currentStepPromoter = 0;
  promoterSteps = ['Informations personnelles', 'Informations du centre', 'Documents', 'Confirmation'];
  selectedTabIndex = 0;

  // Departments by region (Cameroon)
  departmentsByRegion: { [key: string]: string[] } = {
    'Adamaoua': ['Djérem', 'Faro-et-Déo', 'Mayo-Banyo', 'Mbéré', 'Vina'],
    'Centre': ['Haute-Sanaga', 'Lekié', 'Mbam-et-Inoubou', 'Mbam-et-Kim', 'Méfou-et-Afamba', 
               'Méfou-et-Akono', 'Mfoundi', 'Nyong-et-Kéllé', 'Nyong-et-Mfoumou', 'Nyong-et-So\'o'],
    'Est': ['Boumba-et-Ngoko', 'Haut-Nyong', 'Kadey', 'Lom-et-Djérem'],
    'Extrême-Nord': ['Diamaré', 'Logone-et-Chari', 'Mayo-Danay', 'Mayo-Kani', 'Mayo-Sava', 'Mayo-Tsanaga'],
    'Littoral': ['Moungo', 'Nkam', 'Sanaga-Maritime', 'Wouri'],
    'Nord': ['Bénoué', 'Faro', 'Mayo-Louti', 'Mayo-Rey'],
    'Nord-Ouest': ['Boyo', 'Bui', 'Donga-Mantung', 'Menchum', 'Mezam', 'Momo', 'Ngo-Ketunjia'],
    'Ouest': ['Bamboutos', 'Haut-Nkam', 'Hauts-Plateaux', 'Koung-Khi', 'Menoua', 'Mifi', 'Ndé', 'Noun'],
    'Sud': ['Dja-et-Lobo', 'Mvila', 'Océan', 'Vallée-du-Ntem'],
    'Sud-Ouest': ['Fako', 'Koupé-Manengouba', 'Lebialem', 'Manyu', 'Meme', 'Ndian']
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = +params['tab'];
      if (!isNaN(tab)) {
        this.selectedTabIndex = tab;
      }
    });
  }

  // CANDIDATE FORM
  candidateForm = new FormGroup({
    // Step 1
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    sex: new FormControl('M', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required, 
      Validators.pattern(/^[0-9]*$/),
      Validators.minLength(8)
    ]),
    password: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/) // Au moins 1 maj, 1 min, 1 chiffre
  ]),
  confirmPassword: new FormControl('', [Validators.required]),
    // Step 2
    profilePhoto: new FormControl(null, [Validators.required]),
  birthCertificate: new FormControl(null, [Validators.required]),
    
    // Step 3
    termsAccepted: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });
// Validateur personnalisé pour vérifier la correspondance des mots de passe
private passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null; // La validation required s'en chargera
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}
// Méthode pour gérer les fichiers du candidat
onCandidateFileChange(event: Event, controlName: string) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.candidateForm.get(controlName)?.setValue(input.files[0]);
  }
}
// Ajoutez un getter pour faciliter l'accès aux contrôles
get candidatePassword() { return this.candidateForm.get('password'); }
get candidateConfirmPassword() { return this.candidateForm.get('confirmPassword'); }
  // PROMOTER FORM
  promoterForm = new FormGroup({
    // Step 1 - Personal Info
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    cniNumber: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
      Validators.minLength(8)
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    residenceCity: new FormControl('', [Validators.required]),
    profession: new FormControl('', [Validators.required]),
    
    // Step 2 - Center Info
    centerName: new FormControl('', [Validators.required]),
    centerAcronym: new FormControl(''),
    centerType: new FormControl('', [Validators.required]),
    centerPhone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]*$/)
    ]),
    centerEmail: new FormControl('', [Validators.email]),
    region: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    fullAddress: new FormControl('', [Validators.required]),
    approvalNumber: new FormControl('', [Validators.required]),
    approvalStart: new FormControl('', [Validators.required]),
    approvalEnd: new FormControl('', [Validators.required]),
    creationYear: new FormControl('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(this.currentYear)
    ]),
    centerAge: new FormControl({value: '', disabled: true}),
    website: new FormControl(''),
    password: new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]),
  confirmPassword: new FormControl('', [
    Validators.required
  ]),
    // Step 3 - Documents
    cniValidUntil: new FormControl('', [Validators.required]),
    cniFile: new FormControl(null, [Validators.required]),
    approvalFile: new FormControl(null, [Validators.required]),
    engagementLetter: new FormControl(null, [Validators.required]),
    promoterPhoto: new FormControl(null, [Validators.required]),
    locationPlan: new FormControl(null),
    statutesFile: new FormControl(null, [Validators.required]),
    
    // Step 4 - Confirmation
    termsAccepted: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });

  // CANDIDATE METHODS
  nextCandidateStep() {
    if (this.currentStepCandidate === 0 && !this.candidateForm.get('fullName')?.valid) {
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires'];
      return;
    }
    this.currentStepCandidate++;
    this.errorMessages = [];
  }

  prevCandidateStep() {
    this.currentStepCandidate--;
    this.errorMessages = [];
  }

  registerCandidate() {
  this.errorMessages = [];
  this.processing = true;
  
  // Créer FormData pour envoyer les fichiers
  const formData = new FormData();
  
  // Ajouter les champs du formulaire
  const formValue = this.candidateForm.value;
  formData.append('firstname', formValue.fullName?.split(' ')[0] || '');
  formData.append('lastname', formValue.fullName?.split(' ').slice(1).join(' ') || '');
  formData.append('email', formValue.email || '');
  formData.append('password', formValue.password || '');
  formData.append('phoneNumber', formValue.phoneNumber || '');
  formData.append('sex', formValue.sex || 'M');
  formData.append('dateOfBirth', formValue.dateOfBirth || '');

  // Ajouter les fichiers s'ils existent
  if (formValue.profilePhoto) {
    formData.append('profilePhoto', formValue.profilePhoto);
  }
  if (formValue.birthCertificate) {
    formData.append('birthCertificate', formValue.birthCertificate);
  }

  // Envoyer les données
  this.authService.registerCandidateWithFiles(formData).subscribe({
    next: (res) => {
      Swal.fire({
        position: 'center',
        text: 'Votre compte a été créé avec succès',
        icon: 'success',
        title: 'Succès',
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['activate-account']);
    },
    error: (err) => {
      this.handleError(err);
    }
  });
}

  // PROMOTER METHODS
  nextPromoterStep() {
    if (this.currentStepPromoter === 0 && !this.promoterForm.get('firstName')?.valid) {
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires'];
      return;
    }
    if (this.currentStepPromoter === 1 && !this.promoterForm.get('centerName')?.valid) {
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires du centre'];
      return;
    }
    this.currentStepPromoter++;
    this.errorMessages = [];
  }

  prevPromoterStep() {
    this.currentStepPromoter--;
    this.errorMessages = [];
  }

  calculateCenterAge() {
    const creationYear = this.promoterForm.value.creationYear;
    if (creationYear) {
      const age = this.currentYear - parseInt(creationYear);
      this.promoterForm.patchValue({ centerAge: age.toString() });
    }
  }

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.promoterForm.get(controlName)?.setValue(input.files[0]);
    }
  }

  registerPromoter() {
    this.errorMessages = [];
    this.processing = true;

    const promoterRequest: CreatePromoterRequest = {
    firstname: this.promoterForm.value.firstName || '',
    lastname: this.promoterForm.value.lastName || '',
    email: this.promoterForm.value.email || '',
    password: this.promoterForm.value.password || '', // Ajout du mot de passe
    phoneNumber: this.promoterForm.value.phone || '',
    nationalIdNumber: this.promoterForm.value.cniNumber || '',
    sex: this.promoterForm.value.gender || 'M',
    dateOfBirth: this.promoterForm.value.birthDate || '',
    address: this.promoterForm.value.residenceCity || '',
    schoolLevel: this.promoterForm.value.profession || ''
  };

    const centerRequest: CreateTainingCenterRequest = {
      fullName: this.promoterForm.value.centerName || '',
      acronym: this.promoterForm.value.centerAcronym || '',
      agreementNumber: this.promoterForm.value.approvalNumber || '',
      startDateOfAgreement: this.promoterForm.value.approvalStart || '',
      endDateOfAgreement: this.promoterForm.value.approvalEnd || '',
      division: this.promoterForm.value.department || '',
      fullAddress: this.promoterForm.value.fullAddress || '',
      centerPresentCandidateForCqp: false, // Update based on form if needed
      centerPresentCandidateForDqp: false  // Update based on form if needed
    };

    const request: CreatePromoterAndCenterRequest = {
      promoter: promoterRequest,
      trainingCenter: centerRequest
    };

    this.authService.createPromoter({ body: request }).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'center',
          text: 'Votre compte promoteur a été créé avec succès',
          icon: 'success',
          title: 'Succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['activate-account']);
      },
      error: (err) => {
        this.processing = false;
        if (err.error.validationErrors) {
          this.errorMessages = err.error.validationErrors;
        } else if (err.error.businessErrorDescription) {
          this.errorMessages = [err.error.businessErrorDescription];
        } else {
          this.errorMessages = ['Une erreur est survenue lors de l\'inscription'];
        }
      }
    });
  }
// Modifiez les méthodes de soumission pour une meilleure gestion des erreurs
private handleError(error: any): void {
  this.processing = false;
  
  if (error.error) {
    if (error.error.validationErrors) {
      this.errorMessages = error.error.validationErrors;
    } else if (error.error.businessErrorDescription) {
      this.errorMessages = [error.error.businessErrorDescription];
    } else if (error.error.message) {
      this.errorMessages = [error.error.message];
    } else {
      this.errorMessages = ['Une erreur technique est survenue'];
    }
  } else {
    this.errorMessages = ['Problème de connexion au serveur'];
  }
  
  // Revenir à la première étape contenant des erreurs
  if (this.selectedTabIndex === 0) {
    this.currentStepCandidate = 0;
  } else {
    this.currentStepPromoter = 0;
  }
}

// Ajoutez cette méthode dans le composant
getFileName(file: File | null): string {
  return file ? file.name : 'Aucun fichier sélectionné';
}
  // COMMON METHODS
  goToLogin() {
    this.router.navigate(['/login']);
  }
}