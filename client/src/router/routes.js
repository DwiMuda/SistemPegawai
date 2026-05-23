export const routes = [
    // Auth routes
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { requiresAuth: false, layout: 'auth' },
    },
    // Admin routes
    {
        path: '/',
        redirect: '/admin/dashboard',
    },
    {
        path: '/admin',
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('@/pages/admin/DashboardPage.vue'),
            },
            // Pegawai
            {
                path: 'pegawai',
                name: 'PegawaiList',
                component: () => import('@/pages/admin/pegawai/PegawaiListPage.vue'),
            },
            {
                path: 'pegawai/:id',
                name: 'PegawaiDetail',
                component: () => import('@/pages/admin/pegawai/PegawaiDetailPage.vue'),
                props: true,
            },
            // Jabatan
            {
                path: 'jabatan',
                name: 'JabatanList',
                component: () => import('@/pages/admin/jabatan/JabatanListPage.vue'),
            },
            // Departemen
            {
                path: 'departemen',
                name: 'DepartemenList',
                component: () => import('@/pages/admin/departemen/DepartemenListPage.vue'),
            },
            // Absensi
            {
                path: 'absensi/rekap',
                name: 'AbsensiRekap',
                component: () => import('@/pages/admin/absensi/AbsensiRekapPage.vue'),
            },
            {
                path: 'absensi/validasi',
                name: 'AbsensiValidasi',
                component: () => import('@/pages/admin/absensi/AbsensiValidasiPage.vue'),
            },
            // Cuti
            {
                path: 'cuti',
                name: 'CutiApproval',
                component: () => import('@/pages/admin/cuti/CutiApprovalPage.vue'),
            },
            // Penggajian
            {
                path: 'penggajian',
                name: 'PenggajianList',
                component: () => import('@/pages/admin/penggajian/PenggajianListPage.vue'),
            },
            {
                path: 'penggajian/generate',
                name: 'PenggajianGenerate',
                component: () => import('@/pages/admin/penggajian/PenggajianGeneratePage.vue'),
            },
            {
                path: 'penggajian/:id',
                name: 'PenggajianDetail',
                component: () => import('@/pages/admin/penggajian/PenggajianDetailPage.vue'),
                props: true,
            },
            // Lembur
            {
                path: 'lembur',
                name: 'LemburApproval',
                component: () => import('@/pages/admin/lembur/LemburApprovalPage.vue'),
            },
            // Mutasi
            {
                path: 'mutasi',
                name: 'MutasiList',
                component: () => import('@/pages/admin/mutasi/MutasiPage.vue'),
            },
            // Laporan
            {
                path: 'laporan',
                name: 'Laporan',
                component: () => import('@/pages/admin/laporan/LaporanPage.vue'),
            },
            // Setting
            {
                path: 'setting',
                name: 'Setting',
                component: () => import('@/pages/admin/setting/SettingPage.vue'),
            },
        ],
    },
    // Pegawai (employee) routes
    {
        path: '/pegawai',
        component: () => import('@/layouts/PegawaiLayout.vue'),
        meta: { requiresAuth: true, role: 'pegawai' },
        children: [
            {
                path: 'dashboard',
                name: 'PegawaiDashboard',
                component: () => import('@/pages/pegawai/DashboardPage.vue'),
            },
            {
                path: 'absensi',
                name: 'PegawaiAbsensi',
                component: () => import('@/pages/pegawai/AbsensiPage.vue'),
            },
            {
                path: 'cuti',
                name: 'PegawaiCuti',
                component: () => import('@/pages/pegawai/CutiPage.vue'),
            },
            {
                path: 'slip-gaji',
                name: 'PegawaiSlipGaji',
                component: () => import('@/pages/pegawai/SlipGajiPage.vue'),
            },
            {
                path: 'lembur',
                name: 'PegawaiLembur',
                component: () => import('@/pages/pegawai/LemburPage.vue'),
            },
            {
                path: 'profile',
                name: 'PegawaiProfile',
                component: () => import('@/pages/pegawai/ProfilePage.vue'),
            },
        ],
    },
    // 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFoundPage.vue'),
    },
];
//# sourceMappingURL=routes.js.map