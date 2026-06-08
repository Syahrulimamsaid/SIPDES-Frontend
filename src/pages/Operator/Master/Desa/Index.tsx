import { useEffect, useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import { Modal } from "../../../../components/ui/modal";
import { getDbVillages, saveDbVillages } from "../../../../helpers/adminDb";
import { Village } from "../../../../interface/VillageInterface";
import toast from "react-hot-toast";
import { Search, Plus, Edit2, Trash2, Building, MapPin } from "lucide-react";

export default function DesaManagement() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // CRUD Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentVillage, setCurrentVillage] = useState<Village | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");

  const loadData = () => {
    setVillages(getDbVillages());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter villages by search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVillages(villages);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredVillages(
        villages.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            (v.address || "").toLowerCase().includes(q)
        )
      );
    }
  }, [villages, searchTerm]);

  const resetForm = () => {
    setFormName("");
    setFormAddress("");
    setCurrentVillage(null);
  };

  const handleAddClick = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleCreateVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName.trim() === "") {
      toast.error("Nama desa wajib diisi!");
      return;
    }

    const newVillage: Village = {
      id: "V" + Date.now(),
      name: formName,
      address: formAddress,
      districtId: "D1",
    };

    const updated = [...villages, newVillage];
    saveDbVillages(updated);
    toast.success("Desa berhasil ditambahkan!");
    loadData();
    setIsAddOpen(false);
    resetForm();
  };

  const handleEditClick = (village: Village) => {
    setCurrentVillage(village);
    setFormName(village.name);
    setFormAddress(village.address || "");
    setIsEditOpen(true);
  };

  const handleUpdateVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVillage) return;

    if (formName.trim() === "") {
      toast.error("Nama desa wajib diisi!");
      return;
    }

    const updated = villages.map((v) => {
      if (v.id === currentVillage.id) {
        return {
          ...v,
          name: formName,
          address: formAddress,
        };
      }
      return v;
    });

    saveDbVillages(updated);
    toast.success("Nama desa berhasil diperbarui!");
    loadData();
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteClick = (village: Village) => {
    setCurrentVillage(village);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentVillage) return;

    const updated = villages.filter((v) => v.id !== currentVillage.id);
    saveDbVillages(updated);
    toast.success("Desa berhasil dihapus!");
    loadData();
    setIsDeleteOpen(false);
    resetForm();
  };

  return (
    <>
      <PageMeta
        title="Manajemen Desa - SIPDES"
        description="Kelola data desa dan wilayah jangkauan sistem"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manajemen Desa
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daftar seluruh wilayah administratif desa yang terintegrasi di SIPDES.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 self-start sm:self-auto"
            startIcon={<Plus size={18} />}
          >
            Tambah Desa Baru
          </Button>
        </div>

        {/* Search */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cari Berdasarkan Nama Desa / Alamat
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Ketik nama desa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        {/* Desa Table */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-4">ID Desa</th>
                  <th className="px-6 py-4">Nama Desa</th>
                  <th className="px-6 py-4">Alamat / Keterangan</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredVillages.length > 0 ? (
                  filteredVillages.map((village) => (
                    <tr
                      key={village.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {village.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        <span className="flex items-center gap-2">
                          <Building size={16} className="text-brand-500" />
                          {village.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {village.address ? (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            {village.address}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(village)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                            title="Edit Desa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(village)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                            title="Hapus Desa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada desa terdaftar yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Desa */}
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Tambah Desa Baru
            </h3>

            <form onSubmit={handleCreateVillage} className="space-y-4">
              {/* Village Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Desa
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Desa Karangmojo"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Village Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Alamat Kantor Desa / Keterangan
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Jl. Raya Karangmojo No. 5"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Desa
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Modal Edit Desa */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-md p-6 sm:p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Ubah Data Desa
            </h3>

            <form onSubmit={handleUpdateVillage} className="space-y-4">
              {/* Village Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Desa
                </label>
                <Input
                  type="text"
                  placeholder="Nama Desa"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Village Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Alamat Kantor Desa / Keterangan
                </label>
                <Input
                  type="text"
                  placeholder="Alamat Kantor Desa"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
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
                Hapus Desa?
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Apakah Anda yakin ingin menghapus data{" "}
                <span className="font-semibold text-gray-800 dark:text-white">
                  {currentVillage?.name}
                </span>
                ? Tindakan ini dapat berdampak pada jangkauan presensi perangkat desa.
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
