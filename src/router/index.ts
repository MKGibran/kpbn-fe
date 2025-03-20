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
        ...[MainRoutes], // Gunakan spread untuk menyebarkan objek menjadi elemen array
        ...[AuthRoutes]
    ] as RouteRecordRaw[] // Pastikan array sesuai dengan tipe `RouteRecordRaw[]`
});