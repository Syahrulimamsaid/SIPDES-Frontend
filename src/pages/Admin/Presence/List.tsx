import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import {
  getDbPresences,
  saveDbPresences,
  getDbUsers,
  getDbLocations,
} from "../../../helpers/adminDb";
import { Presence } from "../../../interface/PresenceInterface";
import toast from "react-hot-toast";
import {
  Search,
  Calendar,
  Filter,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  User as UserIcon,
  X,
  Compass,
} from "lucide-react";

export default function List() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [filteredPresences, setFilteredPresences] = useState<Presence[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // CRUD Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [currentPresence, setCurrentPresence] = useState<Presence | null>(null);

  // Form edit states
  const [editStatus, setEditStatus] = useState<Presence["status"]>("");
  const [editInTime, setEditInTime] = useState("");
  const [editOutTime, setEditOutTime] = useState("");
  const [editDate, setEditDate] = useState("");

  const statusOptions = [
    { value: "hadir", label: "Hadir" },
    { value: "terlambat", label: "Terlambat" },
    { value: "alpa", label: "Alpa" },
    { value: "cuti", label: "Cuti" },
    { value: "pulang", label: "Pulang" },
  ];

  const statusFilterOptions = [
    { value: "hadir", label: "Hadir" },
    { value: "terlambat", label: "Terlambat" },
    { value: "alpa", label: "Alpa" },
    { value: "cuti", label: "Cuti" },
    { value: "pulang", label: "Pulang" },
  ];

  const loadData = () => {
    const data = getDbPresences();
    setPresences(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...presences];

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.user?.fullname.toLowerCase().includes(q) ||
          p.user?.village?.name.toLowerCase().includes(q)
      );
    }

    if (filterDate !== "") {
      result = result.filter((p) => p.date === filterDate);
    }

    if (filterStatus !== "") {
      result = result.filter((p) => p.status === filterStatus);
    }

    setFilteredPresences(result);
  }, [presences, searchTerm, filterDate, filterStatus]);

  const handleEditClick = (presence: Presence) => {
    setCurrentPresence(presence);
    setEditStatus(presence.status);
    setEditInTime(presence.in || "");
    setEditOutTime(presence.out || "");
    setEditDate(presence.date || "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPresence) return;

    const updated = presences.map((p) => {
      if (p.id === currentPresence.id) {
        return {
          ...p,
          status: editStatus,
          in: editInTime,
          out: editOutTime,
          date: editDate,
        };
      }
      return p;
    });

    saveDbPresences(updated);
    toast.success("Presensi berhasil diperbarui!");
    loadData();
    setIsEditOpen(false);
  };

  const handleDeleteClick = (presence: Presence) => {
    setCurrentPresence(presence);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentPresence) return;

    const updated = presences.filter((p) => p.id !== currentPresence.id);
    saveDbPresences(updated);
    toast.success("Catatan presensi berhasil dihapus!");
    loadData();
    setIsDeleteOpen(false);
  };

  const handleMapClick = (presence: Presence) => {
    setCurrentPresence(presence);
    setIsMapOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "terlambat":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
      case "alpa":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "cuti":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterStatus("");
    toast.success("Filter dibersihkan!");
  };

  return (
    <>
      <PageMeta
        title="Riwayat Presensi Perangkat - SIPDES"
        description="Daftar log presensi semua perangkat desa"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              List Presensi Perangkat
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola dan pantau seluruh catatan absensi perangkat desa di wilayah Anda.
            </p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 items-end">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cari Perangkat / Desa
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <input
                  type="text"
                  placeholder="Nama atau Desa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tanggal Presensi
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-9 pr-4 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:color-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status Kehadiran
              </label>
              <Select
                options={statusFilterOptions}
                placeholder="Semua Status"
                onChange={(val) => setFilterStatus(val)}
                defaultValue={filterStatus}
              />
            </div>

            {/* Clear filters Button */}
            <div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full h-11 flex justify-center items-center gap-2"
                startIcon={<X size={16} />}
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-4">Perangkat Desa</th>
                  <th className="px-6 py-4">Desa</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Jam Masuk</th>
                  <th className="px-6 py-4">Jam Pulang</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Lokasi</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredPresences.length > 0 ? (
                  filteredPresences.map((pres) => (
                    <tr
                      key={pres.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {pres.user?.fullname || "N/A"}
                        <p className="text-xs font-normal text-gray-400 mt-0.5">
                          {pres.user?.phone_number || "-"}
                        </p>
                      </td>

                      {/* Village */}
                      <td className="px-6 py-4">
                        {pres.user?.village?.name || "N/A"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pres.date}
                      </td>

                      {/* In Time */}
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                        {pres.in ? (
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-emerald-500" />
                            {pres.in}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>

                      {/* Out Time */}
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                        {pres.out ? (
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-brand-500" />
                            {pres.out}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(
                            pres.status
                          )}`}
                        >
                          {pres.status || "Belum Absen"}
                        </span>
                      </td>

                      {/* Map Location */}
                      <td className="px-6 py-4 text-center">
                        {pres.in_lat ? (
                          <button
                            onClick={() => handleMapClick(pres)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:underline mx-auto"
                          >
                            <MapPin size={14} /> Lihat Detail
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(pres)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(pres)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada data presensi yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Edit Presensi */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Catatan Presensi
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Profile Brief */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <UserIcon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {currentPresence?.user?.fullname}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentPresence?.user?.village?.name}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Tanggal Presensi
                </label>
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                />
              </div>

              {/* Time In */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Jam Masuk
                </label>
                <Input
                  type="text"
                  placeholder="08:00:00"
                  value={editInTime}
                  onChange={(e) => setEditInTime(e.target.value)}
                />
              </div>

              {/* Time Out */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Jam Pulang
                </label>
                <Input
                  type="text"
                  placeholder="17:00:00"
                  value={editOutTime}
                  onChange={(e) => setEditOutTime(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Status Presensi
                </label>
                <Select
                  options={statusOptions}
                  placeholder="Pilih Status"
                  onChange={(val) => setEditStatus(val as Presence["status"])}
                  defaultValue={editStatus}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Delete Confirmation */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-sm p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Hapus Presensi?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus catatan presensi untuk{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {currentPresence?.user?.fullname}
                </span>{" "}
                pada tanggal <span className="font-semibold">{currentPresence?.date}</span>?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeleteOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 border-none"
                onClick={handleConfirmDelete}
              >
                Hapus
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Map Coordinate Detail */}
        <Modal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} className="max-w-lg p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass className="text-brand-500" /> Detail Lokasi & Geofence
              </h3>
            </div>

            <div className="space-y-4">
              {/* User and Location context */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {currentPresence?.user?.fullname}
                </h4>
                <p className="text-xs text-gray-400">
                  Desa: {currentPresence?.user?.village?.name} | Titik Presensi:{" "}
                  {currentPresence?.location_access?.description || "Utama"}
                </p>
              </div>

              {/* Coordinates details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">
                    Koordinat Masuk
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Lat: {currentPresence?.in_lat}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    Lng: {currentPresence?.in_long}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full dark:bg-green-500/10 dark:text-green-400">
                    Dalam Radius
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">
                    Koordinat Pulang
                  </span>
                  {currentPresence?.out_lat ? (
                    <>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        Lat: {currentPresence?.out_lat}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        Lng: {currentPresence?.out_long}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full dark:bg-green-500/10 dark:text-green-400">
                        Dalam Radius
                      </span>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 italic pt-2">Belum absensi pulang</p>
                  )}
                </div>
              </div>

              {/* Mock premium map visual representation */}
              <div className="relative overflow-hidden h-48 w-full rounded-2xl bg-slate-100 border border-gray-200 dark:bg-slate-800 dark:border-gray-700 flex flex-col justify-center items-center">
                {/* Radial Geofence Circle Mock */}
                <div className="absolute h-36 w-36 rounded-full bg-brand-500/10 border-2 border-brand-500/30 flex items-center justify-center animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-brand-500"></div>
                </div>

                {/* Presence user marker */}
                <div className="absolute transform -translate-x-6 -translate-y-4 flex flex-col items-center">
                  <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg border border-white">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-[10px] bg-slate-900/80 text-white px-1.5 py-0.5 rounded-md mt-1 backdrop-blur-xs font-medium">
                    Lokasi Presensi
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1">
                  <MapPin size={10} /> Geofence Aktif (Radius 100m)
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setIsMapOpen(false)} className="w-full">
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
