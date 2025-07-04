import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/services/authentication.service';
import { ApplicationService } from '../services/services/application.service';
import { PaymentService } from '../services/services/payment.service';
import { ExamCenterControllerService } from '../services/services/exam-center-controller.service';
import { TrainingcenterService } from '../services/services/trainingcenter.service';
import { CandidateRegistrationRequest } from '../services/models/candidate-registration-request';
import { ApplicationRequest } from '../services/models/application-request';
import { ExamCenterResponse } from '../services/models/exam-center-response';
import { TrainingCenterResponse } from '../services/models/training-center-response';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  // Nouvelles propriétés pour les listes déroulantes
  examCenters: ExamCenterResponse[] = [];
  trainingCenters: TrainingCenterResponse[] = [];
  
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

  nationalities: string[] = [
    'Camerounaise', 'Sénégalaise', 'Ivoirienne', 'Congolaise', 'Gabonais', 'Nigériane', 'Tchadienne', 'Centrafricaine',
    'Malienne', 'Burkinabé', 'Guinéenne', 'Marocaine', 'Algérienne', 'Tunisienne', 'Béninoise', 'Togolaise',
    'Ghanéenne', 'Sierra-Léonaise', 'Libérienne', 'Égyptienne', 'Sud-Africaine', 'Rwandaise', 'Burundaise',
    'Ougandaise', 'Kenyanne', 'Éthiopienne', 'Erythréenne', 'Espagnole', 'Française', 'Italienne', 'Allemande'
  ].sort();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private applicationService: ApplicationService,
    private paymentService: PaymentService,
    private examCenterService: ExamCenterControllerService,
    private trainingCenterService: TrainingcenterService,
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
      this.promoterForm.patchValue({
        lastName: 'Ekani',
        firstName: 'Jules',
        gender: 'M',
        birthDate: '1979-05-18',
        nationality: 'Camerounaise',
        cniNumber: '8765432109',
        phone: '698112233',
        email: 'jules.ekani@topskills.cm',
        profession: 'Consultant',
        centerName: 'TopSkills Formation',
        centerAcronym: 'TSF',
        centerType: 'PRIVE',
        centerPhone: '650332211',
        creationDate: '2015-10-05',
        centerEmail: 'info@topskills.cm',
        city: 'Yaoundé',
        approvalNumber: 'AG445566',
        approvalStart: '2021-06-01',
        approvalEnd: '2027-06-01',
        departement: 'Mfoundi',
        fullAddress: 'Derrière hôtel Jouvence, Odza',
        residenceCity: 'Yaoundé',
        region: 'Centre',
        cniValidUntil: '2029-05-18',
        isCenterPresentCandidateForCqp: true,
        isCenterPresentCandidateForDqp: false,
        password: 'TopSkills789!',
        confirmPassword: 'TopSkills789!',
        website: 'https://topskills.cm',
        termsAccepted: true
      });
      
    });

    // Charger les données nécessaires
    // this.loadExamCenters();
    // this.loadTrainingCenters();

    this.candidateForm.patchValue({
      lastName: 'Ndiaye',
      firstName: 'Fatou',
      email: 'fatou.ndiaye@example.com',
      phoneNumber: '699112233',
      password: 'MotDePasse123',
      confirmPassword: 'MotDePasse123',
      preferredLanguage: 'fr',
      sex: 'F',
      dateOfBirth: '1998-05-15',
      birthCity: 'Dakar',
      birthDepartment: 'Dakar',
      nationality: 'Sénégalaise',
      originRegion: 'Dakar',
      maritalStatus: 'single',
      childrenCount: 0,
      teachingLanguage: 'fr',
      isFirstAttempt: true,
      examType: 'CQP',
      desiredField: 'Informatique',
      examCenter: '1', // ID du centre d'examen
      examSession: '2025-06',
      trainingMode: 'presentiel',
      fundingSource: 'personal',
      termsAccepted: true
    });
  }

  // Méthodes pour charger les données
  // loadExamCenters(): void {
  //   this.trainingCenterService.getAllTrainingCenters()
  //     .pipe(
  //       switchMap(trainingCentersResponse => {
  //         const divisions = [...new Set(
  //           (trainingCentersResponse.content || [])
  //             .map(tc => tc.division)
  //             .filter((d): d is string => !!d)
  //         )];

  //         if (divisions.length === 0) {
  //           return forkJoin([]);
  //         }

  //         const examCenterRequests = divisions.map(division =>
  //           this.examCenterService.findByName4({ division })
  //         );

  //         return forkJoin(examCenterRequests);
  //       }),
  //       map(responses => {
  //         return responses.flatMap(response => response.content || []);
  //       })
  //     ).subscribe({
  //       next: (centers) => {
  //         this.examCenters = centers;
  //       },
  //       error: (err) => {
  //         console.error('Erreur chargement centres d\'examen:', err);
  //       }
  //     });
  // }

  // loadTrainingCenters(): void {
  //   this.trainingCenterService.getAllTrainingCenters().subscribe({
  //     next: (response) => {
  //       this.trainingCenters = response.content || [];
  //     },
  //     error: (err) => {
  //       console.error('Erreur chargement centres de formation:', err);
  //     }
  //   });
  // }

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
      trainingCenterName: ['', Validators.required],
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
    this.registerCandidate();
  }

  registerCandidate(): void {
    this.processing = true;
    const formValue = this.candidateForm.value;

    // 1. Créer le compte candidat (CandidateRegistrationRequest)
    const registrationRequest: CandidateRegistrationRequest = {
      firstname: formValue.firstName,
      lastname: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      language: formValue.preferredLanguage,
      startYear: this.currentYear.toString(),
      endYear: (this.currentYear + 1).toString(),
      trainingCenterName: formValue.trainingCenterName
    };

    this.authService.register({ body: registrationRequest }).subscribe({
      next: () => {
        // 2. Créer la candidature (ApplicationRequest)
        this.createApplication(formValue);
      },
      error: (err) => {
        this.processing = false;
        this.handleError(err);
      }
    });
  }

  createApplication(formValue: any): void {
    const applicationRequest: ApplicationRequest = {
      academicLevel: formValue.desiredField,
      amount: this.calculateFees(),
      applicationRegion: formValue.birthRegion,
      dateOfBirth: formValue.dateOfBirth,
      departmentOfOrigin: formValue.birthDepartment,
      email: formValue.email,
      examType: formValue.examType,
      financialRessource: formValue.fundingSource,
      formationMode: formValue.trainingMode,
      freeCandidate: false,
      learningLanguage: formValue.teachingLanguage,
      matrimonialSituation: formValue.maritalStatus,
      nationIdNumber: formValue.identityDocument?.name || '',
      nationality: formValue.nationality,
      numberOfKid: formValue.childrenCount,
      paymentMethod: this.selectedPaymentMethod,
      placeOfBirth: formValue.birthCity,
      regionOrigins: formValue.originRegion,
      repeatCandidate: !formValue.isFirstAttempt,
      secretCode: Math.floor(1000 + Math.random() * 9000), // Code secret aléatoire
      sessionYear: formValue.examSession,
      sex: formValue.sex,
      speciality: formValue.desiredField,
      trainingCenterAcronym: formValue.trainingCenterCode
    };

    this.applicationService.candidateAppliance({ body: applicationRequest }).subscribe({
      next: () => {
        // 3. Créer le paiement
        this.createPayment();
      },
      error: (err) => {
        this.processing = false;
        this.handleError(err);
      }
    });
  }

  createPayment(): void {
    const paymentData = {
      amount: this.calculateFees(),
      paymentMethod: this.selectedPaymentMethod,
      secretCode: Math.floor(1000 + Math.random() * 9000)
    };

    this.paymentService.createPayment({ body: paymentData }).subscribe({
      next: () => {
        this.processing = false;
        this.showSuccess('Candidat');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.processing = false;
        this.handleError(err);
      }
    });
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

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.promoterForm.get(controlName)?.setValue(input.files[0]);
      this.promoterForm.get(controlName)?.markAsTouched();
    }
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

  calculateCenterAge(): string {
    const creationDate = this.promoterForm.get('creationDate')?.value;
    if (creationDate) {
      const year = new Date(creationDate).getFullYear();
      return (this.currentYear - year).toString();
    }
    return 'Non renseigné';
  }

  getExamCenterName(examCenterId: string): string {
    const center = this.examCenters.find(c => c.id?.toString() === examCenterId);
    return center ? `${center.name} - ${center.region}` : 'Non spécifié';
  }

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
      timer: 3500,
      
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