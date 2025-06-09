import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/services/authentication.service';
import Swal from 'sweetalert2';

interface CandidateFormData {
  fullName: string;
  email: string;
  sex: string;
  dateOfBirth: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  birthCertificate: File | null;
  termsAccepted: boolean;
}

interface PromoterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  cniNumber: string;
  profession: string;
  birthDate: string;
  residenceCity: string;
  gender: string;
  password: string;
  confirmPassword: string;

  centerName: string;
  centerAcronym: string;
  centerType: string;
  centerPhone: string;
  centerEmail: string;
  creationDate: string; // ⚠️
  website: string;
  departement: string; // ⚠️
  city: string;
  region: string;
  fullAddress: string;
  isCenterPresentCandidateForCqp: boolean;
  isCenterPresentCandidateForDqp: boolean;

  cniFile: File | null;
  approvalFile: File | null;
  promoterPhoto: File | null;
  engagementLetter: File | null;
  locationPlan: File | null;
  internalRegulation: File | null; // ⚠️

  cniValidUntil: string;
  approvalStart: string;
  approvalEnd: string;
  approvalNumber: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  currentStepCandidate = 0;
  candidateSteps = ['Informations personnelles', 'Documents', 'Confirmation'];
  errorMessages: string[] = [];
  processing = false;
  currentYear = new Date().getFullYear();

  currentStepPromoter = 0;
  promoterSteps = ['Informations personnelles', 'Informations du centre', 'Documents', 'Confirmation'];
  selectedTabIndex = 0;

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

    this.promoterForm.patchValue({
      lastName: 'Doe',
      firstName: 'John',
      gender: 'M',
      birthDate: '1990-01-01',
      nationality: 'Camerounaise',
      cniNumber: '123456789',
      phone: '699999999',
      email: 'john.doe@email.com',
      profession: 'Licence',
      centerName: 'Centre Test',
      centerAcronym: 'CTEST',
      centerType: 'PRIVATE',
      centerPhone: '22222222',
      creationDate: '2010',
      centerEmail: 'centre@email.com',
      city: 'Yaoundé',
      approvalNumber: 'AG12345',
      approvalStart: '2024-01-01',
      approvalEnd: '2026-01-01',
      departement: 'Mfoundi',
      fullAddress: '123 rue du test, Quartier Test',
      residenceCity: 'Yaoundé',
      region: 'Centre',
      cniValidUntil: '2030-01-01',
      isCenterPresentCandidateForCqp: true,
      isCenterPresentCandidateForDqp: false,
      password: 'Password123',
      confirmPassword: 'Password123',
      website: 'https://test.com',
      termsAccepted: true
    });
  }

  // CANDIDATE FORM
  candidateForm = new FormGroup({
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
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    profilePhoto: new FormControl(null, [Validators.required]),
    birthCertificate: new FormControl(null, [Validators.required]),
    termsAccepted: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });

  // PROMOTER FORM
  promoterForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    cniNumber: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    profession: new FormControl('', [Validators.required]), // schoolLevel
    centerName: new FormControl('', [Validators.required]), // fullName
    centerAcronym: new FormControl('', [Validators.required]), // acronym
    centerType: new FormControl('', [Validators.required]),
    centerPhone: new FormControl('', [Validators.required]),
    centerEmail: new FormControl('', [Validators.required, Validators.email]),
    city: new FormControl('', [Validators.required]),
    approvalNumber: new FormControl('', [Validators.required]),
    approvalStart: new FormControl('', [Validators.required]),
    approvalEnd: new FormControl('', [Validators.required]),
    departement: new FormControl('', [Validators.required]), // division
    fullAddress: new FormControl('', [Validators.required]),
    residenceCity: new FormControl('', [Validators.required]), // address
    region: new FormControl('', [Validators.required]),
    creationDate: new FormControl('', [Validators.required]),
    cniValidUntil: new FormControl('', [Validators.required]),
    isCenterPresentCandidateForCqp: new FormControl(false, [Validators.required]),
    isCenterPresentCandidateForDqp: new FormControl(false, [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
    // Fichiers
    cniFile: new FormControl(null, [Validators.required]),
    approvalFile: new FormControl(null, [Validators.required]),
    engagementLetter: new FormControl(null, [Validators.required]),
    promoterPhoto: new FormControl(null, [Validators.required]),
    internalRegulation: new FormControl(null, [Validators.required]),
    locationPlan: new FormControl(null),
    website: new FormControl(''),
    termsAccepted: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onCandidateFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.candidateForm.get(controlName)?.setValue(input.files[0]);
      this.candidateForm.get(controlName)?.markAsTouched();
    }
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.promoterForm.get(controlName)?.setValue(input.files[0]);
      this.promoterForm.get(controlName)?.markAsTouched();
    }
  }

  nextCandidateStep(): void {
    if (this.currentStepCandidate === 0 && !this.validateCandidateStep1()) {
      return;
    }
    if (this.currentStepCandidate === 1 && !this.validateCandidateStep2()) {
      return;
    }
    this.currentStepCandidate++;
    this.errorMessages = [];
  }

  private validateCandidateStep1(): boolean {
    const requiredFields = ['fullName', 'email', 'sex', 'dateOfBirth', 'phoneNumber'];
    const invalidFields = requiredFields.filter(field => 
      this.candidateForm.get(field)?.invalid
    );

    if (invalidFields.length) {
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires'];
      this.markFieldsAsTouched(this.candidateForm, requiredFields);
      return false;
    }
    return true;
  }

  private validateCandidateStep2(): boolean {
    if (this.candidateForm.invalid) {
      this.errorMessages = ['Veuillez compléter tous les champs requis'];
      this.markAllAsTouched(this.candidateForm);
      return false;
    }
    return true;
  }

  prevCandidateStep(): void {
    this.currentStepCandidate--;
    this.errorMessages = [];
  }

  nextPromoterStep(): void {
    if (this.currentStepPromoter === 0 && !this.validatePromoterStep1()) {
      return;
    }
    if (this.currentStepPromoter === 1 && !this.validatePromoterStep2()) {
      return;
    }
    if (this.currentStepPromoter === 2 && !this.validatePromoterStep3()) {
      return;
    }
    this.currentStepPromoter++;
    this.errorMessages = [];
  }

  private validatePromoterStep1(): boolean {
    const requiredFields = ['firstName', 'lastName', 'gender', 'birthDate', 'nationality', 
                          'cniNumber', 'phone', 'email', 'residenceCity', 'profession'];
    const invalidFields = requiredFields.filter(field => 
      this.promoterForm.get(field)?.invalid
    );

    if (invalidFields.length) {
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires'];
      this.markFieldsAsTouched(this.promoterForm, requiredFields);
      return false;
    }
    return true;
  }

  private validatePromoterStep2(): boolean {
    const requiredFields = ['centerName', 'centerType', 'centerPhone', 'region', 
                          'departement', 'city', 'fullAddress', 'approvalNumber',
                          'approvalStart', 'approvalEnd', 'creationDate'];
    const invalidFields = requiredFields.filter(field => 
      this.promoterForm.get(field)?.invalid
    );

    if (invalidFields.length) {
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires du centre'];
      this.markFieldsAsTouched(this.promoterForm, requiredFields);
      return false;
    }
    return true;
  }

  private validatePromoterStep3(): boolean {
    const requiredFiles = ['cniFile', 'approvalFile', 'engagementLetter', 
                         'promoterPhoto', 'internalRegulation'];
    const missingFiles = requiredFiles.filter(file => 
      !this.promoterForm.get(file)?.value
    );

    if (missingFiles.length) {
      this.errorMessages = ['Veuillez télécharger tous les documents obligatoires'];
      this.markFieldsAsTouched(this.promoterForm, requiredFiles);
      return false;
    }
    return true;
  }

  prevPromoterStep(): void {
    this.currentStepPromoter--;
    this.errorMessages = [];
  }

  calculateCenterAge(): number | null {
    const creationYear = this.promoterForm.get('creationYear')?.value;
    if (creationYear) {
      return this.currentYear - parseInt(creationYear, 10);
    }
    return null;
  }

  registerCandidate(): void {
    this.errorMessages = [];
    console.log('[registerCandidate] Début');

    if (this.candidateForm.invalid) {
      this.markAllAsTouched(this.candidateForm);
      this.errorMessages = ['Veuillez corriger les erreurs dans le formulaire'];
      console.log('[registerCandidate] Formulaire invalide', this.candidateForm.value);
      return;
    }

    this.processing = true;

    const formValue = this.candidateForm.value as unknown as CandidateFormData;
    console.log('[registerCandidate] formValue', formValue);

    try {
      // Split full name into first and last names
      const nameParts = formValue.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const requestBody: any = {
        firstname: firstName,
        lastname: lastName,
        email: formValue.email || '',
        password: formValue.password || '',
        phoneNumber: formValue.phoneNumber || '',
        sex: formValue.sex || 'M',
        dateOfBirth: formValue.dateOfBirth || '',
      };

      console.log('[registerCandidate] requestBody envoyé', requestBody);

      this.authService.register({ body: requestBody }).subscribe({
        next: () => {
          console.log('[registerCandidate] Succès');
          this.showSuccess('Candidat');
          this.router.navigate(['activate-account']);
        },
        error: (err) => {
          console.error('[registerCandidate] Erreur', err);
          this.handleError(err);
          this.processing = false;
        },
        complete: () => {
          console.log('[registerCandidate] Complete');
          this.processing = false;
        }
      });
    } catch (error) {
      console.error('[registerCandidate] Exception', error);
      this.errorMessages = [error instanceof Error ? error.message : 'Erreur inconnue'];
      this.processing = false;
    }
  }

  registerPromoter(): void {
    this.errorMessages = [];
    console.log('[registerPromoter] Début');

    if (this.promoterForm.invalid) {
      this.markAllAsTouched(this.promoterForm);
      this.errorMessages = ['Veuillez corriger les erreurs dans le formulaire'];
      console.log('[registerPromoter] Formulaire invalide', this.promoterForm.value);
      return;
    }

    this.processing = true;

    const formValue = this.promoterForm.getRawValue() as PromoterFormData;
    console.log('[registerPromoter] formValue', formValue);

    const formData = new FormData();

    try {
      const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      // Map form fields to DTO fields
      formData.append('firstName', formValue.firstName);
      formData.append('lastName', formValue.lastName);
      formData.append('email', formValue.email);
      formData.append('phone', formValue.phone);
      formData.append('nationality', formValue.nationality);
      formData.append('cniNumber', formValue.cniNumber);
      formData.append('profession', formValue.profession);
      formData.append('birthDate', formValue.birthDate); // format YYYY-MM-DD
      formData.append('residenceCity', formValue.residenceCity);
      formData.append('gender', formValue.gender);
      formData.append('password', formValue.password);
      formData.append('confirmPassword', formValue.confirmPassword);
      formData.append('centerName', formValue.centerName);
      formData.append('centerAcronym', formValue.centerAcronym);
      formData.append('centerType', formValue.centerType);
      formData.append('centerPhone', formValue.centerPhone);
      formData.append('centerEmail', formValue.centerEmail);
      formData.append('creationDate', formValue.creationDate); // format YYYY-MM-DD
      formData.append('website', formValue.website);
      formData.append('departement', formValue.departement);
      formData.append('city', formValue.city);
      formData.append('region', formValue.region);
      formData.append('fullAddress', formValue.fullAddress);
      formData.append('isCenterPresentCandidateForCqp', String(formValue.isCenterPresentCandidateForCqp));
      formData.append('isCenterPresentCandidateForDqp', String(formValue.isCenterPresentCandidateForDqp));
      formData.append('cniValidUntil', formValue.cniValidUntil); // format YYYY-MM-DD
      formData.append('approvalStart', formValue.approvalStart); // format YYYY-MM-DD
      formData.append('approvalEnd', formValue.approvalEnd); // format YYYY-MM-DD
      formData.append('approvalNumber', formValue.approvalNumber);

      if (formValue.cniFile) formData.append('cniFile', formValue.cniFile, formValue.cniFile.name);
      if (formValue.approvalFile) formData.append('approvalFile', formValue.approvalFile, formValue.approvalFile.name);
      if (formValue.promoterPhoto) formData.append('promoterPhoto', formValue.promoterPhoto, formValue.promoterPhoto.name);
      if (formValue.engagementLetter) formData.append('engagementLetter', formValue.engagementLetter, formValue.engagementLetter.name);
      if (formValue.locationPlan) formData.append('locationPlan', formValue.locationPlan, formValue.locationPlan.name);
      if (formValue.internalRegulation) formData.append('internalRegulation', formValue.internalRegulation, formValue.internalRegulation.name);

      // Pour voir ce qu'il y a dans le FormData :
      for (const pair of (formData as any).entries()) {
        console.log(`[registerPromoter] FormData: ${pair[0]}`, pair[1]);
      }
console.log('[registerPromoter] Payload envoyé :', this.promoterForm.value);

      this.authService.createPromoter({ body: formData as any }).subscribe({
        next: () => {
          console.log('[registerPromoter] Succès');
          this.showSuccess('Promoteur');
          this.router.navigate(['activate-account']);
        },
        error: (err) => {
          console.error('[registerPromoter] Erreur', err);
          this.handleError(err);
          this.processing = false;
        },
        complete: () => {
          console.log('[registerPromoter] Complete');
          this.processing = false;
        }
      });
    } catch (error) {
      console.error('[registerPromoter] Exception', error);
      this.errorMessages = [error instanceof Error ? error.message : 'Erreur inconnue'];
      this.processing = false;
    }
  }

  private markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  private markFieldsAsTouched(formGroup: FormGroup, fields: string[]): void {
    fields.forEach(field => {
      formGroup.get(field)?.markAsTouched();
    });
  }

  private showSuccess(userType: string): void {
    Swal.fire({
      position: 'center',
      text: `Votre compte ${userType} a été créé avec succès`,
      icon: 'success',
      title: 'Succès',
      showConfirmButton: false,
      timer: 1500
    });
  }

  private handleError(error: any): void {
    this.processing = false;
    console.error('Registration error:', error);
    
    if (error.status === 400 && error.error?.validationErrors) {
      this.errorMessages = error.error.validationErrors;
    } else if (error.error?.message) {
      this.errorMessages = [error.error.message];
    } else if (error.message) {
      this.errorMessages = [error.message];
    } else {
      this.errorMessages = ['Une erreur technique est survenue'];
    }
  }

  getFileName(file: File | null): string {
    return file?.name || 'Aucun fichier sélectionné';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}