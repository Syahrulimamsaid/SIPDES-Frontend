import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import Select from "../../../components/form/Select";
import {
  getDbPresences,
  getDbUsers,
  getDbVillages,
} from "../../../helpers/adminDb";
import { User } from "../../../interface/UserInterface";
import { Village } from "../../../interface/VillageInterface";
import { Presence } from "../../../interface/PresenceInterface";
import toast from "react-hot-toast";
import {
  FileText,
  Download,
  TrendingUp,
  Clock,
  AlertCircle,
  Building,
  CheckCircle,
} from "lucide-react";

interface UserReportSummary {
  userId: string;
  fullname: string;
  villageName: string;
  totalPresent: number;
  totalLate: number;
  totalAbsent: number;
  totalCuti: number;
  attendancePercentage: number;
}

export default function LaporanManagement() {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Filter states
  const [filterMonth, setFilterMonth] = useState("05"); // Default to May
  const [filterYear, setFilterYear] = useState("2026"); // Default to 2026
  const [filterVillageId, setFilterVillageId] = useState("");
  const [filterUserId, setFilterUserId] = useState("");

  const [reportData, setReportData] = useState<UserReportSummary[]>([]);
  const [totals, setTotals] = useState({
    avgPercentage: 0,
    totalLate: 0,
    totalAbsent: 0,
    totalPresent: 0,
  });

  const monthOptions = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const yearOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
  ];

  const villageOptions = villages.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const userOptions = users
    .filter((u) => u.role === "umum")
    .map((u) => ({
      value: u.id,
      label: u.fullname,
    }));

  const loadData = () => {
    setPresences(getDbPresences());
    setUsers(getDbUsers());
    setVillages(getDbVillages());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute reports based on filters
  useEffect(() => {
    const generalUsers = users.filter((u) => u.role === "umum");

    // Filter users by village and user filters
    let targetUsers = [...generalUsers];
    if (filterVillageId !== "") {
      targetUsers = targetUsers.filter((u) => u.villageId === filterVillageId);
    }
    if (filterUserId !== "") {
      targetUsers = targetUsers.filter((u) => u.id === filterUserId);
    }

    // Filter presences by month & year
    const monthlyPresences = presences.filter((p) => {
      if (!p.date) return false;
      const [year, month] = p.date.split("-");
      return month === filterMonth && year === filterYear;
    });

    // Work days in month context (simulated 22 working days)
    const totalWorkDays = 22;

    const summaries: UserReportSummary[] = targetUsers.map((u) => {
      const userPresences = monthlyPresences.filter((p) => p.userId === u.id);

      const present = userPresences.filter((p) => p.status === "hadir" || p.status === "pulang").length;
      const late = userPresences.filter((p) => p.status === "terlambat").length;
      const cuti = userPresences.filter((p) => p.status === "cuti").length;
      const totalAttended = present + late;
      const absent = Math.max(0, totalWorkDays - (totalAttended + cuti));

      const pct = totalWorkDays > 0 ? Math.round((totalAttended / totalWorkDays) * 100) : 0;

      return {
        userId: u.id,
        fullname: u.fullname,
        villageName: u.village?.name || "N/A",
        totalPresent: present,
        totalLate: late,
        totalAbsent: absent,
        totalCuti: cuti,
        attendancePercentage: pct,
      };
    });

    setReportData(summaries);

    // Compute sums and averages
    if (summaries.length > 0) {
      const sumPct = summaries.reduce((acc, curr) => acc + curr.attendancePercentage, 0);
      const sumLate = summaries.reduce((acc, curr) => acc + curr.totalLate, 0);
      const sumAbsent = summaries.reduce((acc, curr) => acc + curr.totalAbsent, 0);
      const sumPresent = summaries.reduce((acc, curr) => acc + (curr.totalPresent + curr.totalLate), 0);

      setTotals({
        avgPercentage: Math.round(sumPct / summaries.length),
        totalLate: sumLate,
        totalAbsent: sumAbsent,
        totalPresent: sumPresent,
      });
    } else {
      setTotals({ avgPercentage: 0, totalLate: 0, totalAbsent: 0, totalPresent: 0 });
    }
  }, [presences, users, filterMonth, filterYear, filterVillageId, filterUserId]);

  const handleExport = (type: "excel" | "pdf") => {
    const monthName = monthOptions.find((m) => m.value === filterMonth)?.label || "Bulan";
    const filename = `Laporan_Presensi_${monthName}_${filterYear}.${type === "excel" ? "xlsx" : "pdf"}`;

    const loadingToast = toast.loading(`Sedang mengekspor ke ${type.toUpperCase()}...`);

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success(`${filename} berhasil diunduh!`);
    }, 1500);
  };

  const handleResetFilters = () => {
    setFilterMonth("05");
    setFilterYear("2026");
    setFilterVillageId("");
    setFilterUserId("");
    toast.success("Filter laporan disetel ulang!");
  };

  return (
    <>
      <PageMeta
        title="Laporan Rekap Presensi - SIPDES"
        description="Rekapitulasi absensi bulanan perangkat desa"
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Laporan Presensi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unduh dan analisis rekapitulasi absensi bulanan seluruh perangkat desa.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-2"
              startIcon={<FileText size={16} />}
            >
              Ekspor PDF
            </Button>
            <Button
              variant="success"
              onClick={() => handleExport("excel")}
              className="flex items-center gap-2"
              startIcon={<Download size={16} />}
            >
              Ekspor Excel
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5 items-end">
            {/* Month */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Periode Bulan
              </label>
              <Select
                options={monthOptions}
                placeholder="Pilih Bulan"
                onChange={(val) => setFilterMonth(val)}
                defaultValue={filterMonth}
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tahun
              </label>
              <Select
                options={yearOptions}
                placeholder="Pilih Tahun"
                onChange={(val) => setFilterYear(val)}
                defaultValue={filterYear}
              />
            </div>

            {/* Village */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Filter Desa
              </label>
              <Select
                options={villageOptions}
                placeholder="Semua Desa"
                onChange={(val) => setFilterVillageId(val)}
                defaultValue={filterVillageId}
              />
            </div>

            {/* User */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Filter Perangkat
              </label>
              <Select
                options={userOptions}
                placeholder="Semua Perangkat"
                onChange={(val) => setFilterUserId(val)}
                defaultValue={filterUserId}
              />
            </div>

            {/* Reset Filters */}
            <div>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full h-11 flex justify-center items-center"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Present */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Rasio Kehadiran Rata-rata
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {totals.avgPercentage}%
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>

          {/* Total Present Days */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Total Hari Hadir (Semua)
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {totals.totalPresent} Hari
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* Total Late */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Frekuensi Terlambat
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {totals.totalLate} Kali
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                <Clock size={22} />
              </div>
            </div>
          </div>

          {/* Total Absent */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Total Alpa / Tanpa Ket.
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {totals.totalAbsent} Hari
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Rincian Rekap Presensi Perangkat
              </h3>
              <p className="text-xs text-gray-400">
                Dihitung berdasarkan target 22 hari kerja efektif per bulan.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-4">Perangkat Desa</th>
                  <th className="px-6 py-4">Desa Wilayah</th>
                  <th className="px-6 py-4 text-center">Hadir Tepat Waktu</th>
                  <th className="px-6 py-4 text-center">Terlambat</th>
                  <th className="px-6 py-4 text-center">Cuti / Izin</th>
                  <th className="px-6 py-4 text-center">Alpa</th>
                  <th className="px-6 py-4">Persentase Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {reportData.length > 0 ? (
                  reportData.map((row) => (
                    <tr
                      key={row.userId}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {row.fullname}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <Building size={14} className="text-gray-400" />
                          {row.villageName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-green-600 dark:text-green-400">
                        {row.totalPresent} Hari
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-amber-500">
                        {row.totalLate} Hari
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-blue-500">
                        {row.totalCuti} Hari
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-red-500">
                        {row.totalAbsent} Hari
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                row.attendancePercentage >= 80
                                  ? "bg-green-500"
                                  : row.attendancePercentage >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${row.attendancePercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {row.attendancePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada data laporan untuk kombinasi filter di atas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
