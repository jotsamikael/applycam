import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/services/authentication.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';



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

interface CandidateFormData {
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  preferredLanguage: string;
  sex: string;
  dateOfBirth: string;
  birthCity: string;
  birthDepartment: string;
  birthRegion: string;
  nationality: string;
  originRegion: string;
  maritalStatus: string;
  childrenCount: number;
  teachingLanguage: string;
  isFirstAttempt: boolean;
  examType: string;
  desiredField: string;
  trainingCenterCode: string;
  trainingCenterName: string;
  trainingCenterCity: string;
  examSession: string;
  trainingMode: string;
  fundingSource: string;
  birthCertificate: File | null;
  identityDocument: File | null;
  diploma: File | null;
  identityPhotos: File[] | null;
  firstAttemptProof: File | null;
  motivationLetter: File | null;
  termsAccepted: boolean;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
   selectedTabIndex = 0;
  currentStepCandidate = 0;
  candidateSteps = ['Compte', 'Informations', 'Examen', 'Documents', 'Paiement'];
  errorMessages: string[] = [];
  processing = false;
  currentDate = new Date().toISOString().split('T')[0];
  
  selectedPaymentMethod = 'mtn';
 

  currentYear = new Date().getFullYear();

  currentStepPromoter = 0;
  promoterSteps = ['Informations personnelles', 'Informations du centre', 'Documents', 'Confirmation'];
 
fieldsByExamType = {
    'CQP': ['Informatique', 'Comptabilité', 'Marketing'],
    'DQP': ['Génie Civil', 'Génie Electrique', 'Gestion']
  };
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
 paymentMethods = [
    { id: 'mtn', value: 'mtn', label: 'MTN Mobile Money', logo: 'assets/images/mtn.png' },
    { id: 'orange', value: 'orange', label: 'Orange Money', logo: 'assets/images/orange.png' }
  ];
  candidateForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    
    private datePipe: DatePipe
  ) {
    this.candidateForm = this.createCandidateForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = +params['tab'];
      if (!isNaN(tab)) {
        this.selectedTabIndex = tab;
      }
    });

  }

  // CANDIDATE FORM
  createCandidateForm(): FormGroup {
    return this.fb.group({
      // Step 1: Account
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{9,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', Validators.required],
      preferredLanguage: ['fr'],

      // Step 2: Personal Info
      sex: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      birthCity: ['', Validators.required],
      birthDepartment: ['', Validators.required],
      birthRegion: ['', Validators.required],
      nationality: ['', Validators.required],
      originRegion: ['', Validators.required],
      maritalStatus: [''],
      childrenCount: [0],
      teachingLanguage: ['fr', Validators.required],

      // Step 3: Exam Info
      isFirstAttempt: ['', Validators.required],
      examType: ['', Validators.required],
      desiredField: ['', Validators.required],
      trainingCenterCode: [''],
      trainingCenterName: [''],
      trainingCenterCity: [''],
      examSession: ['', Validators.required],
      trainingMode: ['', Validators.required],
      fundingSource: ['', Validators.required],

      // Step 4: Documents
      birthCertificate: [null, Validators.required],
      identityDocument: [null, Validators.required],
      diploma: [null, Validators.required],
      identityPhotos: [null, Validators.required],
      firstAttemptProof: [null],
      motivationLetter: [null],

      // Step 5: Terms
      termsAccepted: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }
   passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
  onCandidateFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      if (controlName === 'identityPhotos') {
        this.candidateForm.get(controlName)?.setValue(Array.from(input.files));
      } else {
        this.candidateForm.get(controlName)?.setValue(input.files[0]);
      }
      this.candidateForm.get(controlName)?.markAsTouched();
    }
  }

  nextCandidateStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStepCandidate++;
      window.scrollTo(0, 0);
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStepCandidate) {
      case 0: // Account
        return this.candidateForm.get('lastName')?.valid &&
               this.candidateForm.get('firstName')?.valid &&
               this.candidateForm.get('email')?.valid &&
               this.candidateForm.get('phoneNumber')?.valid &&
               this.candidateForm.get('password')?.valid &&
               this.candidateForm.get('confirmPassword')?.valid;
      
      case 1: // Personal Info
        return this.candidateForm.get('sex')?.valid &&
               this.candidateForm.get('dateOfBirth')?.valid &&
               this.candidateForm.get('birthCity')?.valid &&
               this.candidateForm.get('birthDepartment')?.valid &&
               this.candidateForm.get('birthRegion')?.valid &&
               this.candidateForm.get('nationality')?.valid &&
               this.candidateForm.get('originRegion')?.valid &&
               this.candidateForm.get('teachingLanguage')?.valid;
      
      case 2: // Exam Info
        return this.candidateForm.get('isFirstAttempt')?.valid &&
               this.candidateForm.get('examType')?.valid &&
               this.candidateForm.get('desiredField')?.valid &&
               this.candidateForm.get('examSession')?.valid &&
               this.candidateForm.get('trainingMode')?.valid &&
               this.candidateForm.get('fundingSource')?.valid;
      
      case 3: // Documents
        return this.candidateForm.get('birthCertificate')?.valid &&
               this.candidateForm.get('identityDocument')?.valid &&
               this.candidateForm.get('diploma')?.valid &&
               this.candidateForm.get('identityPhotos')?.valid;
      
      default:
        return true;
    }
  }

  markCurrentStepAsTouched(): void {
    const controls = this.candidateForm.controls;
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (this.isFieldInCurrentStep(key)) {
        control.markAsTouched();
      }
    });
  }

  isFieldInCurrentStep(fieldName: string): boolean {
    switch (this.currentStepCandidate) {
      case 0: // Account
        return ['lastName', 'firstName', 'email', 'phoneNumber', 'password', 'confirmPassword', 'preferredLanguage'].includes(fieldName);
      case 1: // Personal Info
        return ['sex', 'dateOfBirth', 'birthCity', 'birthDepartment', 'birthRegion', 
               'nationality', 'originRegion', 'maritalStatus', 'childrenCount', 'teachingLanguage'].includes(fieldName);
      case 2: // Exam Info
        return ['isFirstAttempt', 'examType', 'desiredField', 'trainingCenterCode', 
               'trainingCenterName', 'trainingCenterCity', 'examSession', 'trainingMode', 'fundingSource'].includes(fieldName);
      case 3: // Documents
        return ['birthCertificate', 'identityDocument', 'diploma', 'identityPhotos', 
               'firstAttemptProof', 'motivationLetter'].includes(fieldName);
      default:
        return false;
    }
  }

  prevCandidateStep(): void {
    this.currentStepCandidate--;
    window.scrollTo(0, 0);
  }

  calculateFees(): number {
    return this.candidateForm.value.examType === 'CQP' ? 25000 : 35000;
  }

  processPayment(): void {
    if (this.candidateForm.invalid || !this.candidateForm.value.termsAccepted) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez compléter tous les champs requis et accepter les conditions'
      });
      return;
    }

    this.processing = true;
    setTimeout(() => {
      this.registerCandidate();
    }, 2000);
  }

  registerCandidate(): void {
    this.processing = true;
    const formValue = this.candidateForm.value;

    // Map formValue to CandidateRegistrationRequest as needed
    const candidateRequest: any = {
      ...formValue,
      // Map/rename fields if necessary to match CandidateRegistrationRequest
      // Example: firstname: formValue.firstName, lastname: formValue.lastName, etc.
    };

    this.authService.register({ body: candidateRequest }).subscribe({
      next: () => {
        this.processing = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Inscription réussie!',
          text: 'Un email de confirmation a été envoyé',
          showConfirmButton: false,
          timer: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.processing = false;
        this.handleError(err);
      }
    });
  }

  prepareCandidateFormData(): FormData {
    const formData = new FormData();
    const formValue = this.candidateForm.value;

    // Add all simple fields
    Object.keys(formValue).forEach(key => {
      if (!['birthCertificate', 'identityDocument', 'diploma', 
           'identityPhotos', 'firstAttemptProof', 'motivationLetter'].includes(key)) {
        const value = formValue[key];
        if (value instanceof Date) {
          formData.append(key, this.datePipe.transform(value, 'yyyy-MM-dd') || '');
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });

    // Add files
    this.addFileToFormData(formData, 'birthCertificate');
    this.addFileToFormData(formData, 'identityDocument');
    this.addFileToFormData(formData, 'diploma');
    this.addFilesToFormData(formData, 'identityPhotos');
    this.addFileToFormData(formData, 'firstAttemptProof');
    this.addFileToFormData(formData, 'motivationLetter');

    // Add payment info
    formData.append('paymentMethod', this.selectedPaymentMethod);
    formData.append('amount', this.calculateFees().toString());

    return formData;
  }

  addFileToFormData(formData: FormData, field: string): void {
    const file = this.candidateForm.get(field)?.value;
    if (file) {
      formData.append(field, file, file.name);
    }
  }

  addFilesToFormData(formData: FormData, field: string): void {
    const files = this.candidateForm.get(field)?.value;
    if (files && files.length) {
      files.forEach((file: File, index: number) => {
        formData.append(`${field}_${index}`, file, file.name);
      });
    }
  }

 
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

  // private passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
  //   const password = form.get('password')?.value;
  //   const confirmPassword = form.get('confirmPassword')?.value;
  //   return password === confirmPassword ? null : { passwordMismatch: true };
  // }

  // onCandidateFileChange(event: Event, controlName: string): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files?.length) {
  //     this.candidateForm.get(controlName)?.setValue(input.files[0]);
  //     this.candidateForm.get(controlName)?.markAsTouched();
  //   }
  // }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.promoterForm.get(controlName)?.setValue(input.files[0]);
      this.promoterForm.get(controlName)?.markAsTouched();
    }
  }

  // nextCandidateStep(): void {
  //   if (this.currentStepCandidate === 0 && !this.validateCandidateStep1()) {
  //     return;
  //   }
  //   if (this.currentStepCandidate === 1 && !this.validateCandidateStep2()) {
  //     return;
  //   }
  //   this.currentStepCandidate++;
  //   this.errorMessages = [];
  // }

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

