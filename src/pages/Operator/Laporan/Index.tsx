import { useEffect, useState, Fragment } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from "../../../components/ui/table";
import Select from "../../../components/form/Select";
import DatePicker from "../../../components/form/date-picker";
import {
  FileText,
  Download,
  TrendingUp,
  Clock,
  AlertCircle,
  Building,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Option from "../../../interface/OptionInterface";
import UserController from "../../../controller/UserController";
import { catchHandle } from "../../../helpers/catchHandle";
import ReportController from "../../../controller/ReportController";
import { ReportPresence } from "../../../interface/ReportInterface";
import { formatTime } from "../../../helpers/formatTime";
import { statusColor } from "../../../helpers/statusColor";
import { Export } from "../../../helpers/export";
import { Toast } from "../../../components/ui/alert/Toast";
import { createRoot } from "react-dom/client";
import ReportPdf from "./Pdf";
import { StatsPresence } from "../../../interface/StatsInterface";
import GlobalController from "../../../controller/GlobalController";

interface Filter {
  startDate: Date;
  endDate: Date;
  userId: string;
}

export default function LaporanManagement() {
  const userController = new UserController();
  const reportController = new ReportController();
  const globalController = new GlobalController();

  const [filter, setFilter] = useState<Filter>({
    startDate: new Date(),
    endDate: new Date(),
    userId: "",
  });

  const [report, setReport] = useState<ReportPresence[]>([]);
  const [users, setUsers] = useState<Option[]>([{ label: "Semua Perangkat", value: "" }]);
  const [paginatedReport, setPaginatedReport] = useState<ReportPresence[]>([]);

  const [stats, setStats] = useState<StatsPresence>({
    presence_total: 0,
    presence_user_total: 0,
    hadir_total: 0,
    terlambat_total: 0,
    user_terlambat_total: 0,
    belum_absen_total: 0,
    alpha_total: 0,
    presentase_hadir: 0,
    presence_status: [],
  });

  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const getReport = async () => {
    if (!filter.startDate || !filter.endDate) return;
    setLoading(true);
    try {
      const data = await reportController.presence(filter.startDate, filter.endDate, { userId: filter.userId });
      setReport(data);
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const data = await userController.get();
      const dataTemp = data.map((e) => ({
        value: e.id,
        label: e.fullname,
      }));

      setUsers([{ label: "Semua Perangkat", value: "" }, ...dataTemp]);
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    }
  }

  const getStats = async () => {
    try {
      const data = await globalController.statsPresence(filter.startDate, filter.endDate);
      setStats(data);
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    }
  }

  const toggleRow = async (userId: string) => {
    const isExpanded = !expandedRows[userId];
    setExpandedRows((prev) => ({ ...prev, [userId]: isExpanded }));
  };

  useEffect(() => {
    if (report.length === 0) {
      setPaginatedReport([]);
    }
  }, [report]);


  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getStats();
    getReport();
  }, [filter]);

  useEffect(() => {
    setExpandedRows({});
  }, [filter]);

  const handleFilter = (key: string, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const handleExcel = async () => {
    if (report.length === 0) {
      Toast({ message: "Tidak ada data untuk diekspor", variant: "error" });
      return;
    }

    try {
      const periodName = `${filter.startDate}_hingga_${filter.endDate}`;
      const columns = [
        { header: "No", valueGetter: (_: any, index: number) => index + 1 },
        { header: "Nama Perangkat Desa", key: "user.fullname" },
        { header: "Desa Wilayah", valueGetter: (data: any) => data.user.village?.name || "-" },
        { header: "Hadir Tepat Waktu (Hari)", key: "jumlah_hadir_tepat_waktu" },
        { header: "Terlambat (Hari)", key: "jumlah_terlambat" },
        { header: "Cuti / Izin (Hari)", key: "jumlah_cuti_izin" },
        { header: "Alpa (Hari)", key: "alpa" },
        { header: "Persentase Kehadiran (%)", key: "persentase_kehadiran" },
      ];

      const success = await Export.excel(report, columns, `Laporan_Presensi_${periodName}`);
      if (success) Toast({ message: "Excel berhasil diunduh!", variant: "success" });
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    }
  }

  const handlePdf = async () => {
    if (report.length === 0) {
      Toast({ message: "Tidak ada data untuk diekspor", variant: "error" });
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      Toast({ message: "Gagal membuka jendela cetak. Pastikan pop-up tidak diblokir.", variant: "error" });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Rekap Presensi - SIPDES</title>
        </head>
        <body class="bg-white">
          <div id="print-root"></div>
        </body>
      </html>
    `);
    printWindow.document.close();

    const container = printWindow.document.getElementById("print-root");
    if (container) {
      // Copy style tags from parent window so Tailwind styles are applied in the new window
      document.querySelectorAll("style, link[rel='stylesheet']").forEach((style) => {
        printWindow.document.head.appendChild(style.cloneNode(true));
      });

      const root = createRoot(container);
      root.render(
        <ReportPdf
          report={report}
          filter={filter}
          stats={stats}
        />
      );
    }
  };

  const handleResetFilters = () => {
    setFilter({
      startDate: new Date(),
      endDate: new Date(),
      userId: "",
    });
    Toast({ message: "Filter laporan berhasil disetel ulang!", variant: "success" });
  };

  return (
    <>
      <PageMeta
        title="Laporan Rekap Presensi - SIPDES"
        description="Rekapitulasi absensi bulanan perangkat desa"
      />
      <div className="space-y-6">
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
              onClick={() => handlePdf()}
              className="flex items-center gap-2"
              startIcon={<FileText size={16} />}
            >
              Ekspor PDF
            </Button>
            <Button
              variant="success"
              onClick={() => handleExcel()}
              className="flex items-center gap-2"
              startIcon={<Download size={16} />}
            >
              Ekspor Excel
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Periode Tanggal
              </label>
              <DatePicker
                id="reportPeriode"
                mode="range"
                defaultDate={[filter.startDate, filter.endDate]}
                placeholder="Pilih Range Tanggal"
                onChange={(selectedDates: any) => {
                  if (selectedDates && selectedDates.length === 2) {
                    const [start, end] = selectedDates;
                    setFilter((prev) => ({
                      ...prev,
                      startDate: start,
                      endDate: end,
                    }));
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Perangkat Desa
              </label>
              <Select
                options={users}
                placeholder="Pilih Perangkat"
                onChange={(val) => handleFilter('userId', val)}
                defaultValue={filter.userId}
              />
            </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Rasio Kehadiran Rata-rata
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.presentase_hadir}%
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Total Hari Hadir (Semua)
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.hadir_total} Hari
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Frekuensi Terlambat
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.terlambat_total} Kali
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Total Alpa / Tanpa Ket.
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.alpha_total} Hari
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Rekap Presensi Perangkat
              </h3>
              <p className="text-xs text-gray-400">
                Dihitung berdasarkan target 22 hari kerja efektif per bulan.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                <TableRow>
                  <TableCell isHeader className="w-10 py-4" children={undefined}></TableCell>
                  <TableCell isHeader className="px-6 py-4">Perangkat Desa</TableCell>
                  <TableCell isHeader className="px-6 py-4">Desa Wilayah</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Hadir Tepat Waktu</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Terlambat</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Cuti / Izin</TableCell>
                  <TableCell isHeader className="px-6 py-4 text-center">Alpa</TableCell>
                  <TableCell isHeader className="px-6 py-4">Persentase Kehadiran</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Memuat data laporan...
                    </TableCell>
                  </TableRow>
                ) : paginatedReport.length > 0 ? (
                  paginatedReport.map((data) => (
                    <Fragment key={data.user.id}>
                      <TableRow
                        onClick={() => toggleRow(data.user.id)}
                        className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer"
                      >
                        <TableCell className="px-4 py-4 text-center w-10">
                          {expandedRows[data.user.id] ? (
                            <ChevronDown size={16} className="text-gray-400" />
                          ) : (
                            <ChevronRight size={16} className="text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {data.user.fullname}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="flex items-center gap-1.5">
                            <Building size={14} className="text-gray-400" />
                            {data.user.village?.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center font-semibold text-green-600 dark:text-green-400">
                          {data.jumlah_hadir_tepat_waktu} Hari
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center font-semibold text-amber-500">
                          {data.jumlah_terlambat} Hari
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center font-semibold text-blue-500">
                          {data.jumlah_cuti_izin} Hari
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center font-semibold text-red-500">
                          {data.alpa} Hari
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden shrink-0">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${data.persentase_kehadiran >= 80
                                  ? "bg-green-500"
                                  : data.persentase_kehadiran >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                  }`}
                                style={{ width: `${data.persentase_kehadiran}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {data.persentase_kehadiran}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedRows[data.user.id] && (
                        <TableRow className="bg-gray-50/50 dark:bg-white/[0.01] hover:bg-transparent border-t-0 select-none cursor-default">
                          <TableCell colSpan={8} className="px-6 py-4">
                            <div className="space-y-3 pl-6">
                              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                                  List Presensi
                                </h4>
                                <span className="text-xs text-gray-400">
                                  Total: {data.presence?.length || 0} hari tercatat
                                </span>
                              </div>

                              {data.presence && data.presence.length > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50">
                                  <Table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                                    <TableHeader className="bg-gray-50/70 dark:bg-gray-800/30 font-semibold text-gray-650 dark:text-gray-450 uppercase text-[10px]">
                                      <TableRow>
                                        <TableCell isHeader className="px-4 py-2.5">Tanggal</TableCell>
                                        <TableCell isHeader className="px-4 py-2.5">Jam Masuk</TableCell>
                                        <TableCell isHeader className="px-4 py-2.5">Jam Pulang</TableCell>
                                        <TableCell isHeader className="px-4 py-2.5">Status</TableCell>
                                        <TableCell isHeader className="px-4 py-2.5">Lokasi</TableCell>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-850">
                                      {data.presence.map((pres) => (
                                        <TableRow key={pres.id} className="hover:bg-gray-50/30 dark:hover:bg-white/[0.005]">
                                          <TableCell className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200">
                                            {pres.date ? pres.date.split("T")[0] : "-"}
                                          </TableCell>
                                          <TableCell className="px-4 py-2.5">
                                            {pres.in ? (
                                              <span className="flex items-center gap-1">
                                                <Clock size={12} className="text-emerald-500" />
                                                {formatTime(pres.in)}
                                              </span>
                                            ) : (
                                              <span className="text-gray-400">-</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="px-4 py-2.5">
                                            {pres.out ? (
                                              <span className="flex items-center gap-1">
                                                <Clock size={12} className="text-brand-500" />
                                                {formatTime(pres.out)}
                                              </span>
                                            ) : (
                                              <span className="text-gray-400">-</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="px-4 py-2.5">
                                            <span
                                              className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${statusColor(
                                                pres.status
                                              )}`}
                                            >
                                              {pres.status || "Belum Absen"}
                                            </span>
                                          </TableCell>
                                          <TableCell className="px-4 py-2.5 text-gray-500 dark:text-gray-400">
                                            {pres.location_access?.location?.name || "-"}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <div className="py-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                  Tidak ada catatan presensi untuk rentang tanggal ini.
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600">
                      Tidak ada data laporan untuk kombinasi filter di atas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && report.length > 0 && (
            <TablePagination
              data={report}
              onPageDataChange={setPaginatedReport}
            />
          )}
        </div>
      </div>
    </>
  );
}


