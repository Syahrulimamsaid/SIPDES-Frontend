import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import TimePicker from "../../components/form/time-picker";
import PresenceController from "../../controller/PresenceController";
import UserController from "../../controller/UserController";
import { Toast } from "../../components/ui/alert/Toast";
import { catchHandle } from "../../helpers/catchHandle";
import { User } from "../../interface/UserInterface";
import { Location } from "../../interface/LocationInterface";
import { ArrowLeft, User as UserIcon, Clock, Compass } from "lucide-react";
import DropDownSearch from "../../components/form/input/DropDownSearch";
import LocationController from "../../controller/LocationController";
import { LocationAccess } from "../../interface/LocationAccessInterface";
import Map from "../../components/custom/Map";

export default function AddPresence() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const presenceController = new PresenceController();
  const userController = new UserController();
  const locationController = new LocationController();

  const [users, setUsers] = useState<User[]>([]);
  const [locationAccess, setLocationAccess] = useState<LocationAccess[]>([]);
  const [selectLocation, setSelectLocation] = useState<Location | null>(null);

  const [presence, setPresence] = useState({
    locationAccessId: "",
    date: "",
    inTime: "",
    outTime: "",
    status: "hadir",
    userId: "",
  });

  const statusOptions = [
    { value: "hadir", label: "Hadir" },
    { value: "terlambat", label: "Terlambat" },
    { value: "alpa", label: "Alpa" },
    { value: "cuti", label: "Cuti" },
    { value: "pulang", label: "Pulang" },
  ];

  const handleSetLocation = (locId: string) => {
    const loc = locationAccess.find(l => l.id === locId);
    if (loc) {
      setSelectLocation({
        id: loc.id ?? "",
        name: loc.location?.name ?? "",
        lat: loc.location?.lat ?? 0,
        lng: loc.location?.lng ?? 0,
      });
      setPresence(prev => ({ ...prev, locationAccessId: loc.id }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presence.userId) {
      Toast({ message: "Pilih Perangkat Desa terlebih dahulu", variant: "error" });
      return;
    }
    if (!presence.date) {
      Toast({ message: "Tanggal wajib diisi", variant: "error" });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId: presence.userId,
        in: presence.inTime ? `${presence.date}T${presence.inTime}` : undefined,
        out: presence.outTime ? `${presence.date}T${presence.outTime}` : undefined,
        status: presence.status,
        locationAccessId: presence.locationAccessId || undefined,
      };

      await presenceController.create(payload);
      Toast({ message: "Presensi berhasil ditambahkan", variant: "success" });
      navigate("/operator/presensi");
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const users = await userController.get();
      setUsers(users);
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    }
  }

  const getLocationAccess = async (userId: string) => {
    try {
      const locationAccess = await locationController.getByAccessUser(userId);
      setLocationAccess(locationAccess);
    } catch (error) {
      catchHandle({ err: error, variant: "error" });
    }
  }

  useEffect(() => {
    getUser();

    const today = new Date().toISOString().split("T")[0];
    setPresence(prev => ({ ...prev, date: today }));
  }, []);


  useEffect(() => {
    if (presence.userId) {
      getLocationAccess(presence.userId);
      setSelectLocation(null);
      setPresence(prev => ({ ...prev, locationId: "" }));
    } else {
      setLocationAccess([]);
      setSelectLocation(null);
      setPresence(prev => ({ ...prev, locationId: "" }));
    }
  }, [presence.userId]);

  return (
    <>
      <PageMeta
        title="Tambah Presensi Perangkat - SIPDES"
        description="Tambah data log presensi manual"
      />
      <div className="space-y-6 mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/operator/presensi")}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Tambah Presensi
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Input catatan kehadiran perangkat desa baru secara manual.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <UserIcon size={18} className="text-brand-500" /> Informasi Utama
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DropDownSearch
                data={users}
                value={users.find(u => u.id === presence.userId) || null}
                onChange={(user) => setPresence(prev => ({ ...prev, userId: user ? user.id : "" }))}
                label="Cari & Pilih Perangkat Desa"
                placeholder="Ketik nama perangkat desa..."
                getDisplayValue={(user) => user.fullname}
                getSearchText={(user) => `${user.fullname} ${user.village?.name || ""} ${user.phone_number}`}
                renderItem={(user) => (
                  <>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.fullname}</p>
                      <p className="text-xs text-gray-400">{user.village?.name || "Tanpa Desa"}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {user.phone_number}
                    </span>
                  </>
                )}
                renderSelected={(user) => (
                  <>Terpilih: {user.fullname} - {user.village?.name || "Tanpa Desa"}</>)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tanggal Presensi
                </label>
                <DatePicker
                  id="presenceDate"
                  defaultDate={presence.date}
                  placeholder="Pilih Tanggal"
                  onChange={(_selectedDates: any, dateStr: string) => {
                    setPresence(prev => ({ ...prev, date: dateStr }));
                  }}
                  maxDate={new Date()}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status Kehadiran
                </label>
                <Select
                  options={statusOptions}
                  placeholder="Pilih Status"
                  onChange={(val) => setPresence(prev => ({ ...prev, status: val }))}
                  defaultValue={presence.status}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-emerald-500" /> Jam Masuk
                </label>
                <TimePicker
                  id="inTime"
                  defaultDate={presence.inTime}
                  placeholder="Pilih Jam Masuk"
                  onChange={(_selectedDates: any, dateStr: string) => {
                    setPresence(prev => ({ ...prev, inTime: dateStr }));
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-brand-500" /> Jam Pulang
                </label>
                <TimePicker
                  id="outTime"
                  defaultDate={presence.outTime}
                  placeholder="Pilih Jam Pulang"
                  onChange={(_selectedDates: any, dateStr: string) => {
                    setPresence(prev => ({ ...prev, outTime: dateStr }));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Compass size={18} className="text-brand-500" /> Konfigurasi Lokasi
            </h3>

            <div className="space-y-1.5 max-w-md">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Titik Koordinat Acuan (Kantor)
              </label>
              <Select
                options={locationAccess.map((item: any) => ({
                  value: item.id,
                  label: item.location?.name,
                }))}
                placeholder="Pilih Titik Kantor"
                onChange={handleSetLocation}
                defaultValue={presence.locationAccessId}
              />
              <p className="text-[10px] text-gray-400">
                Pilih untuk mengisi koordinat masuk/pulang secara otomatis sesuai geofence kantor.
              </p>
            </div>

            {selectLocation ? (
              <div className="space-y-4">
                <div className="relative overflow-hidden h-72 w-full rounded-2xl bg-slate-100 border border-gray-200 dark:bg-slate-800 dark:border-gray-700 z-0">
                  <Map
                    lat={Number(selectLocation.lat)}
                    long={Number(selectLocation.lng)}
                    animateMove={true}
                    className="h-full w-full rounded-2xl z-0"
                  />
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Latitude:</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">{selectLocation.lat}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">Longitude:</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">{selectLocation.lng}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/50 dark:bg-gray-900/50">
                <Compass className="mx-auto text-gray-400 dark:text-gray-600 mb-3 animate-pulse" size={32} />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Belum ada lokasi kantor yang dipilih
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Silakan pilih titik koordinat acuan di atas untuk menampilkan peta lokasi presensi.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                type="button"
                className="px-6"
                onClick={() => navigate("/operator/presensi")}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-6"
                disabled={loading || !presence.userId}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
