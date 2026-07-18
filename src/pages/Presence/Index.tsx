import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { Presence } from "../../interface/PresenceInterface";
import PresenceController from "../../controller/PresenceController";
import {
  Search,
  Edit2,
  Trash2,
  Clock,
  X,
  Plus,
} from "lucide-react";
import DatePicker from "../../components/form/date-picker";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import EditModal from "./Edit";
import DetailModal from "./Detail";
import DeleteModal from "./Delete";
import { statusColor } from "../../helpers/statusColor";
import { catchHandle } from "../../helpers/catchHandle";
import { formatTime } from "../../helpers/formatTime";

export default function List() {
  const navigate = useNavigate();
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  };

  const presenceController = new PresenceController();
  const [presences, setPresences] = useState<Presence[]>([]);
  const [filteredPresences, setFilteredPresences] = useState<Presence[]>([]);

  const getTodayMonthString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<string>(getTodayMonthString());
  const [filterStatus, setFilterStatus] = useState("all");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [currentPresence, setCurrentPresence] = useState<Presence | null>(null);

  const statusFilterOptions = [
    { value: "all", label: "Semua Status" },
    { value: "hadir", label: "Hadir" },
    { value: "terlambat", label: "Terlambat" },
    { value: "alpa", label: "Alpa" },
    { value: "cuti", label: "Cuti" },
    { value: "pulang", label: "Pulang" },
  ];

  const loadData = async () => {
    try {
      const data = await presenceController.get(new Date(filterDate), {
        villageId: "",
        status: filterStatus,
      });
      setPresences(data);
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }
  };

  useEffect(() => {
    loadData();
  }, [filterDate, filterStatus]);

  useEffect(() => {
    let result = [...presences];

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.user?.fullname.toLowerCase().includes(q)
      );
    }

    setFilteredPresences(result);
  }, [presences, searchTerm]);

  const handleEditClick = (presence: Presence) => {
    setCurrentPresence(presence);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    loadData();
    setIsEditOpen(false);
  };

  const handleDeleteClick = (presence: Presence) => {
    setCurrentPresence(presence);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    loadData();
    setIsDeleteOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterDate(getTodayMonthString());
    setFilterStatus("");
  };

  return (
    <>
      <PageMeta
        title="Riwayat Presensi Perangkat - SIPDES"
        description="Daftar log presensi semua perangkat desa"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              List Presensi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola dan pantau seluruh catatan absensi perangkat desa di wilayah Anda.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/operator/presensi/add")}
            className="flex items-center justify-center gap-2 self-start sm:self-auto"
            startIcon={<Plus size={18} />}
          >
            Tambah Presensi
          </Button>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cari Perangkat
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <input
                  type="text"
                  placeholder="Nama perangkat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Periode Presensi
              </label>
              <DatePicker
                id="filterDate"
                viewMode="month"
                defaultDate={filterDate}
                onChange={(_selectedDates: any, dateStr: string) => {
                  setFilterDate(dateStr);
                }}
                placeholder="Pilih Periode"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status Kehadiran
              </label>
              <Select
                options={statusFilterOptions}
                placeholder="Pilih Status"
                onChange={(val) => setFilterStatus(val)}
                defaultValue={filterStatus}
              />
            </div>

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
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Perangkat Desa</TableCell>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Desa</TableCell>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Tanggal</TableCell>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Jam Masuk</TableCell>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Jam Pulang</TableCell>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</TableCell>
                  <TableCell className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Lokasi</TableCell>
                  <TableCell className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Aksi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredPresences.length > 0 ? (
                  filteredPresences.map((pres) => (
                    <TableRow
                      key={pres.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-left">
                        {pres.user?.fullname || "N/A"}
                        <p className="text-xs font-normal text-gray-400 mt-0.5">
                          {pres.user?.phone_number || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200 text-left">
                        {pres.user?.village?.name || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 text-left">
                        {formatDate(pres.date)}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200 text-left">
                        {pres.in ? (
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-emerald-500" />
                            {formatTime(pres.in)}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200 text-left">
                        {pres.out ? (
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-brand-500" />
                            {formatTime(pres.out)}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-left">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColor(
                            pres.status
                          )}`}
                        >
                          {pres.status || "Belum Absen"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-gray-200 text-left">
                        {pres.location_access?.location?.name ? (
                          <button
                            onClick={() => {
                              setCurrentPresence(pres);
                              setIsMapOpen(true);
                            }}
                            className="text-left font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                          >
                            {pres.location_access.location.name}
                          </button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada data presensi yang sesuai dengan kriteria filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <EditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          presence={currentPresence}
          onSave={handleSaveEdit}
        />

        <DetailModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          presence={currentPresence}
        />

        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          presence={currentPresence}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
