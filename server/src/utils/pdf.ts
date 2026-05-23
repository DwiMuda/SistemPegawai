import PDFDocument from 'pdfkit';

export interface SlipGajiData {
  periodeBulan: number;
  periodeTahun: number;
  pegawai: {
    nip: string;
    namaLengkap: string;
    jabatan: string;
    departemen: string;
  };
  pendapatan: {
    gajiPokok: number;
    tunjanganJabatan: number;
    tunjanganTransport: number;
    tunjanganMakan: number;
    upahLembur: number;
    bonus: number;
    total: number;
  };
  potongan: {
    absensi: number;
    bpjs: number;
    pajak: number;
    lainLain: number;
    total: number;
  };
  totalGaji: number;
  statusBayar: string;
  tanggalBayar?: Date | null;
}

export function generateSlipGajiPDF(data: SlipGajiData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
      };

      const namaBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ][data.periodeBulan - 1];

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('PT MAJU MUNDUR', { align: 'center' });
      doc.fontSize(14).text('SLIP GAJI KARYAWAN', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text(`Periode: ${namaBulan} ${data.periodeTahun}`, { align: 'center' });
      doc.moveDown(2);

      // Info Pegawai
      doc.fontSize(10);
      doc.text(`NIP         : ${data.pegawai.nip}`);
      doc.text(`Nama        : ${data.pegawai.namaLengkap}`);
      doc.text(`Jabatan     : ${data.pegawai.jabatan}`);
      doc.text(`Departemen  : ${data.pegawai.departemen}`);
      doc.moveDown(1);

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      const leftCol = 50;
      const rightCol = 350;

      // PENDAPATAN
      doc.font('Helvetica-Bold').text('PENDAPATAN', leftCol);
      doc.font('Helvetica');
      doc.text('Gaji Pokok', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.gajiPokok), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('Tunjangan Jabatan', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.tunjanganJabatan), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('Tunjangan Transport', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.tunjanganTransport), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('Tunjangan Makan', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.tunjanganMakan), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('Upah Lembur', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.upahLembur), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('Bonus', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.bonus), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold');
      doc.text('Total Pendapatan', leftCol, doc.y); doc.text(formatCurrency(data.pendapatan.total), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.moveDown(1.5);

      // POTONGAN
      doc.text('POTONGAN', leftCol);
      doc.font('Helvetica');
      doc.text('Potongan Absensi', leftCol, doc.y); doc.text(formatCurrency(data.potongan.absensi), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('BPJS Ketenagakerjaan & Kesehatan', leftCol, doc.y); doc.text(formatCurrency(data.potongan.bpjs), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('PPh 21', leftCol, doc.y); doc.text(formatCurrency(data.potongan.pajak), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.text('Potongan Lain-lain', leftCol, doc.y); doc.text(formatCurrency(data.potongan.lainLain), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold');
      doc.text('Total Potongan', leftCol, doc.y); doc.text(formatCurrency(data.potongan.total), rightCol, doc.y - 12, { align: 'right', width: 200 });
      doc.moveDown(1.5);

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // TOTAL DITERIMA
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('TOTAL GAJI DITERIMA (TAKE HOME PAY)', leftCol, doc.y); 
      doc.text(formatCurrency(data.totalGaji), rightCol, doc.y - 14, { align: 'right', width: 200 });
      doc.moveDown(2);

      // Footer
      doc.fontSize(10).font('Helvetica');
      doc.text(`Status  : ${data.statusBayar.toUpperCase()}`, leftCol);
      if (data.tanggalBayar) {
        doc.text(`Tanggal Dibayar : ${new Date(data.tanggalBayar).toLocaleDateString('id-ID')}`, leftCol);
      }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
