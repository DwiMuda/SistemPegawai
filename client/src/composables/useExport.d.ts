export declare function useExport(): {
    isExporting: import("vue").Ref<boolean, boolean>;
    exportError: import("vue").Ref<string | null, string | null>;
    handleExport: (exportFn: () => Promise<any>, filename: string) => Promise<boolean>;
    downloadBlob: (blob: Blob, filename: string) => void;
};
//# sourceMappingURL=useExport.d.ts.map