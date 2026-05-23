import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { routes } from './routes';
const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const allowedRole = to.meta.role;
    // Wait for auth initialization if needed (e.g. validating token on first load)
    // We'll trust localStorage for immediate navigation, API interceptor handles invalidation
    if (requiresAuth && !authStore.isAuthenticated) {
        return next('/login');
    }
    if (to.path === '/login' && authStore.isAuthenticated) {
        return next(authStore.isAdmin ? '/admin/dashboard' : '/pegawai/dashboard');
    }
    if (allowedRole && authStore.user) {
        if (allowedRole !== authStore.user.role) {
            // User doesn't have permission
            return next(authStore.isAdmin ? '/admin/dashboard' : '/pegawai/dashboard');
        }
    }
    next();
});
export default router;
//# sourceMappingURL=index.js.map