import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/services/authentication.service';

import { ExamCenterControllerService } from '../services/services/exam-center-controller.service';
import { TrainingcenterService } from '../services/services/trainingcenter.service';
import { SpecialityService } from '../services/services/speciality.service';
import { CourseService } from '../services/services/course.service';

import { CandidateRegistrationRequest } from '../services/models/candidate-registration-request';

import { ExamCenterResponse } from '../services/models/exam-center-response';
import { TrainingCenterResponse } from '../services/models/training-center-response';
import { SpecialityResponse } from '../services/models/speciality-response';
import { SessionResponse } from '../services/models/session-response';
import { CourseResponse } from '../services/models/course-response';
import { CourseWithSpecialitiesResponse } from '../services/models/course-with-specialities-response';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { TokenService } from '../services/token/token.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  specialities: SpecialityResponse[] = [];
  sessions: SessionResponse[] = [];
  courses: CourseWithSpecialitiesResponse[] = [];
  
  // Propriétés pour la gestion des spécialités
  selectedSpecialities: SpecialityResponse[] = [];
  isCreatingSpeciality = false;
  newSpecialityForm: FormGroup;
  specialitySearchTerm = '';
  filteredSpecialities: SpecialityResponse[] = [];
  specialitySearchCtrl = new FormControl('');
  filteredSpecialities$: Observable<SpecialityResponse[]> = of([]);
  
  // Propriétés pour la gestion des cours et spécialités par filière
  selectedCourses: CourseWithSpecialitiesResponse[] = [];
  selectedCourseSpecialities: { [courseName: string]: SpecialityResponse[] } = {};
  courseSearchCtrl = new FormControl('');
  filteredCourses$: Observable<CourseWithSpecialitiesResponse[]> = of([]);
  isCreatingSpecialityForCourse = false;
  currentCourseForSpeciality: CourseWithSpecialitiesResponse | null = null;
  
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

  // Propriétés pour gérer l'inscription
  candidateAccountCreated = false;
  candidateAccountId: string | null = null;
  personalInfoUpdated = false;
  applicationCreated = false;
  applicationId: string | null = null;
  documentsUploaded = false;
  paymentCompleted = false;

  trainingCenterCtrl = new FormControl('');
  filteredTrainingCenters: Observable<any[]> = of([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
   
    private trainingCenterService: TrainingcenterService,
    private specialityService: SpecialityService,
    private courseService: CourseService,
   
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private tokenService: TokenService
  ) {
    this.candidateForm = this.createCandidateForm();
    this.newSpecialityForm = this.createNewSpecialityForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = +params['tab'];
      if (!isNaN(tab)) {
        this.selectedTabIndex = tab;
      }
      this.promoterForm.patchValue({
        lastName: 'Ngo\'o',
        firstName: 'Daniel',
        gender: 'M',
        birthDate: '1985-08-10',
        nationality: 'Camerounaise',
        cniNumber: '9988776655',
        phone: '677223344',
        email: 'daniel.ngoo@aftech.cm',
        profession: 'Ingénieur',
        centerName: 'AFTECH Training Center',
        centerAcronym: 'AFTC',
        centerType: 'PRIVE',
        centerPhone: '655441122',
        creationDate: '2017-03-15',
        centerEmail: 'info@aftech.cm',
        city: 'Douala',
        approvalNumber: 'AG778899',
        approvalStart: '2021-09-01',
        approvalEnd: '2025-08-31',
        departement: 'Wouri',
        fullAddress: 'Rue des technologies, Bonamoussadi',
        residenceCity: 'Douala',
        region: 'Littoral',
        cniValidUntil: '2029-08-10',
        isCenterPresentCandidateForCqp: true,
        isCenterPresentCandidateForDqp: true,
        password: 'Aftech2024!',
        confirmPassword: 'Aftech2024!',
        website: 'https://aftech.cm',
        termsAccepted: true
      });
    });

    // Charger les filières et leurs spécialités (remplace loadCourses)
    this.loadCoursesWithSpecialities();
    this.loadTrainingCenters();
    this.loadSpecialities();
    
    // Autocomplete filtering
    this.filteredTrainingCenters = this.trainingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTrainingCenters(value || ''))
    );

    // Filtrage des spécialités en temps réel
    this.filteredSpecialities$ = this.specialitySearchCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSpecialities(value || ''))
    );

    // Filtrage des cours en temps réel
    this.filteredCourses$ = this.courseSearchCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCourses(value || ''))
    );
  }

  // Nouvelle méthode pour charger filières + spécialités
  loadCoursesWithSpecialities(): void {
    this.authService.getAllCoursesWithSpecialitiesPaged({ offset: 0, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.courses = response.content || [];
        // Met à jour l'autocomplete des filières si besoin
        this.filteredCourses$ = this.courseSearchCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCourses(value || ''))
        );
      },
      error: (err) => {
        console.error('Erreur chargement cours:', err);
        Swal.fire({
          icon: 'warning',
          title: 'Attention',
          text: 'Impossible de charger les filières. Veuillez réessayer plus tard.',
          confirmButtonText: 'Compris'
        });
      }
    });
  }

  private _filterCourses(value: any): CourseWithSpecialitiesResponse[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.courses.filter(course =>
      (course.courseName && course.courseName.toLowerCase().includes(filterValue))
    );
  }

  displayCourse(course: CourseWithSpecialitiesResponse): string {
    return course && course.courseName ? course.courseName : '';
  }

  onCourseSelected(course: CourseWithSpecialitiesResponse): void {
    if (!this.selectedCourses.find(c => c.courseName === course.courseName)) {
      this.selectedCourses.push(course);
      // Affiche uniquement les spécialités de la filière sélectionnée
      if (course.specialities && course.specialities.length > 0) {
        this.selectedCourseSpecialities[course.courseName || ''] = course.specialities;
        this.specialitySearchCtrl.setValue(''); // reset le champ
      } else {
        this.selectedCourseSpecialities[course.courseName || ''] = [];
        Swal.fire({
          icon: 'info',
          title: 'Aucune spécialité',
          text: `La filière "${course.courseName}" n'a pas encore de spécialité. Vous pouvez en ajouter.`,
          confirmButtonText: 'OK'
        });
      }
      this.courseSearchCtrl.setValue('');
      Swal.fire({
        icon: 'success',
        title: 'Filière ajoutée',
        text: `La filière "${course.courseName}" a été ajoutée à votre sélection.`,
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Filière déjà sélectionnée',
        text: 'Cette filière est déjà dans votre liste.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  removeCourse(course: CourseWithSpecialitiesResponse): void {
    this.selectedCourses = this.selectedCourses.filter(c => c.courseName !== course.courseName);
    delete this.selectedCourseSpecialities[course.courseName || ''];
  }

  onSpecialitySelectedForCourse(speciality: SpecialityResponse, course: CourseWithSpecialitiesResponse): void {
    const courseName = course.courseName || '';
    if (!this.selectedCourseSpecialities[courseName].find(s => s.id === speciality.id)) {
      this.selectedCourseSpecialities[courseName].push(speciality);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Spécialité déjà sélectionnée',
        text: 'Cette spécialité est déjà dans la liste de cette filière.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  removeSpecialityFromCourse(speciality: SpecialityResponse, course: CourseWithSpecialitiesResponse): void {
    const courseName = course.courseName || '';
    this.selectedCourseSpecialities[courseName] = this.selectedCourseSpecialities[courseName].filter(s => s.id !== speciality.id);
  }

  showCreateSpecialityFormForCourse(course: CourseWithSpecialitiesResponse): void {
    const approvalNumber = this.promoterForm.get('approvalNumber')?.value;
    if (!approvalNumber || approvalNumber.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Numéro d\'agrément requis',
        text: 'Veuillez d\'abord saisir le numéro d\'agrément de votre centre avant de créer une nouvelle spécialité.',
        confirmButtonText: 'Compris'
      });
      this.promoterForm.get('approvalNumber')?.markAsTouched();
      return;
    }
    
    this.isCreatingSpecialityForCourse = true;
    this.currentCourseForSpeciality = course;
    
    // Pré-remplir le nom avec le terme de recherche si disponible
    if (this.specialitySearchTerm && this.specialitySearchTerm.trim() !== '') {
      this.newSpecialityForm.patchValue({
        name: this.specialitySearchTerm.trim()
      });
    }
  }

  hideCreateSpecialityFormForCourse(): void {
    this.isCreatingSpecialityForCourse = false;
    this.currentCourseForSpeciality = null;
    this.newSpecialityForm.reset();
  }

  createNewSpecialityForCourse(): void {
    if (this.newSpecialityForm.invalid || !this.currentCourseForSpeciality) {
      return;
    }

    const formValue = this.newSpecialityForm.value;
    
    // Générer automatiquement le code de la spécialité
    const generatedCode = this.generateSpecialityCode(formValue.name);
    
    const createSpecialityRequest = {
      code: generatedCode, // Utilise le code généré automatiquement
      name: formValue.name,
      description: formValue.description || '',
      examType: formValue.examType
    };

    console.log('Création spécialité pour filière:', createSpecialityRequest);

    // Nettoyer et valider le nom de la filière
    const courseName = this.currentCourseForSpeciality?.courseName || '';
    const validation = this.validateAndCleanCourseName(courseName);
    if (!validation.isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Nom de filière invalide',
        text: validation.errorMessage || 'Nom de filière invalide',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.authService.createAndLinkSpecialityToTrainingCenter({
      courseName: validation.cleanName,
      agreementNumber: this.promoterForm.get('approvalNumber')?.value,
      body: createSpecialityRequest
    }).subscribe({
      next: (response) => {
        console.log('Réponse création spécialité:', response);
        
        // Créer un objet spécialité temporaire pour l'ajouter à la sélection
        const newSpeciality: SpecialityResponse = {
          id: undefined,
          name: formValue.name,
          code: generatedCode, // Utilise le code généré
          description: formValue.description || '',
          examType: formValue.examType
        };
        
        // Ajouter la nouvelle spécialité à la filière sélectionnée
        const courseName = this.currentCourseForSpeciality?.courseName || '';
        if (!this.selectedCourseSpecialities[courseName]) {
          this.selectedCourseSpecialities[courseName] = [];
        }
        this.selectedCourseSpecialities[courseName].push(newSpeciality);
        
        this.hideCreateSpecialityFormForCourse();
        Swal.fire({
          icon: 'success',
          title: 'Spécialité créée',
          html: `<div class="text-center"><i class="bx bx-check-circle text-success" style="font-size: 2em;"></i><p class="mt-2"><strong>${formValue.name}</strong></p><p class="text-muted">Code: <strong>${generatedCode}</strong></p><p class="text-muted">La spécialité a été créée et liée à votre centre avec succès.</p></div>`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erreur création spécialité:', err);
        
        // Gestion spécifique des erreurs
        let errorMessage = 'Erreur lors de la création de la spécialité.';
        
        if (err.status === 500) {
          // Extraire les informations sur les filières disponibles du message d'erreur
          let availableCoursesInfo = '';
          if (err.error && err.error.message && err.error.message.includes('Available courses:')) {
            const availableCoursesMatch = err.error.message.match(/Available courses: (.+)/);
            if (availableCoursesMatch) {
              availableCoursesInfo = availableCoursesMatch[1];
            }
          }
          
          if (availableCoursesInfo) {
            errorMessage = `La filière demandée n'existe pas dans le système. Filières disponibles: ${availableCoursesInfo}`;
          } else {
            errorMessage = 'Erreur serveur. Vérifiez que la filière existe et que tous les champs sont corrects.';
          }
        } else if (err.status === 404) {
          errorMessage = 'La filière sélectionnée n\'existe pas dans le système.';
        } else if (err.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error && err.error.businessErrorDescription) {
          errorMessage = err.error.businessErrorDescription;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  loadSpecialities(): void {
    this.authService.getall1({ offset: 0, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.specialities = response.content || [];
        console.log('Liste des spécialités récupérées :', this.specialities);
      },
      error: (err) => {
        console.error('Erreur chargement spécialités:', err);
        Swal.fire({
          icon: 'warning',
          title: 'Attention',
          text: 'Impossible de charger les spécialités. Veuillez réessayer plus tard.',
          confirmButtonText: 'Compris'
        });
      }
    });
  }

  private _filterSpecialities(value: any): SpecialityResponse[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.specialities.filter(s =>
      (s.name && s.name.toLowerCase().includes(filterValue)) ||
      (s.code && s.code.toLowerCase().includes(filterValue)) ||
      (s.description && s.description.toLowerCase().includes(filterValue))
    );
  }

  displaySpeciality(s: SpecialityResponse): string {
    return s && s.name ? s.name : '';
  }

  onSpecialitySelected(speciality: SpecialityResponse): void {
    if (!this.selectedSpecialities.find(s => s.id === speciality.id)) {
      this.selectedSpecialities.push(speciality);
      this.specialitySearchCtrl.setValue(''); // reset le champ après sélection
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Spécialité déjà sélectionnée',
        text: 'Cette spécialité est déjà dans votre liste.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  removeSpeciality(speciality: SpecialityResponse): void {
    this.selectedSpecialities = this.selectedSpecialities.filter(s => s.id !== speciality.id);
  }

  showCreateSpecialityForm(): void {
    const approvalNumber = this.promoterForm.get('approvalNumber')?.value;
    if (!approvalNumber || approvalNumber.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Numéro d\'agrément requis',
        text: 'Veuillez d\'abord saisir le numéro d\'agrément de votre centre avant de créer une nouvelle spécialité.',
        confirmButtonText: 'Compris'
      });
      // Marquer le champ comme touché pour afficher l'erreur
      this.promoterForm.get('approvalNumber')?.markAsTouched();
      return;
    }
    
    this.isCreatingSpeciality = true;
    
    // Pré-remplir le nom avec le terme de recherche si disponible
    if (this.specialitySearchTerm && this.specialitySearchTerm.trim() !== '') {
      this.newSpecialityForm.patchValue({
        name: this.specialitySearchTerm.trim()
      });
    }
  }

  hideCreateSpecialityForm(): void {
    this.isCreatingSpeciality = false;
    this.newSpecialityForm.reset();
  }

  createNewSpeciality(): void {
    if (this.newSpecialityForm.invalid) {
      return;
    }
    // On doit demander une filière (courseName) pour cette méthode
    if (!this.selectedCourses.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Filière requise',
        text: 'Veuillez sélectionner une filière avant de créer une spécialité.',
        confirmButtonText: 'Compris'
      });
      return;
    }

    const formValue = this.newSpecialityForm.value;
    const createSpecialityRequest = {
      code: formValue.code,
      name: formValue.name,
      description: formValue.description || '',
      examType: formValue.examType
    };
    // On prend la première filière sélectionnée par défaut
    const courseName = this.selectedCourses[0].courseName || '';
    this.authService.createAndLinkSpecialityToTrainingCenter({
      courseName,
      agreementNumber: this.promoterForm.get('approvalNumber')?.value,
      body: createSpecialityRequest
    }).subscribe({
      next: (response) => {
        console.log('Réponse création spécialité:', response);
        
        // Créer un objet spécialité temporaire pour l'ajouter à la sélection
        const newSpeciality: SpecialityResponse = {
          id: undefined, // L'ID sera défini après le rechargement
          name: formValue.name,
          code: formValue.code,
          description: formValue.description || '',
          examType: formValue.examType
        };
        
        // Ajouter la nouvelle spécialité à la sélection
        this.selectedSpecialities.push(newSpeciality);
        
        this.hideCreateSpecialityForm();
        Swal.fire({
          icon: 'success',
          title: 'Spécialité créée',
          text: 'La spécialité a été créée et liée à votre centre avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erreur création spécialité:', err);
        
        // Si le statut est 200, considérer comme un succès malgré l'erreur
        if (err.status === 200) {
          console.log('Réponse avec statut 200, considérer comme succès');
          
          // Créer un objet spécialité temporaire pour l'ajouter à la sélection
          const newSpeciality: SpecialityResponse = {
            id: undefined,
            name: formValue.name,
            code: formValue.code,
            description: formValue.description || '',
            examType: formValue.examType
          };
          
          // Ajouter la nouvelle spécialité à la sélection
          this.selectedSpecialities.push(newSpeciality);
          
          this.hideCreateSpecialityForm();
          Swal.fire({
            icon: 'success',
            title: 'Spécialité créée',
            text: 'La spécialité a été créée et liée à votre centre avec succès.',
            timer: 2000,
            showConfirmButton: false
          });
          return;
        }
        
        let errorMessage = 'Erreur lors de la création de la spécialité.';
        
        // Gestion spécifique des erreurs
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error && err.error.businessErrorDescription) {
          errorMessage = err.error.businessErrorDescription;
        } else if (err.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (err.status === 409) {
          errorMessage = 'Une spécialité avec ce nom existe déjà.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  private _filterTrainingCenters(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.trainingCenters.filter(center =>
      center.fullName.toLowerCase().includes(filterValue)
    );
  }

  onTrainingCenterSelected(event: MatAutocompleteSelectedEvent) {
    const selectedName = event.option.value;
    const selected = this.trainingCenters.find(c => c.fullName === selectedName);
    if (selected) {
      this.candidateForm.get('trainingCenterAcronym')?.setValue(selected.acronym);
    }
  }

  loadTrainingCenters(): void {
    console.log('Chargement des centres de formation...');
    this.trainingCenters = [];
    
    this.authService.getAllTrainingCenters1({ offset: 0, pageSize: 1000 }).subscribe({
        next: (response) => {
        console.log('Réponse centres de formation:', response);
          const centers = response.content || [];
        this.trainingCenters = centers.sort((a, b) => a.fullName.localeCompare(b.fullName));
        console.log('Centres de formation chargés:', this.trainingCenters.length);
        
        // Met à jour l'autocomplete
            this.filteredTrainingCenters = this.trainingCenterCtrl.valueChanges.pipe(
              startWith(''),
              map(value => this._filterTrainingCenters(value || ''))
            );
        },
        error: (err) => {
          console.error('Erreur chargement centres de formation:', err);
        Swal.fire({
          icon: 'warning',
          title: 'Attention',
          text: 'Impossible de charger les centres de formation. Veuillez réessayer plus tard.',
          confirmButtonText: 'Compris'
      });
      }
    });
  }
  
  private showServiceWarning(serviceName: string): void {
    // Only show warning once per session
    if (!sessionStorage.getItem('serviceWarningShown')) {
      Swal.fire({
        icon: 'info',
        title: 'Mode hors ligne',
        text: `Les ${serviceName} sont chargées en mode hors ligne. Certaines options peuvent être limitées.`,
        confirmButtonText: 'Compris',
        timer: 5000,
        timerProgressBar: true
      });
      sessionStorage.setItem('serviceWarningShown', 'true');
    }
  }

  // CANDIDATE FORM
  createCandidateForm(): FormGroup {
    return this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required],
      language: ['fr', Validators.required],
      sex: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      startYear: ['', Validators.required],
      endYear: ['', Validators.required],
      trainingCenterAcronym: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // SPECIALITY FORM
  createNewSpecialityForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      examType: ['', [Validators.required, this.examTypeValidator]]
    });
  }

  examTypeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value || value.trim() === '') {
      return { required: true };
    }
    return null;
  }

  onExamTypeChange(examType: string, event: any): void {
    const currentValue = this.newSpecialityForm.get('examType')?.value || '';
    let newValue = currentValue;
    
    if (event.target.checked) {
      // Ajouter le type d'examen
      if (currentValue.includes(examType)) {
        newValue = currentValue; // Déjà présent
      } else {
        newValue = currentValue ? `${currentValue}, ${examType}` : examType;
      }
    } else {
      // Retirer le type d'examen
      newValue = currentValue.replace(new RegExp(`\\b${examType}\\b,?\\s*`, 'g'), '').replace(/,\s*$/, '');
    }
    
    this.newSpecialityForm.patchValue({ examType: newValue });
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

  registerCandidate(): void {
    this.errorMessages = [];
    if (this.candidateForm.invalid) {
      Object.values(this.candidateForm.controls).forEach(control => control.markAsTouched());
      this.errorMessages = ['Veuillez remplir tous les champs obligatoires.'];
      return;
    }
    this.processing = true;
    const formValue = this.candidateForm.value;

    // Récupère le nom du centre à partir de l'acronym sélectionné
    const selectedCenter = this.trainingCenters.find(c => c.acronym === formValue.trainingCenterAcronym);
    const trainingCenterName = selectedCenter ? selectedCenter.fullName : '';

    const registrationRequest: any = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      language: formValue.language,
      sex: formValue.sex,
      dateOfBirth: formValue.dateOfBirth,
      placeOfBirth: formValue.placeOfBirth,
      startYear: formValue.startYear + '-01-01',
      endYear: formValue.endYear + '-01-01',
      trainingCenterName: trainingCenterName
    };

    console.log('Payload envoyé au backend :', registrationRequest);

    this.authService.register({ body: registrationRequest }).subscribe({
      next: (response) => {
        this.processing = false;
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Votre inscription a été enregistrée avec succès. Vous pouvez maintenant vous connecter.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.processing = false;
        console.error('Erreur backend :', err);
        this.handleRegistrationError(err);
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
      
      // Afficher une alerte plus détaillée
      Swal.fire({
        icon: 'warning',
        title: 'Informations manquantes',
        text: 'Veuillez remplir tous les champs obligatoires du centre avant de continuer.',
        confirmButtonText: 'Compris'
      });
      return false;
    }

    // Validation selon le type d'examen choisi
    const isCqp = this.promoterForm.get('isCenterPresentCandidateForCqp')?.value;
    const isDqp = this.promoterForm.get('isCenterPresentCandidateForDqp')?.value;

    if (!isCqp && !isDqp) {
      this.errorMessages = ['Veuillez sélectionner au moins un type d\'examen (CQP ou DQP)'];
      
      Swal.fire({
        icon: 'warning',
        title: 'Type d\'examen requis',
        text: 'Votre centre doit proposer au moins un type d\'examen (CQP ou DQP).',
        confirmButtonText: 'Compris'
      });
      return false;
    }

    // Validation des filières et spécialités
    if (this.selectedCourses.length === 0) {
      this.errorMessages = ['Veuillez sélectionner au moins une filière'];
      
      Swal.fire({
        icon: 'warning',
        title: 'Filières requises',
        text: 'Vous devez sélectionner au moins une filière et ses spécialités.',
        confirmButtonText: 'Compris'
      });
      return false;
    }

    // Vérifier que chaque filière a au moins une spécialité
    const coursesWithoutSpecialities = this.selectedCourses.filter(course => 
      !this.validateCourseHasSpecialities(course)
    );

    if (coursesWithoutSpecialities.length > 0) {
              const courseNames = coursesWithoutSpecialities.map(c => c.courseName).join(', ');
      this.errorMessages = ['Chaque filière sélectionnée doit avoir au moins une spécialité'];
      
      Swal.fire({
        icon: 'warning',
        title: 'Spécialités requises',
        text: `Les filières suivantes n'ont pas de spécialités sélectionnées : ${courseNames}`,
        confirmButtonText: 'Compris'
      });
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
        // 2. Lier toutes les spécialités des filières au centre (CQP et DQP)
        const allSpecialityIds: number[] = [];
        Object.values(this.selectedCourseSpecialities).forEach(specialities => {
          const specialityIds = specialities.map(s => s.id).filter(id => id !== undefined) as number[];
          allSpecialityIds.push(...specialityIds);
        });

        if (allSpecialityIds.length > 0) {
          this.authService.addSpecialitiesToTrainingCenter1({
            agreementNumber: formValue.approvalNumber,
            body: allSpecialityIds
          }).subscribe({
            next: () => {
              console.log('Spécialités liées avec succès');
            },
            error: (err) => {
              console.error('Erreur liaison spécialités:', err);
            }
          });
        }

        // 3. Préparer FormData pour les fichiers
        const formData = new FormData();
        if (formValue.cniFile) formData.append('cniFile', formValue.cniFile);
        if (formValue.approvalFile) formData.append('approvalFile', formValue.approvalFile);
        if (formValue.engagementLetter) formData.append('engagementLetter', formValue.engagementLetter);
        if (formValue.promoterPhoto) formData.append('promoterPhoto', formValue.promoterPhoto);
        if (formValue.internalRegulation) formData.append('internalRegulation', formValue.internalRegulation);
        if (formValue.locationPlan) formData.append('locationPlan', formValue.locationPlan);

        // 5. Appel uploadPromoterFile (renseigne bien les paramètres)
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

  private handleRegistrationError(error: any): void {
    let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
    if (error && error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error && error.message) {
      errorMessage = error.message;
    }
    this.errorMessages = [errorMessage];
    // Affichage d'une popup d'erreur
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
      confirmButtonText: 'OK'
    });
  }

  getFileName(file: File | null): string {
    return file?.name || 'Aucun fichier sélectionné';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getTrainingCenterName(code: string): string | undefined {
    if (!code) return undefined;
    const center = this.trainingCenters.find(tc => tc.acronym === code);
    return center?.fullName;
  }

  // Méthode de test pour déboguer l'inscription
  testRegistration(): void {
    const testRequest: any = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test.user@example.com',
      phoneNumber: '690123456',
      password: 'TestPass123',
      confirmPassword: 'TestPass123',
      language: 'fr',
      sex: 'M',
      dateOfBirth: '1990-01-01',
      placeOfBirth: 'Douala',
      startYear: '2025',
      endYear: '2026',
      trainingCenterName: 'Institut Supérieur de Management'
    };

    console.log('Testing registration with:', testRequest);

    this.authService.register({ body: testRequest }).subscribe({
      next: (response) => {
        console.log('Test registration successful:', response);
        Swal.fire({
          icon: 'success',
          title: 'Test réussi',
          text: 'L\'inscription de test a fonctionné !'
        });
      },
      error: (err) => {
        console.error('Test registration failed:', err);
        this.handleRegistrationError(err);
      }
    });
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.currentStepCandidate = 0;
    this.candidateAccountCreated = false;
    this.candidateAccountId = null;
    this.personalInfoUpdated = false;
    this.applicationCreated = false;
    this.applicationId = null;
    this.documentsUploaded = false;
    this.paymentCompleted = false;
    this.candidateForm.reset();
    this.processing = false;
    
    // Réinitialiser les spécialités
    this.selectedSpecialities = [];
    this.isCreatingSpeciality = false;
    this.specialitySearchTerm = '';
    this.newSpecialityForm.reset();
    
    // Réinitialiser les filières et spécialités DQP
    this.selectedCourses = [];
    this.selectedCourseSpecialities = {};
    this.isCreatingSpecialityForCourse = false;
    this.currentCourseForSpeciality = null;
    this.courseSearchCtrl.setValue('');
    
    // Réinitialiser les valeurs par défaut
    this.candidateForm.patchValue({
      preferredLanguage: 'fr',
      teachingLanguage: 'fr',
      childrenCount: 0,
      termsAccepted: false
    });
  }

  getSelectedSpecialitiesSummary(): string {
    if (this.selectedSpecialities.length === 0) {
      return 'Aucune spécialité sélectionnée';
    }
    
    const specialityNames = this.selectedSpecialities.map(s => s.name).join(', ');
    return `${this.selectedSpecialities.length} spécialité(s): ${specialityNames}`;
  }

  getTotalSpecialitiesCount(): number {
    let total = 0;
    
    // Compter les spécialités des filières (CQP et DQP)
    Object.values(this.selectedCourseSpecialities).forEach(specialities => {
      total += specialities.length;
    });
    
    return total;
  }

  getExamTypesSummary(): string {
    const examTypes = [...new Set(this.selectedSpecialities.map(s => s.examType).filter(type => type))];
    if (examTypes.length === 0) {
      return 'Aucun type d\'examen spécifié';
    }
    return examTypes.join(', ');
  }

  // Fonction utilitaire pour générer automatiquement le code de spécialité
  private generateSpecialityCode(specialityName: string): string {
    // Prendre les 2 premières lettres du nom de la spécialité
    const firstTwoLetters = specialityName.substring(0, 2).toUpperCase();
    
    // Générer 3 chiffres aléatoires
    const randomNumbers = Math.floor(Math.random() * 900) + 100; // Génère un nombre entre 100 et 999
    
    // Combiner les lettres et les chiffres
    return `${firstTwoLetters}${randomNumbers}`;
  }

  // Fonction utilitaire pour nettoyer et valider le nom de filière
  private validateAndCleanCourseName(courseName: string): { isValid: boolean; cleanName: string; errorMessage?: string } {
    // Décoder l'URL si nécessaire et nettoyer le nom
    let cleanName = courseName.trim();
    
    // Décoder les caractères encodés dans l'URL si présents
    try {
      cleanName = decodeURIComponent(cleanName);
    } catch (e) {
      // Si le décodage échoue, utiliser le nom original
      console.warn('Erreur lors du décodage du nom de filière:', e);
    }
    
    if (!cleanName || cleanName.length < 2) {
      return {
        isValid: false,
        cleanName: '',
        errorMessage: 'Le nom de la filière doit contenir au moins 2 caractères.'
      };
    }
    
    // Remplacer les espaces par des tirets pour éviter l'encodage URL
    const urlSafeName = cleanName.replace(/\s+/g, '-');
    
    // Vérifier que la filière existe dans la liste des cours disponibles
    const course = this.courses.find(c => c.courseName === cleanName);
    if (!course) {
      return {
        isValid: false,
        cleanName: '',
        errorMessage: `La filière "${cleanName}" n'existe pas dans le système. Veuillez sélectionner une filière valide.`
      };
    }
    
    return {
      isValid: true,
      cleanName: urlSafeName // Retourner le nom avec des tirets pour l'URL
    };
  }

  // Création rapide d'une spécialité liée à la filière sélectionnée
  createQuickSpeciality(): void {
    const approvalNumber = this.promoterForm.get('approvalNumber')?.value;
    if (!approvalNumber || approvalNumber.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Numéro d\'agrément requis',
        text: 'Veuillez d\'abord saisir le numéro d\'agrément de votre centre.',
        confirmButtonText: 'Compris'
      });
      this.promoterForm.get('approvalNumber')?.markAsTouched();
      return;
    }
    // Vérifier qu'au moins une filière est sélectionnée
    if (this.selectedCourses.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Filière requise',
        text: 'Veuillez d\'abord sélectionner une filière avant de créer une spécialité.',
        confirmButtonText: 'Compris'
      });
      return;
    }

    // Pré-remplir avec le terme de recherche si disponible
    const prefillName = this.specialitySearchTerm && this.specialitySearchTerm.trim() !== '' 
      ? this.specialitySearchTerm.trim() 
      : '';

    // Créer les options du dropdown des filières
    const courseOptions = this.selectedCourses.map(course => 
      `<option value="${course.courseName}">${course.courseName}</option>`
    ).join('');

    // Demander le nom de la spécialité et la filière
    Swal.fire({
      title: 'Créer une nouvelle spécialité',
      html: `
        <div class="mb-3">
          <label class="form-label fw-bold">Nom de la spécialité <span class="text-danger">*</span></label>
          <input id="specialityName" class="form-control" placeholder="Ex: Informatique, Comptabilité..." value="${prefillName}">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Filière <span class="text-danger">*</span></label>
          <select id="courseSelect" class="form-select">
            <option value="">Sélectionnez une filière</option>
            ${courseOptions}
          </select>
          <small class="text-muted">La filière est obligatoire pour organiser vos spécialités</small>
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold">Type d'examen</label>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="quickCQP" checked>
            <label class="form-check-label" for="quickCQP">
              <strong>CQP</strong>
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="quickDQP">
            <label class="form-check-label" for="quickDQP">
              <strong>DQP</strong>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="bx bx-plus-circle me-2"></i>Créer la spécialité',
      cancelButtonText: '<i class="bx bx-x me-2"></i>Annuler',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      width: '500px',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary'
      },
      preConfirm: () => {
        const name = (document.getElementById('specialityName') as HTMLInputElement).value;
        const selectedCourse = (document.getElementById('courseSelect') as HTMLSelectElement).value;
        const cqp = (document.getElementById('quickCQP') as HTMLInputElement).checked;
        const dqp = (document.getElementById('quickDQP') as HTMLInputElement).checked;
        
        if (!name || name.trim() === '') {
          Swal.showValidationMessage('Le nom de la spécialité est requis');
          return false;
        }
        
        if (!selectedCourse || selectedCourse.trim() === '') {
          Swal.showValidationMessage('La sélection d\'une filière est obligatoire');
          return false;
        }
        
        if (!cqp && !dqp) {
          Swal.showValidationMessage('Sélectionnez au moins un type d\'examen');
          return false;
        }
        
        const examTypes = [];
        if (cqp) examTypes.push('CQP');
        if (dqp) examTypes.push('DQP');
        
        return { 
          name: name.trim(), 
          examTypes: examTypes.join(', '),
          selectedCourse: selectedCourse
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, examTypes, selectedCourse } = result.value;
        const approvalNumber = this.promoterForm.get('approvalNumber')?.value;
        
        // Générer automatiquement le code de la spécialité
        const generatedCode = this.generateSpecialityCode(name);
        
        // Créer une spécialité avec des valeurs par défaut
        const createSpecialityRequest = {
          code: generatedCode, // Utilise le code généré automatiquement
          name: name,
          description: `Spécialité en ${name}`,
          examType: examTypes
        };
        
        // Vérification stricte des champs obligatoires
        if (!selectedCourse || !approvalNumber || !name || !createSpecialityRequest.code || !createSpecialityRequest.description || !createSpecialityRequest.examType) {
          Swal.fire({
            icon: 'warning',
            title: 'Champs manquants',
            text: 'Tous les champs sont obligatoires pour créer une spécialité.',
            confirmButtonText: 'OK'
          });
          return;
        }

        console.log('Création rapide spécialité:', createSpecialityRequest);

        // Nettoyer et valider le nom de la filière
        const validation = this.validateAndCleanCourseName(selectedCourse);
        if (!validation.isValid) {
          Swal.fire({
            icon: 'error',
            title: 'Nom de filière invalide',
            text: validation.errorMessage || 'Nom de filière invalide',
            confirmButtonText: 'OK'
          });
          return;
        }

        // Utilise createAndLinkSpecialityToTrainingCenter pour créer et lier la spécialité à la filière
        console.log('Envoi au backend - courseName:', validation.cleanName, 'original:', selectedCourse);
        this.authService.createAndLinkSpecialityToTrainingCenter({
          courseName: validation.cleanName,
          agreementNumber: approvalNumber,
          body: createSpecialityRequest
        }).subscribe({
          next: (response) => {
            console.log('Réponse création rapide:', response);
            
            // Ajoute la spécialité à la filière sélectionnée côté UI
            const newSpeciality: SpecialityResponse = {
              id: undefined,
              name: name,
              code: createSpecialityRequest.code,
              description: createSpecialityRequest.description,
              examType: examTypes
            };
            const existingCourse = this.selectedCourses.find(c => c.courseName === selectedCourse);
            if (existingCourse) {
              if (!this.selectedCourseSpecialities[selectedCourse]) {
                this.selectedCourseSpecialities[selectedCourse] = [];
              }
              this.selectedCourseSpecialities[selectedCourse].push(newSpeciality);
            } else {
              const courseToAdd = this.courses.find(c => c.courseName === selectedCourse);
              if (courseToAdd) {
                this.selectedCourses.push(courseToAdd);
                this.selectedCourseSpecialities[selectedCourse] = [newSpeciality];
              }
            }
            this.specialitySearchTerm = '';
            // Recharge la liste des filières et spécialités pour afficher la nouvelle
            this.loadCoursesWithSpecialities();
            Swal.fire({
              icon: 'success',
              title: 'Spécialité créée avec succès !',
              html: `<div class="text-center"><i class="bx bx-check-circle text-success" style="font-size: 3em;"></i><p class="mt-3"><strong>${name}</strong></p><p class="text-muted">Code: <strong>${generatedCode}</strong></p><p class="text-muted">A été créée et liée à la filière <strong>${selectedCourse}</strong></p><p class="text-muted small">Types d'examen: ${examTypes}</p></div>`,
              timer: 3000,
              showConfirmButton: false,
              timerProgressBar: true
            });
          },
          error: (err) => {
            console.error('Erreur création rapide spécialité:', err);
            
            // Gestion spécifique des erreurs
            let errorMessage = 'Erreur lors de la création de la spécialité.';
            
            if (err.status === 500) {
              // Extraire les informations sur les filières disponibles du message d'erreur
              let availableCoursesInfo = '';
              if (err.error && err.error.message && err.error.message.includes('Available courses:')) {
                const availableCoursesMatch = err.error.message.match(/Available courses: (.+)/);
                if (availableCoursesMatch) {
                  availableCoursesInfo = availableCoursesMatch[1];
                }
              }
              
              if (availableCoursesInfo) {
                errorMessage = `La filière "${selectedCourse}" n'existe pas dans le système. Filières disponibles: ${availableCoursesInfo}`;
              } else {
                errorMessage = 'Erreur serveur. Vérifiez que la filière existe et que tous les champs sont corrects.';
              }
            } else if (err.status === 404) {
              errorMessage = 'La filière sélectionnée n\'existe pas dans le système.';
            } else if (err.status === 400) {
              errorMessage = 'Données invalides. Vérifiez les informations saisies.';
            } else if (err.error && err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error && err.error.businessErrorDescription) {
              errorMessage = err.error.businessErrorDescription;
            }
            
            Swal.fire({
              icon: 'error',
              title: 'Erreur de création',
              text: errorMessage,
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }

  // Méthode pour filtrer les spécialités par filière
  getSpecialitiesForCourse(course: CourseWithSpecialitiesResponse): SpecialityResponse[] {
    // Retourne les spécialités de la filière sélectionnée
    return course.specialities && course.specialities.length > 0
      ? course.specialities
      : [];
  }

  // Méthode pour vérifier si une spécialité est déjà sélectionnée pour une filière
  isSpecialitySelectedForCourse(speciality: SpecialityResponse, course: CourseWithSpecialitiesResponse): boolean {
    const courseName = course.courseName || '';
    return this.selectedCourseSpecialities[courseName]?.some(s => s.id === speciality.id) || false;
  }

  // Méthode pour obtenir le nombre de spécialités par filière
  getSpecialitiesCountForCourse(course: CourseWithSpecialitiesResponse): number {
    const courseName = course.courseName || '';
    return this.selectedCourseSpecialities[courseName]?.length || 0;
  }

  // Méthode pour valider qu'une filière a au moins une spécialité
  validateCourseHasSpecialities(course: CourseWithSpecialitiesResponse): boolean {
    const courseName = course.courseName || '';
    return this.selectedCourseSpecialities[courseName]?.length > 0;
  }

  onExamTypeCheckboxChange(): void {
    const isCqp = this.promoterForm.get('isCenterPresentCandidateForCqp')?.value;
    const isDqp = this.promoterForm.get('isCenterPresentCandidateForDqp')?.value;

    // Si aucun type d'examen n'est sélectionné, réinitialiser les sélections
    if (!isCqp && !isDqp) {
      this.selectedCourses = [];
      this.selectedCourseSpecialities = {};
      this.courseSearchCtrl.setValue('');
      this.specialitySearchCtrl.setValue('');
    }

    // Recharger les cours et spécialités selon le type d'examen
    this.loadCoursesWithSpecialities();
    this.loadSpecialities();
  }

  addSpecialityToCenter(speciality: SpecialityResponse, course: CourseWithSpecialitiesResponse): void {
    const agreementNumber = this.promoterForm.get('approvalNumber')?.value;
    if (!agreementNumber) {
      Swal.fire({ icon: 'warning', title: 'Numéro d\'agrément requis', text: 'Veuillez renseigner le numéro d\'agrément.' });
      return;
    }
    // Ajoute la spécialité au centre pour la filière
    this.authService.addSpecialitiesToTrainingCenter1({
      agreementNumber,
      body: [speciality.id]
    }).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Spécialité ajoutée', text: 'La spécialité a été liée à votre centre.' });
        this.loadCoursesWithSpecialities(); // Rafraîchir la liste
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d\'ajouter la spécialité.' });
      }
    });
  }

  // Ajout d'une spécialité via popup pour une filière donnée
  addSpecialityViaPopup(course: CourseWithSpecialitiesResponse): void {
    const approvalNumber = this.promoterForm.get('approvalNumber')?.value;
    if (!approvalNumber) {
      Swal.fire({ icon: 'warning', title: 'Numéro d\'agrément requis', text: 'Veuillez renseigner le numéro d\'agrément.' });
      return;
    }
    Swal.fire({
      title: `Ajouter une spécialité à la filière "${course.courseName}"`,
      html: `
        <input id="specialityName" class="swal2-input" placeholder="Nom de la spécialité">
        <input id="specialityCode" class="swal2-input" placeholder="Code">
        <input id="specialityDesc" class="swal2-input" placeholder="Description">
        <select id="specialityExamType" class="swal2-input">
          <option value="">Type d'examen</option>
          <option value="CQP">CQP</option>
          <option value="DQP">DQP</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      preConfirm: () => {
        const name = (document.getElementById('specialityName') as HTMLInputElement).value;
        const code = (document.getElementById('specialityCode') as HTMLInputElement).value;
        const description = (document.getElementById('specialityDesc') as HTMLInputElement).value;
        const examType = (document.getElementById('specialityExamType') as HTMLSelectElement).value;
        if (!name || !code || !examType) {
          Swal.showValidationMessage('Nom, code et type d\'examen sont obligatoires');
          return false;
        }
        return { name, code, description, examType };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, code, description, examType } = result.value;
        const createSpecialityRequest = { name, code, description, examType };
        this.authService.createAndLinkSpecialityToTrainingCenter({
          courseName: course.courseName,
          agreementNumber: approvalNumber,
          body: createSpecialityRequest
        }).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Spécialité ajoutée', text: 'La spécialité a été créée et liée à la filière.' });
            this.loadCoursesWithSpecialities();
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d\'ajouter la spécialité.' });
          }
        });
      }
    });
  }
}