export class PajakService {
  /**
   * Menghitung PPh 21 bulanan berdasarkan perkiraan pendapatan setahun
   * @param gajiSebulan Gaji total sebulan sebelum dipotong pajak
   * @param ptkp Penghasilan Tidak Kena Pajak (PTKP) default
   * @returns Potongan PPh 21 untuk bulan tersebut
   */
  static hitungPPh21Bulanan(gajiSebulan: number, ptkp: number): number {
    const gajiSetahun = gajiSebulan * 12;
    
    // Penghasilan Kena Pajak (PKP)
    let pkp = gajiSetahun - ptkp;
    
    if (pkp <= 0) {
      return 0; // Tidak kena pajak
    }

    let pph21Setahun = 0;

    // Layer 1: 0 - 60jt (5%)
    if (pkp > 0) {
      const porsi = Math.min(pkp, 60000000);
      pph21Setahun += porsi * 0.05;
      pkp -= porsi;
    }

    // Layer 2: 60jt - 250jt (15%)
    if (pkp > 0) {
      const porsi = Math.min(pkp, 190000000); // 250jt - 60jt
      pph21Setahun += porsi * 0.15;
      pkp -= porsi;
    }

    // Layer 3: 250jt - 500jt (25%)
    if (pkp > 0) {
      const porsi = Math.min(pkp, 250000000); // 500jt - 250jt
      pph21Setahun += porsi * 0.25;
      pkp -= porsi;
    }

    // Layer 4: 500jt - 5M (30%)
    if (pkp > 0) {
      const porsi = Math.min(pkp, 4500000000); // 5M - 500jt
      pph21Setahun += porsi * 0.30;
      pkp -= porsi;
    }

    // Layer 5: > 5M (35%)
    if (pkp > 0) {
      pph21Setahun += pkp * 0.35;
    }

    // PPh 21 bulanan = Setahun / 12
    return Math.round(pph21Setahun / 12);
  }
}
