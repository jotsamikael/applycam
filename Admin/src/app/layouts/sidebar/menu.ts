import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    // Superadmin -> Operational (EXISTANT)
    {
        id: 1,
        label: 'OPERATIONAL',
        isTitle: true,
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 2,
        label: 'Overview',
        icon: 'bx-home',
        link: 'overview-staff',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 3,
        label: 'Training Centers',
        icon: 'bx-building-house',
        link: 'training-centers-management',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 4,
        label: 'Candidates',
        icon: 'bx-user',
        link: 'candidates-management',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 5,
        label: 'Staff Management',
        icon: 'bx-group',
        link: 'staff-management',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 6,
        label: 'Payment Gateways',
        icon: 'bx-credit-card',
        link: 'payment-gateway-management',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 7,
        label: 'Cron Jobs',
        icon: 'bx-time-five',
        link: 'cron-job-management',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 8,
        label: 'Help & Support',
        icon: 'bx-support',
        link: 'support-management',
        roles: ['super_admin', 'STAFF']
    },

    // Superadmin -> Settings (EXISTANT)
    
  // Admin/Staff - Results
    {
        id: 35,
        label: 'Results Management',
        icon: 'bx-table',
        link: 'results-management',
        roles: ['super_admin', 'STAFF']
    },

     // System Components
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
        
   // Admin/Staff - Exam Management
    {
        id: 33,
        label: 'Exam Centers',
        link: 'exam-centers-management',
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
        id: 9,
        label: 'APP SETTINGS',
        isTitle: true,
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 10,
        label: 'Page Settings',
        icon: 'bx-cog',
        link: 'page-settings',
        roles: ['super_admin', 'STAFF']
    },
    {
        id: 11,
        icon: 'bx-shield',
        label: 'Admin & Role',
        roles: ['super_admin', 'STAFF'],
        subItems: [
            {
                id: 12,
                label: 'Admin',
                link: 'admin-settings',
                parentId: 11,
                icon: 'bx-user'
            },
            {
                id: 13,
                label: 'Roles',
                link: 'role-settings',
                parentId: 11,
                icon: 'bx-key'
            }
        ]
    },
    {
        id: 14,
        icon: 'bx-code-alt',
        label: 'Developer Settings',
        roles: ['super_admin', 'admin', 'STAFF'],
        subItems: [
            {
                id: 15,
                label: 'App Settings',
                link: 'app-settings',
                parentId: 14,
                icon: 'bx-slider-alt'
            },
            {
                id: 16,
                label: 'SMTP Settings',
                link: 'smtp-settings',
                parentId: 14,
                icon: 'bx-envelope'
            },
            {
                id: 17,
                label: 'Storage Settings',
                link: 'storage-settings',
                parentId: 14,
                icon: 'bx-server'
            }
        ]
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