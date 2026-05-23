import { ref } from 'vue';
export function useExport() {
    const isExporting = ref(false);
    const exportError = ref(null);
    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    };
    const handleExport = async (exportFn, filename) => {
        isExporting.value = true;
        exportError.value = null;
        try {
            const response = await exportFn();
            // Axios usually returns data in response.data for blobs
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/octet-stream'
            });
            // If filename is passed from Content-Disposition header, we can extract it:
            // const disposition = response.headers['content-disposition'];
            // Let's just use the provided filename for simplicity
            downloadBlob(blob, filename);
            return true;
        }
        catch (err) {
            exportError.value = 'Gagal mengunduh file';
            return false;
        }
        finally {
            isExporting.value = false;
        }
    };
    return {
        isExporting,
        exportError,
        handleExport,
        downloadBlob
    };
}
//# sourceMappingURL=useExport.js.map