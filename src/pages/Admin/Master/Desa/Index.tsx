import { useEffect, useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import Button from "../../../../components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from "../../../../components/ui/table";
import { Village } from "../../../../interface/VillageInterface";
import VillageController from "../../../../controller/VillageController";
import { catchHandle } from "../../../../helpers/catchHandle";
import AddDesaModal from "./Add";
import EditDesaModal from "./Edit";
import DeleteDesaModal from "./Delete";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Building,
  MapPin,
  Users,
  Map,
} from "lucide-react";

export default function DesaManagement() {
  const villageController = new VillageController();

  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentVillage, setCurrentVillage] = useState<Village | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await villageController.get();
      setVillages(data);
    } catch (err) {
      catchHandle({ err, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVillages(villages);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredVillages(
        villages.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            (v.address || "").toLowerCase().includes(q) ||
            (v.subDistrict?.name || "").toLowerCase().includes(q) ||
            (v.subDistrictId || "").toLowerCase().includes(q)
        )
      );
    }
  }, [villages, searchTerm]);

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleEditClick = (village: Village) => {
    setCurrentVillage(village);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (village: Village) => {
    setCurrentVillage(village);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Manajemen Desa - SIPDES"
        description="Kelola data desa dan wilayah administratif kecamatan"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manajemen Desa
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola data desa, alamat kantor, dan wilayah administratif kecamatan.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            startIcon={<Plus size={18} />}
          >
            Tambah Desa Baru
          </Button>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cari Berdasarkan Nama Desa / Alamat / Kecamatan
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Ketik untuk mencari desa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        {/* Villages List Table */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <TableRow>
                  <TableCell isHeader className="px-6 py-4">Nama Desa</TableCell>
                  <TableCell isHeader className="px-6 py-4">Alamat Kantor</TableCell>
                  <TableCell isHeader className="px-6 py-4">Kecamatan</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Perangkat</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Titik Presensi</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Aksi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading && villages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
                        Memuat data desa...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVillages.length > 0 ? (
                  filteredVillages.map((village) => (
                    <TableRow
                      key={village.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        <span className="flex items-center gap-2">
                          <Building size={16} className="text-brand-500 shrink-0" />
                          {village.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          {village.address || <span className="text-gray-400 dark:text-gray-600">-</span>}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                        {village.subDistrict?.name || (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          <Users size={12} />
                          {village.user_count || 0} orang
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <Map size={12} />
                          {village.location_count || 0} titik
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(village)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors cursor-pointer"
                            title="Ubah Desa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(village)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Hapus Desa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada data desa terdaftar yang sesuai.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {villages.length > 0 && (
            <TablePagination
              data={villages}
              defaultItemsPerPage={10}
              onPageDataChange={setFilteredVillages}
            />
          )}
        </div>

        {/* Modals */}
        <AddDesaModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={loadData}
        />

        <EditDesaModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          village={currentVillage}
          onSuccess={loadData}
        />

        <DeleteDesaModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          village={currentVillage}
          onSuccess={loadData}
        />
      </div>
    </>
  );
}
