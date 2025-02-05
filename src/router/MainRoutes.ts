const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/',
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'Detailed Report',
            path: '/detailed-report',
            component: () => import('@/views/detailed-report/index.vue')
        },
        {
            name: 'Upload Data',
            path: '/upload-data',
            component: () => import('@/views/upload-data/index.vue')
        },
        {
            name: 'Settings',
            path: '/settings',
            component: () => import('@/views/settings/index.vue')
        },
        {
            name: 'Logout',
            path: '/logout',
            component: () => import('@/views/pages/SamplePage.vue')
        },
    ]
};

export default MainRoutes;
