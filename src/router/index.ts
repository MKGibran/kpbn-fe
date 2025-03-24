import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/auth/Error.vue')
        },
        ...[MainRoutes].map(route => ({ ...route, meta: { requiresAuth: true } })),
        ...[AuthRoutes]
    ] as RouteRecordRaw[] // Pastikan array sesuai dengan tipe `RouteRecordRaw[]`
});

// Navigation Guard untuk autentikasi
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('access_token'); // Cek token

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Jika halaman butuh login, tapi user belum login
        next('/auth/login');
    } else if (to.path === '/auth/login' && isAuthenticated) {
        // Jika user sudah login, cegah akses ke login
        next('/dashboard');
    } else {
        next();
    }
});

export default router;