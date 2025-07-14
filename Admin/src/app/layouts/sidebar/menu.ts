import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    // OPERATIONAL
    {
        id: 1,
        label: 'OPERATIONAL',
        isTitle: true,
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 2,
        label: 'Tableau de bord',
        icon: 'bx-home',
        link: 'overview-staff',
        roles: ['super_admin', 'STAFF']
    },
    // Gestion des centres et du personnel
    {
        id: 3,
        label: 'Centres de formation',
        icon: 'bx-building-house',
        link: 'training-centers-management',
        roles: ['super_admin', 'STAFF']
    },
    // {
    //     id: 5,
    //     label: 'Staff Management',
    //     icon: 'bx-group',
    //     link: 'staff-management',
    //     roles: ['super_admin', 'STAFF']
    // },
    // Gestion des candidats et applications
    {
        id: 4,
        label: 'Candidats',
        icon: 'bx-user',
        link: 'candidates-management',
        roles: ['super_admin', 'STAFF']
    },
     {
        id: 49,
        label: 'Promoteurs',
        icon: 'bx-user',
        link: 'promoter',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 48,
        label: 'Dossiers de candidature',
        icon: 'bxs-folder-open',
        link: 'application-management',
        roles: ['super_admin', 'STAFF']
    },
    // Examens
    {
        id: 33,
        label: 'Centres d\'examen',
        link: 'exams-centers-management',
        icon: 'bx-building',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 34,
        label: 'Sessions d\'examen',
        link: 'session-management',
        icon: 'bx-calendar-event',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 36,
        label: 'Spécialités & Filières',
        link: 'specialities-management',
        icon: 'bxs-award',
        roles: ['super_admin', 'STAFF'],
    },
    // {
    //     id: 35,
    //     label: 'Results Management',
    //     icon: 'bx-table',
    //     link: 'results-management',
    //     roles: ['super_admin', 'STAFF']
    // },
    // Paiements
    {
        id: 6,
        label: 'Historique de payemnt',
        icon: 'bx-credit-card',
        link: 'payment-gateway-management',
        roles: ['super_admin', 'STAFF']
    },
    // Statistiques et logs
    {
        id: 45,
        label: 'Statistiques',
        link: 'system-statistics',
        icon: 'bx-stats',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 46,
        label: 'Journaux',
        link: 'system-logs',
        icon: 'bx-file',
        roles: ['super_admin', 'STAFF'],
    },
    // {
    //     id: 47,
    //     label: 'Backups',
    //     link: 'system-backups',
    //     icon: 'bx-cloud-upload',
    //     roles: ['super_admin', 'STAFF'],
    // },
    

    // APP SETTINGS
    {
        id: 9,
        label: 'PARAMÈTRES DE L\'APPLICATION',
        isTitle: true,
        roles: ['super_admin', 'STAFF']
    },


    // Promoter -> Operational (EXISTANT)
    {
        id: 18,
        label: 'OPÉRATIONNEL',
        isTitle: true,
        roles: ['PROMOTER']
    },
    {
        id: 19,
        label: 'Tableau de bord',
        icon: 'bxs-chart',
        link: 'promoter-dashboard',
        roles: ['PROMOTER']
    },
    {
        id: 20,
        label: 'Centres de formation',
        icon: 'bxs-school',
        link: 'training-center-management',
        roles: ['PROMOTER']
    },
    // {
    //     id: 2001,
    //     label: 'Filieres',
    //     icon: 'bxs-book',
    //     link: 'courses-management',
    //     roles: ['PROMOTER']
    // },
    // {
    //     id: 2002,
    //     label: 'Campus Management',
    //     icon: 'bxs-building',
    //     link: 'campus-management',
    //     roles: ['PROMOTER']
    // },
    {
        id: 21,
        label: 'Campus',
        icon: 'bxs-building',
        link: 'campus-management',
        roles: ['PROMOTER']
    },
    {
        id: 22,
        label: 'Filières',
        icon: 'bxs-book',
        link: 'promoter/courses',
        roles: ['PROMOTER']
    },
    {
        id: 23,
        label: 'Spécialités',
        icon: 'bxs-award',
        link: 'promoter/specialties',
        roles: ['PROMOTER']
    },
    {
        id: 24,
        label: 'Mes candidats',
        icon: 'bxs-graduation',
        link: 'my-candidates',
        roles: ['PROMOTER']
    },
{
        id: 24,
        label: 'Résultats',
        icon: 'bxs-report',
        link: 'promoter-results',
        roles: ['PROMOTER']
    },
    // Promoter -> Settings (EXISTANT)
    {
        id: 25,
        label: 'PARAMÈTRES',
        isTitle: true,
        roles: ['PROMOTER']
    },

    // Candidate -> Operational (EXISTANT)
    {
        id: 26,
        label: 'OPÉRATIONNEL',
        isTitle: true,
        roles: ['CANDIDATE']
    },
    {
        id: 27,
        label: 'Tableau de bord',
        icon: 'bxs-chart',
        link: 'candidate-dashboard',
        roles: ['CANDIDATE']
    },
    {
    id: 27,
    label: 'Mes candidatures',
    icon: 'bxs-folder-open',  // Icône changée ici
    link: 'my-applications',
    roles: ['CANDIDATE']
},

 // Candidate - Additional Features
    {
        id: 41,
        label: 'Mes examens',
        link: 'my-exams',
        icon: 'bx-book',
        roles: ['CANDIDATE'],
    },
    {
        id: 42,
        label: 'Mes résultats',
        link: 'my-results',
        icon: 'bx-award',
        roles: ['CANDIDATE'],
    },
    {
        id: 43,
        label: 'Mes attestations',
        link: 'my-certificates',
        icon: 'bx-certification',
        roles: ['CANDIDATE'],
    },
    {
        id: 44,
        label: 'Mes paiements',
        link: 'my-payments',
        icon: 'bx-credit-card',
        roles: ['CANDIDATE'],
    },
    // {
    //     id: 48,
    //     label: 'My Notifications',
    //     link: 'my-notifications',
    //     icon: 'bx-bell',
    //     roles: ['CANDIDATE'],
    // },
    // {
    //     id: 49,
    //     label: 'My Profile',
    //     link: 'my-profile',
    //     icon: 'bx-user-circle',
    //     roles: ['CANDIDATE'],
    // },
    // Common to all users (EXISTANT)
    // Promoter -> Settings (EXISTANT)
    {
        id: 25,
        label: 'PARAMÈTRES',
        isTitle: true,
        roles: ['CANDIDATE']
    },
    {
        id: 28,
        label: 'Mes notifications',
        icon: 'bx-message',
        link: 'my-notifications',
        roles: ['PROMOTER', 'CANDIDATE']
    },
    {
        id: 29,
        label: 'Aide & Support',
        icon: 'bx-headphone',
        link: 'help-and-support',
        roles: ['CANDIDATE', 'PROMOTER', 'STAFF']
    },
    {
        id: 30,
        label: 'Paramètres du profil',
        icon: 'bxs-user-circle',
        link: 'profile',
        roles: ['CANDIDATE', 'PROMOTER', 'STAFF']
    },
    {
        id: 31,
        label: 'Déconnexion',
        icon: 'bxs-log-out',
        link: '/auth/logout',
        roles: ['CANDIDATE', 'PROMOTER', 'STAFF']
    },

    
];