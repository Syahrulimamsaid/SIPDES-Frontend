import { useEffect, useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import Button from "../../../../components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from "../../../../components/ui/table";
import { SubDistrict } from "../../../../interface/SubDistrictInterface";
import SubDistrictController from "../../../../controller/SubDistrictController";
import { catchHandle } from "../../../../helpers/catchHandle";
import AddSubDistrictModal from "./Add";
import EditSubDistrictModal from "./Edit";
import DeleteSubDistrictModal from "./Delete";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Map,
  Building,
} from "lucide-react";

export default function SubDistrictManagement() {
  const subDistrictController = new SubDistrictController();

  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState<SubDistrict[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentSubDistrict, setCurrentSubDistrict] = useState<SubDistrict | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await subDistrictController.get();
      setSubDistricts(data || []);
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
      setFilteredSubDistricts(subDistricts);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredSubDistricts(
        subDistricts.filter(
          (sd) =>
            sd.name.toLowerCase().includes(q) ||
            sd.id.toLowerCase().includes(q)
        )
      );
    }
  }, [subDistricts, searchTerm]);

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleEditClick = (subDistrict: SubDistrict) => {
    setCurrentSubDistrict(subDistrict);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (subDistrict: SubDistrict) => {
    setCurrentSubDistrict(subDistrict);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Manajemen Kecamatan - SIPDES"
        description="Kelola data kecamatan dan wilayah administratif kabupaten"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manajemen Kecamatan
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola data kecamatan dan wilayah administratif untuk pemetaan desa.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            startIcon={<Plus size={18} />}
          >
            Tambah Kecamatan Baru
          </Button>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cari Berdasarkan Nama Kecamatan
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Ketik untuk mencari kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        {/* Sub District List Table */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <TableRow>
                  <TableCell isHeader className="px-6 py-4">Nama Kecamatan</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Jumlah Desa</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Aksi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading && subDistricts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
                        Memuat data kecamatan...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSubDistricts.length > 0 ? (
                  filteredSubDistricts.map((subDistrict) => {
                    const villageCount = subDistrict.villages?.length ?? 0;
                    return (
                      <TableRow
                        key={subDistrict.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                      >
                        <TableCell className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          <span className="flex items-center gap-2">
                            <Map size={16} className="text-brand-500 shrink-0" />
                            {subDistrict.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                            <Building size={12} />
                            {villageCount} desa
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(subDistrict)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors cursor-pointer"
                              title="Ubah Kecamatan"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(subDistrict)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Hapus Kecamatan"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada data kecamatan terdaftar yang sesuai.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {subDistricts.length > 0 && (
            <TablePagination
              data={subDistricts}
              defaultItemsPerPage={10}
              onPageDataChange={setFilteredSubDistricts}
            />
          )}
        </div>

        <AddSubDistrictModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={loadData}
        />

        <EditSubDistrictModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          subDistrict={currentSubDistrict}
          onSuccess={loadData}
        />

        <DeleteSubDistrictModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          subDistrict={currentSubDistrict}
          onSuccess={loadData}
        />
      </div>
    </>
  );
}
