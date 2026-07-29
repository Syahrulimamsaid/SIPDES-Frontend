export interface Stats {
  user_total: number;
  location_total: number;
  village_name: string;
  village_total: number;
}

export interface StatsPresence {
  presence_total: number;
  presence_user_total: number;
  hadir_total: number;
  terlambat_total: number;
  user_terlambat_total:number;
  belum_absen_total: number;
  alpha_total: number;
  presentase_hadir: number;
  presence_status: {
    bulan: string;
    tepat_waktu: number;
    terlambat: number;
  }[];
}