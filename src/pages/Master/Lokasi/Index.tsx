import { useEffect, useState, useMemo } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from "../../../components/ui/table";
import { LocationAccess } from "../../../interface/LocationAccessInterface";
import { User } from "../../../interface/UserInterface";
import LocationController from "../../../controller/LocationController";
import { catchHandle } from "../../../helpers/catchHandle";
import AddAccessModal from "./Add";
import DeleteAccessModal from "./Delete";
import {
  Search,
  Plus,
  Trash2,
  MapPin,
  Building,
  Phone
} from "lucide-react";

export default function LokasiManagement() {
  const locationController = new LocationController();

  const [userAccess, setUserAccess] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAccess, setCurrentAccess] = useState<LocationAccess | null>(null);

  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);

  const filteredUsers = useMemo(() => {
    if (searchTerm.trim() === "") {
      return userAccess;
    }
    const q = searchTerm.toLowerCase();
    return userAccess.filter(
      (user) =>
        (user.fullname || "").toLowerCase().includes(q) ||
        (user.phone_number || "").includes(q) ||
        (user.village?.name || "").toLowerCase().includes(q) ||
        (user.location_access || []).some(
          (acc) =>
            (acc.location?.name || "").toLowerCase().includes(q) ||
            (acc.description || "").toLowerCase().includes(q)
        )
    );
  }, [userAccess, searchTerm]);


  const loadData = async () => {
    setLoading(true);
    try {
      const data = await locationController.getAccessAll();
      setUserAccess(data);
    } catch (err) {
      catchHandle({ err, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = (userId: string) => {
    const selectedUser = userAccess.find((u) => u.id === userId) || null;
    setCurrentUser(selectedUser);
    setIsAddOpen(true);
  };

  const handleDelete = (access: LocationAccess) => {
    setCurrentAccess(access);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Manajemen Akses Lokasi - SIPDES"
        description="Kelola izin akses titik presensi perangkat desa"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manajemen Akses Lokasi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola izin akses titik presensi/geofence untuk perangkat desa (User Umum).
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Cari Berdasarkan Nama / No HP / Lokasi / Keterangan
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <input
                type="text"
                placeholder="Ketik kata kunci pencarian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 block md:table">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase hidden md:table-header-group">
                <TableRow className="md:table-row">
                  <TableCell isHeader className="px-6 py-4 text-left w-full md:w-1/3 md:table-cell">Perangkat Desa</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-left w-full md:w-2/3 md:table-cell">Daftar Akses Lokasi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 block md:table-row-group">
                {loading && userAccess.length === 0 ? (
                  <TableRow className="flex flex-col md:table-row">
                    <TableCell colSpan={2} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600 block md:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></span>
                        Loading data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="flex flex-col md:table-row hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors divide-y divide-gray-100 dark:divide-gray-800/60 md:divide-y-0"
                    >
                      <TableCell className="px-6 py-4 text-left align-top block md:table-cell w-full md:w-1/3">
                        <div className="flex flex-col gap-3.5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-indigo-100/30 dark:border-indigo-900/20">
                              {user.fullname?.split(" ").map(w => w[0]).slice(0, 2).join("") || "U"}
                            </div>

                            <div className="min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate" title={user.fullname}>
                                {user.fullname || "Tidak Diketahui"}
                              </h4>
                              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 mt-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-900/10">
                                Perangkat Desa
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-row items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Phone size={13} className="text-gray-400 dark:text-gray-500 shrink-0" />
                              <span>{user.phone_number || "-"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building size={13} className="text-gray-400 dark:text-gray-500 shrink-0" />
                              <span className="truncate" title={user.village?.name}>{user.village?.name}</span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdd(user.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs border-indigo-100 dark:border-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors"
                            startIcon={<Plus size={14} />}
                          >
                            Tambah Akses
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-left align-top block md:table-cell w-full md:w-2/3">
                        <div className="flex flex-col gap-2.5">
                          <span className="block md:hidden text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Akses Lokasi
                          </span>
                          {user.location_access && user.location_access.length > 0 ? user.location_access.map((access) => (
                            <div
                              key={access.id}
                              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 hover:border-brand-200 dark:hover:border-brand-900 transition-colors"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="bg-brand-50 dark:bg-brand-950/30 text-brand-500 p-2 rounded-xl mt-0.5">
                                  <MapPin size={16} className="shrink-0" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                    {access.location?.name || "N/A"}
                                  </p>
                                  {access.description && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                      Keterangan: {access.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDelete(access)}
                                className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 ml-4 animate-fade-in"
                                title="Cabut Akses Lokasi"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )) : (
                            <div className="text-center py-4">
                              <p className="text-gray-400 dark:text-gray-500 text-sm">Tidak ada akses lokasi</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="flex flex-col md:table-row">
                    <TableCell colSpan={2} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600 block md:table-cell">
                      {searchTerm.trim() !== ""
                        ? "Tidak ada data hak akses lokasi yang sesuai dengan pencarian."
                        : "Tidak ada data hak akses lokasi yang terdaftar."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {userAccess.length > 0 && (
            <TablePagination
              data={filteredUsers}
              defaultItemsPerPage={10}
              onPageDataChange={setPaginatedUsers}
            />
          )}
        </div>

        <AddAccessModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          user={currentUser}
          onSuccess={loadData}
        />

        <DeleteAccessModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          id={currentAccess?.id || ""}
          onSuccess={loadData}
        />
      </div>
    </>
  );
}
