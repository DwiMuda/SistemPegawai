import { ref, watch, onMounted } from 'vue';
const isDark = ref(false);
export function useDarkMode() {
    onMounted(() => {
        // Load from localStorage
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            isDark.value = stored === 'true';
        }
        else {
            // Check system preference
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyTheme();
    });
    watch(isDark, () => {
        applyTheme();
        localStorage.setItem('darkMode', String(isDark.value));
    });
    function applyTheme() {
        if (isDark.value) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }
    function toggleDarkMode() {
        isDark.value = !isDark.value;
    }
    return {
        isDark,
        toggleDarkMode,
    };
}
//# sourceMappingURL=useDarkMode.js.map