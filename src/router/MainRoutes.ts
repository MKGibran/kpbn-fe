import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

const MainRoutes = {
    path: '/',
    meta: {
        requiresAuth: true
    },
    redirect: '/dashboard', // Redirect ke halaman utama yang valid
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: 'dashboard', // Ubah dari '/' ke 'dashboard'
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'Detailed Report',
            path: 'detailed-report',
            component: () => import('@/views/detailed-report/index.vue')
        },
        {
            name: 'Upload Data',
            path: 'upload-data',
            component: () => import('@/views/upload-data/index.vue')
        },
        {
            name: 'Settings',
            path: 'settings',
            component: () => import('@/views/settings/index.vue')
        },
        {
            name: 'Notifications',
            path: 'notifications',
            component: () => import('@/views/notifications/index.vue')
        },
        {
            name: 'Logout',
            path: 'logout',
            beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
                localStorage.removeItem('token');
                sessionStorage.removeItem('user');
                next('/auth/login');
            }
        }
    ]
};

export default MainRoutes;