//   prevCandidateStep(): void {
//     this.currentStepCandidate--;
//     this.errorMessages = [];
//   }
// // 
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

  // registerCandidate(): void {
  //   this.errorMessages = [];
  //   console.log('[registerCandidate] Début');

  //   if (this.candidateForm.invalid) {
  //     this.markAllAsTouched(this.candidateForm);
  //     this.errorMessages = ['Veuillez corriger les erreurs dans le formulaire'];
  //     console.log('[registerCandidate] Formulaire invalide', this.candidateForm.value);
  //     return;
  //   }

  //   this.processing = true;

  //   const formValue = this.candidateForm.value as unknown as CandidateFormData;
  //   console.log('[registerCandidate] formValue', formValue);

  //   try {
  //     // Split full name into first and last names
  //     const nameParts = formValue.fullName.split(' ');
  //     const firstName = nameParts[0] || '';
  //     const lastName = nameParts.slice(1).join(' ') || '';

  //     const requestBody: any = {
  //       firstname: firstName,
  //       lastname: lastName,
  //       email: formValue.email || '',
  //       password: formValue.password || '',
  //       phoneNumber: formValue.phoneNumber || '',
  //       sex: formValue.sex || 'M',
  //       dateOfBirth: formValue.dateOfBirth || '',
  //     };

  //     console.log('[registerCandidate] requestBody envoyé', requestBody);

  //     this.authService.register({ body: requestBody }).subscribe({
  //       next: () => {
  //         console.log('[registerCandidate] Succès');
  //         this.showSuccess('Candidat');
  //         this.router.navigate(['activate-account']);
  //       },
  //       error: (err) => {
  //         console.error('[registerCandidate] Erreur', err);
  //         this.handleError(err);
  //         this.processing = false;
  //       },
  //       complete: () => {
  //         console.log('[registerCandidate] Complete');
  //         this.processing = false;
  //       }
  //     });
  //   } catch (error) {
  //     console.error('[registerCandidate] Exception', error);
  //     this.errorMessages = [error instanceof Error ? error.message : 'Erreur inconnue'];
  //     this.processing = false;
  //   }
  // }

  registerPromoter(): void {
    this.errorMessages = [];
    if (this.promoterForm.invalid) {
      this.markAllAsTouched(this.promoterForm);
      this.errorMessages = ['Veuillez corriger les erreurs dans le formulaire'];
      return;
    }
    this.processing = true;

    const formValue = this.promoterForm.getRawValue() as PromoterFormData;

    // 1. Envoi des infos promoteur/centre (JSON)
    this.authService.createPromoter({ body: formValue}).subscribe({
      next: () => {
        // 2. Préparer FormData pour les fichiers
        const formData = new FormData();
        if (formValue.cniFile) formData.append('cniFile', formValue.cniFile);
        if (formValue.approvalFile) formData.append('approvalFile', formValue.approvalFile);
        if (formValue.engagementLetter) formData.append('engagementLetter', formValue.engagementLetter);
        if (formValue.promoterPhoto) formData.append('promoterPhoto', formValue.promoterPhoto);
        if (formValue.internalRegulation) formData.append('internalRegulation', formValue.internalRegulation);
        if (formValue.locationPlan) formData.append('locationPlan', formValue.locationPlan);

        // 3. Appel uploadPromoterFile (renseigne bien les paramètres)
        this.authService.uploadPromoterFile({
          'approval-Number': formValue.approvalNumber,
          email: formValue.email,
          centerMail: formValue.centerEmail,
          body: {
            cniFile: formValue.cniFile,
            approvalFile: formValue.approvalFile,
            engagementLetter: formValue.engagementLetter,
            promoterPhoto: formValue.promoterPhoto,
            internalRegulation: formValue.internalRegulation,
            locationPlan: formValue.locationPlan
          }
        }).subscribe({
          next: () => {
            this.showSuccess('Promoteur');
            this.router.navigate(['login']);
          },
          error: (err) => {
            this.processing = false;
            if (err.error && err.error.businessErrorDescription) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.error.businessErrorDescription
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur technique est survenue'
              });
            }
          },
          complete: () => {
            this.processing = false;
          }
        });
      },
      error: (err) => {
        this.processing = false;
        if (err.error && err.error.businessErrorDescription) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error.businessErrorDescription
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur technique est survenue'
          });
        }
      }
    });
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
      
      icon: 'success',
      title: 'Succès',
      showConfirmButton: false,
      timer: 1500,
      
      html: `<div style='text-align:left'>
      <p>Votre compte promoteur a été créé avec succès.</p>
      <p>Après vérification de vos documents, vous recevrez un mail de confirmation lorsque votre compte sera activé.</p>
      <p>Vous pourrez alors vous connecter sur la plateforme.</p>
    </div>`,
    
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