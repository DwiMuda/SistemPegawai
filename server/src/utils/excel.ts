import ExcelJS from 'exceljs';

export interface RekapPenggajianData {
  periodeBulan: number;
  periodeTahun: number;
  data: Array<{
    nip: string;
    namaLengkap: string;
    departemen: string;
    jabatan: string;
    gajiPokok: number;
    tunjangan: number;
    potongan: number;
    totalGaji: number;
    status: string;
  }>;
}

export async function generateRekapPenggajianExcel(data: RekapPenggajianData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Rekap Gaji');

  // Title
  worksheet.mergeCells('A1:I1');
  worksheet.getCell('A1').value = `REKAPITULASI PENGGAJIAN - PERIODE ${data.periodeBulan}/${data.periodeTahun}`;
  worksheet.getCell('A1').font = { size: 14, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // Headers
  const headers = ['No', 'NIP', 'Nama Pegawai', 'Departemen', 'Jabatan', 'Gaji Pokok', 'Tunjangan', 'Potongan', 'Total Gaji', 'Status'];
  const headerRow = worksheet.addRow(headers);
  
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Data
  data.data.forEach((item, index) => {
    const row = worksheet.addRow([
      index + 1,
      item.nip,
      item.namaLengkap,
      item.departemen,
      item.jabatan,
      item.gajiPokok,
      item.tunjangan,
      item.potongan,
      item.totalGaji,
      item.status.toUpperCase()
    ]);

    // Format currency columns
    row.getCell(6).numFmt = '"Rp"#,##0';
    row.getCell(7).numFmt = '"Rp"#,##0';
    row.getCell(8).numFmt = '"Rp"#,##0';
    row.getCell(9).numFmt = '"Rp"#,##0';

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Set column widths
  worksheet.getColumn(1).width = 5;
  worksheet.getColumn(2).width = 15;
  worksheet.getColumn(3).width = 30;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 18;
  worksheet.getColumn(7).width = 18;
  worksheet.getColumn(8).width = 18;
  worksheet.getColumn(9).width = 18;
  worksheet.getColumn(10).width = 15;

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
