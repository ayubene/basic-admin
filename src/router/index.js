import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue')
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/UserManagementView.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue')
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('@/views/ProductManagementView.vue')
    },
    {
        path: '/accrued',
        name: 'accrued',
        component: () => import('@/views/AccruedManagementView.vue')
    },
    
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
