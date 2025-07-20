import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { TrainingcenterService } from '../services/services/trainingcenter.service';
import { CandidateService } from '../services/services/candidate.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cyptolanding',
  templateUrl: './cyptolanding.component.html',
  styleUrls: ['./cyptolanding.component.scss']
})

/**
 * Crypto landing page
 */
export class CyptolandingComponent implements OnInit {

  nbCenters: number = 0;
  nbCandidates: number = 0;
  nbDiplomas: number = 0; // Valeur fictive si pas d'API

  constructor(
    private router: Router,
    private trainingcenterService: TrainingcenterService,
    private candidateService: CandidateService
  ) {}

  goToLogin() {
     this.router.navigate(['/login'])
    }
    

  // set the currenr year
  year: number = new Date().getFullYear();
  currentSection:any = 'home';

  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 24,
    nav: false,
    dots: false,
    responsive: {
      672: {
        items: 3
      },
      912: {
        items: 4
      },
    }
  }

  timelineCarousel: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: true,
    navText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
    dots: false,
    responsive: {
      672: {
        items: 3
      },

      576: {
        items: 2
      },

      936: {
        items: 4
      },
    }
  }

  private _trialEndsAt;

  private _diff: number;
  _days: number;
  _hours: number;
  _minutes: number;
  _seconds: number;

  faqs = [
    {
      question: 'Comment créer un compte sur Applycam ?',
      answer: 'Cliquez sur “S’inscrire”, choisissez votre profil (candidat ou promoteur), remplissez le formulaire et validez votre inscription via le lien reçu par email.'
    },
    {
      question: 'Quelle est la différence entre le CQP et le DQP ?',
      answer: 'Le CQP (Certificat de Qualification Professionnelle) valide des compétences sur un métier précis. Le DQP (Diplôme de Qualification Professionnelle) atteste d’un parcours de formation plus long et qualifiant, ouvrant l’accès à des emplois spécialisés.'
    },
    {
      question: 'Comment payer les frais d’inscription ?',
      answer: 'Le paiement se fait en ligne via Mobile Money, carte bancaire ou d’autres partenaires agréés. Toutes les transactions sont sécurisées.'
    },
    {
      question: 'Mes données sont-elles en sécurité sur Applycam ?',
      answer: 'Oui, Applycam utilise des protocoles de sécurité avancés pour protéger vos informations personnelles et vos paiements.'
    },
    {
      question: 'Que faire si j’ai oublié mon mot de passe ?',
      answer: 'Cliquez sur “Mot de passe oublié” sur la page de connexion et suivez les instructions pour réinitialiser votre mot de passe par email.'
    },
    {
      question: 'Qui contacter en cas de problème ou de question ?',
      answer: 'Notre support est disponible par email (contact@applycam.cm) et téléphone (+237 6 99 99 99 99) pour vous accompagner à chaque étape.'
    }
  ];


  ngOnInit() {
    this._trialEndsAt = "2025-05-31";
    this.loadStats();
    interval(1000).pipe(
      map((x) => {
        this._diff = Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
      })).subscribe((x) => {
        this._days = this.getDays(this._diff);
        this._hours = this.getHours(this._diff);
        this._minutes = this.getMinutes(this._diff);
        this._seconds = this.getSeconds(this._diff);
      });
  }

  loadStats() {
    this.trainingcenterService.getAllTrainingCenters({ offset: 0, pageSize: 1 }).subscribe({
      next: (res: any) => {
        this.nbCenters = res.totalElements || 0;
      },
      error: () => { this.nbCenters = 0; }
    });
    this.candidateService.getAllCandidates({ offset: 0, pageSize: 1 }).subscribe({
      next: (res: any) => {
        this.nbCandidates = res.totalElements || 0;
      },
      error: () => { this.nbCandidates = 0; }
    });
    // Diplômes : valeur fictive, à remplacer par un appel API si disponible
    this.nbDiplomas = 1245;
  }

  getDays(t) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  getHours(t) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  getMinutes(t) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  getSeconds(t) {
    return Math.floor((t / 1000) % 60);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  /**
   * Window scroll method
   */
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
      navbar.classList.add('nav-sticky')
    } else {
      navbar.classList.remove('nav-sticky')
    }
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('topnav-menu-content').classList.toggle('show');
  }

  /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }



}
