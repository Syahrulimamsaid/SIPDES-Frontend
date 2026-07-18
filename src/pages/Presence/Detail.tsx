
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { Compass, LogIn, LogOut } from "lucide-react";
import { Presence } from "../../interface/PresenceInterface";
import Map from "../../components/custom/Map";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  presence: Presence | null;
}

export default function DetailModal({ isOpen, onClose, presence }: DetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl p-6 sm:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="text-brand-500" /> Detail Lokasi
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">
              {presence?.user?.fullname}
            </h4>
            <p className="text-xs text-gray-400">
              Desa: {presence?.user?.village?.name} | Titik Presensi:{" "}
              {presence?.location_access?.description || "Utama"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/55 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <LogIn size={16} />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Lokasi Masuk</h5>
                    {presence?.in_lat && Number(presence?.in_lat) !== 0 ? (
                      <p className="text-[11px] text-gray-400">
                        Lat: {presence?.in_lat} | Lng: {presence?.in_long}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">Belum melakukan presensi masuk</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden h-64 w-full rounded-2xl bg-slate-100 border border-gray-200 dark:bg-slate-800 dark:border-gray-700 flex flex-col justify-center items-center">
                {presence?.in_lat && Number(presence?.in_lat) !== 0 ? (
                  <Map
                    lat={Number(presence?.in_lat)}
                    long={Number(presence?.in_long)}
                    animateMove={true}
                    className="h-full w-full rounded-2xl z-0"
                  />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-400 italic">Peta tidak tersedia (Belum absen masuk)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/55 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <LogOut size={16} />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Lokasi Pulang</h5>
                    {presence?.out_lat && Number(presence?.out_lat) !== 0 ? (
                      <p className="text-[11px] text-gray-400">
                        Lat: {presence?.out_lat} | Lng: {presence?.out_long}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">Belum melakukan presensi pulang</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden h-64 w-full rounded-2xl bg-slate-100 border border-gray-200 dark:bg-slate-800 dark:border-gray-700 flex flex-col justify-center items-center">
                {presence?.out_lat && Number(presence?.out_lat) !== 0 ? (
                  <Map
                    lat={Number(presence?.out_lat)}
                    long={Number(presence?.out_long)}
                    animateMove={true}
                    className="h-full w-full rounded-2xl z-0"
                  />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-400 italic">Peta tidak tersedia (Belum absen pulang)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="w-full">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
