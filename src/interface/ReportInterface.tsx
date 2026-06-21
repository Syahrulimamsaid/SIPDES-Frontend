import { Presence } from "./PresenceInterface";
import { User } from "./UserInterface";

export interface ReportPresence {
  user: User;
  alpa: number;
  jumlah_cuti_izin: number;
  jumlah_hadir_tepat_waktu: number;
  jumlah_terlambat: number;
  persentase_kehadiran: number;
  presence: Presence[] | []
} 
