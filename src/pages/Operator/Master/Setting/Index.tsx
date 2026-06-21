import { useEffect, useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { Modal } from "../../../../components/ui/modal";
import {
  getDbLocations,
  saveDbLocations,
  getDbVillages,
} from "../../../../helpers/adminDb";
import { Location } from "../../../../interface/LocationInterface";
import { Village } from "../../../../interface/VillageInterface";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Compass,
  Layers,
  Building,
} from "lucide-react";

export default function Setting() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // CRUD Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formLat, setFormLat] = useState("");
  const [formLng, setFormLng] = useState("");
  const [formRadius, setFormRadius] = useState("");
  const [formVillageId, setFormVillageId] = useState("");

  // Dropdown options
  const villageOptions = villages.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const loadData = () => {
    setLocations(getDbLocations());
    setVillages(getDbVillages());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter locations by search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredLocations(
        locations.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            (l.Village?.name || "").toLowerCase().includes(q)
        )
      );
    }
  }, [locations, searchTerm]);

  const resetForm = () => {
    setFormName("");
    setFormLat("");
    setFormLng("");
    setFormRadius("");
    setFormVillageId("");
    setCurrentLocation(null);
  };

  const handleAddClick = () => {
    resetForm();
    if (villages.length > 0) {
      setFormVillageId(villages[0].id);
    }
    setIsAddOpen(true);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() === "" || formLat === "" || formLng === "" || formRadius === "") {
      toast.error("Semua kolom input wajib diisi!");
      return;
    }

    const newLoc: Location = {
      id: "L" + Date.now(),
      name: formName,
      lat: Number(formLat),
      lng: Number(formLng),
      radius: Number(formRadius),
      villageId: formVillageId,
    };

    const updated = [...locations.map(({ Village, ...rest }) => rest), newLoc];
    saveDbLocations(updated);
    toast.success("Area presensi berhasil ditambahkan!");
    loadData();
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditClick = (loc: Location) => {
    setCurrentLocation(loc);
    setFormName(loc.name);
    setFormLat(loc.lat.toString());
    setFormLng(loc.lng.toString());
    setFormRadius(loc.radius.toString());
    setFormVillageId(loc.villageId);
    setIsEditOpen(true);
  };

  const handleUpdateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLocation) return;

    if (formName.trim() === "" || formLat === "" || formLng === "" || formRadius === "") {
      toast.error("Semua kolom input wajib diisi!");
      return;
    }

    const updated = locations.map((loc) => {
      if (loc.id === currentLocation.id) {
        return {
          id: loc.id,
          name: formName,
          lat: Number(formLat),
          lng: Number(formLng),
          radius: Number(formRadius),
          villageId: formVillageId,
        };
      }
      // Remove Village relation before saving to preserve JSON clean format
      const { Village, ...rest } = loc;
      return rest;
    });

    saveDbLocations(updated);
    toast.success("Area presensi berhasil diperbarui!");
    loadData();
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteClick = (loc: Location) => {
    setCurrentLocation(loc);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentLocation) return;

    const updated = locations
      .filter((loc) => loc.id !== currentLocation.id)
      .map(({ Village, ...rest }) => rest);
    saveDbLocations(updated);
    toast.success("Area presensi berhasil dihapus!");
    loadData();
    setIsDeleteOpen(false);
    resetForm();
  };

  return (
    <>
      <PageMeta
        title="Pengaturan Area Presensi - SIPDES"
        description="Konfigurasi geofence koordinat dan radius presensi perangkat"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Pengaturan Presensi (Geofence)
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Konfigurasi radius aman presensi, koordinat latitude & longitude di setiap wilayah kantor desa.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 self-start sm:self-auto"
            startIcon={<Plus size={18} />}
          >
            Tambah Titik Presensi
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Geofence List & CRUD Table */}
          <div className="xl:col-span-8 space-y-6">
            {/* Search Input */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="max-w-md space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cari Titik Koordinat / Desa
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                  <input
                    type="text"
                    placeholder="Nama lokasi presensi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    <tr>
                      <th className="px-5 py-4">Titik Presensi</th>
                      <th className="px-5 py-4">Desa Wilayah</th>
                      <th className="px-5 py-4">Koordinat (Lat / Lng)</th>
                      <th className="px-5 py-4">Radius Aman</th>
                      <th className="px-5 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <tr
                          key={loc.id}
                          className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                            {loc.name}
                          </td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1.5">
                              <Building size={14} className="text-gray-400" />
                              {loc.Village?.name || "N/A"}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            <div className="text-xs">Lat: {loc.lat}</div>
                            <div className="text-xs">Lng: {loc.lng}</div>
                          </td>
                          <td className="px-5 py-4 font-bold text-brand-600 dark:text-brand-400">
                            {loc.radius} Meter
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(loc)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                                title="Edit Area"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(loc)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                                title="Hapus Area"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-gray-400 dark:text-gray-600">
                          Belum ada area presensi dikonfigurasi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Interactive Mock Map Visualizer */}
          <div className="xl:col-span-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass className="text-brand-500" /> Visualisasi Peta Jangkauan
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pilih atau lihat cakupan geofencing dari radius kantor desa yang terdaftar.
              </p>

              {/* Mock Map widget */}
              <div className="relative h-64 w-full rounded-2xl bg-sky-50 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Simulated Grid/Water Map lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70"></div>

                {/* Map markers for villages */}
                {locations.map((loc, idx) => (
                  <div
                    key={loc.id}
                    className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                    style={{
                      top: `${25 + (idx * 20) % 60}%`,
                      left: `${20 + (idx * 25) % 70}%`,
                    }}
                    onClick={() => {
                      toast(`Koordinat: ${loc.name}\nLat: ${loc.lat}, Lng: ${loc.lng}`);
                    }}
                  >
                    {/* Simulated circular radius */}
                    <div
                      className="absolute rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center animate-pulse"
                      style={{
                        width: `${loc.radius / 1.5}px`,
                        height: `${loc.radius / 1.5}px`,
                      }}
                    ></div>
                    <div className="bg-brand-500 text-white p-1 rounded-full shadow-lg border border-white z-10">
                      <MapPin size={12} />
                    </div>
                    <span className="text-[9px] bg-slate-950/80 text-white px-1.5 py-0.5 rounded-md mt-1 backdrop-blur-xs font-semibold whitespace-nowrap z-10 shadow-sm border border-white/10">
                      {loc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400 border border-amber-500/10 flex items-start gap-2">
              <Layers size={18} className="shrink-0 mt-0.5" />
              <span>
                <strong>Informasi:</strong> Perangkat desa hanya dapat melakukan presensi kehadiran jika GPS perangkat berada di dalam geofence (radius aman) diatas.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Tambah Area */}
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Tambah Area Presensi Baru
            </h3>

            <form onSubmit={handleCreateLocation} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Titik Lokasi
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Kantor Desa Melati Baru"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Village select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Pilih Wilayah Desa
                </label>
                <Select
                  options={villageOptions}
                  placeholder="Pilih Desa"
                  onChange={(val) => setFormVillageId(val)}
                  defaultValue={formVillageId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Latitude */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Latitude
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: -5.1476"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                    required
                  />
                </div>

                {/* Longitude */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Longitude
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: 119.4328"
                    value={formLng}
                    onChange={(e) => setFormLng(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Radius */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Radius Jangkauan (Meter)
                </label>
                <Input
                  type="number"
                  placeholder="Contoh: 100"
                  value={formRadius}
                  onChange={(e) => setFormRadius(e.target.value)}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Area
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Edit Area */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Ubah Area Presensi
            </h3>

            <form onSubmit={handleUpdateLocation} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Titik Lokasi
                </label>
                <Input
                  type="text"
                  placeholder="Nama Lokasi"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Village select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Pilih Wilayah Desa
                </label>
                <Select
                  options={villageOptions}
                  placeholder="Pilih Desa"
                  onChange={(val) => setFormVillageId(val)}
                  defaultValue={formVillageId}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Latitude */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Latitude
                  </label>
                  <Input
                    type="text"
                    placeholder="Latitude"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                    required
                  />
                </div>

                {/* Longitude */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Longitude
                  </label>
                  <Input
                    type="text"
                    placeholder="Longitude"
                    value={formLng}
                    onChange={(e) => setFormLng(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Radius */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Radius Jangkauan (Meter)
                </label>
                <Input
                  type="number"
                  placeholder="Radius"
                  value={formRadius}
                  onChange={(e) => setFormRadius(e.target.value)}
                  required
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
                Hapus Titik Presensi?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus area presensi{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {currentLocation?.name}
                </span>
                ? Perangkat di wilayah ini tidak akan dapat login presensi sementara waktu.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleteOpen(false)}>
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
      </div>
    </>
  );
}
