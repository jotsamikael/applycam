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
        label: 'Dashboard',
        icon: 'bx-home',
        link: 'overview-staff',
        roles: ['super_admin', 'STAFF']
    },
    // Gestion des centres et du personnel
    {
        id: 3,
        label: 'Training Centers',
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
        label: 'Candidates',
        icon: 'bx-user',
        link: 'candidates-management',
        roles: ['super_admin', 'STAFF']
    },
     {
        id: 49,
        label: 'Promoter',
        icon: 'bx-user',
        link: 'promoter',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 48,
        label: 'Applications',
        icon: 'bxs-folder-open',
        link: 'application-management',
        roles: ['super_admin', 'STAFF']
    },
    // Examens
    {
        id: 33,
        label: 'Exam Centers',
        link: 'exams-centers-management',
        icon: 'bx-building',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 34,
        label: 'Exam Sessions',
        link: 'exam-session-management',
        icon: 'bx-calendar-event',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 35,
        label: 'Results Management',
        icon: 'bx-table',
        link: 'results-management',
        roles: ['super_admin', 'STAFF']
    },
    // Paiements
    {
        id: 6,
        label: 'Payment Gateways',
        icon: 'bx-credit-card',
        link: 'payment-gateway-management',
        roles: ['super_admin', 'STAFF']
    },
    // Statistiques et logs
    {
        id: 45,
        label: 'Statistics',
        link: 'system-statistics',
        icon: 'bx-stats',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 46,
        label: 'Logs',
        link: 'system-logs',
        icon: 'bx-file',
        roles: ['super_admin', 'STAFF'],
    },
    {
        id: 47,
        label: 'Backups',
        link: 'system-backups',
        icon: 'bx-cloud-upload',
        roles: ['super_admin', 'STAFF'],
    },
    

    // APP SETTINGS
    {
        id: 9,
        label: 'APP SETTINGS',
        isTitle: true,
        roles: ['super_admin', 'STAFF']
    },


    // Promoter -> Operational (EXISTANT)
    {
        id: 18,
        label: 'OPERATIONAL',
        isTitle: true,
        roles: ['PROMOTER']
    },
    {
        id: 19,
        label: 'Dashboard',
        icon: 'bxs-chart',
        link: 'promoter-dashboard',
        roles: ['PROMOTER']
    },
    {
        id: 20,
        label: 'Training Centers',
        icon: 'bxs-school',
        link: 'training-center-management',
        roles: ['PROMOTER']
    },
    {
        id: 21,
        label: 'Campus',
        icon: 'bxs-building',
        link: 'campus-management',
        roles: ['PROMOTER']
    },
    {
        id: 22,
        label: 'Courses',
        icon: 'bxs-book',
        link: 'promoter/courses',
        roles: ['PROMOTER']
    },
    {
        id: 23,
        label: 'Specialties',
        icon: 'bxs-award',
        link: 'promoter/specialties',
        roles: ['PROMOTER']
    },
    {
        id: 24,
        label: 'My Candidates',
        icon: 'bxs-graduation',
        link: 'my-candidates',
        roles: ['PROMOTER']
    },
{
        id: 24,
        label: 'Results',
        icon: 'bxs-report',
        link: 'promoter-results',
        roles: ['PROMOTER']
    },
    // Promoter -> Settings (EXISTANT)
    {
        id: 25,
        label: 'SETTINGS',
        isTitle: true,
        roles: ['PROMOTER']
    },

    // Candidate -> Operational (EXISTANT)
    {
        id: 26,
        label: 'OPERATIONAL',
        isTitle: true,
        roles: ['CANDIDATE']
    },
    {
        id: 27,
        label: 'Dashboard',
        icon: 'bxs-chart',
        link: 'candidate-dashboard',
        roles: ['CANDIDATE']
    },
    {
    id: 27,
    label: 'My Applications',
    icon: 'bxs-folder-open',  // Icône changée ici
    link: 'my-applications',
    roles: ['CANDIDATE']
},

 // Candidate - Additional Features
    {
        id: 41,
        label: 'My Exams',
        link: 'my-exams',
        icon: 'bx-book',
        roles: ['CANDIDATE'],
    },
    {
        id: 42,
        label: 'My Results',
        link: 'my-results',
        icon: 'bx-award',
        roles: ['CANDIDATE'],
    },
    {
        id: 43,
        label: 'My Certificates',
        link: 'my-certificates',
        icon: 'bx-certification',
        roles: ['CANDIDATE'],
    },
    {
        id: 44,
        label: 'My Payments',
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
        label: 'SETTINGS',
        isTitle: true,
        roles: ['CANDIDATE']
    },
    {
        id: 28,
        label: 'My Notifications',
        icon: 'bx-message',
        link: 'my-notifications',
        roles: ['PROMOTER', 'CANDIDATE']
    },
    {
        id: 29,
        label: 'Help & Support',
        icon: 'bx-headphone',
        link: 'help-and-support',
        roles: ['CANDIDATE', 'PROMOTER', 'STAFF']
    },
    {
        id: 30,
        label: 'Profile Settings',
        icon: 'bxs-user-circle',
        link: 'profile',
        roles: ['CANDIDATE', 'PROMOTER', 'STAFF']
    },
    {
        id: 31,
        label: 'Logout',
        icon: 'bxs-log-out',
        link: '/auth/logout',
        roles: ['CANDIDATE', 'PROMOTER', 'STAFF']
    },

    
];