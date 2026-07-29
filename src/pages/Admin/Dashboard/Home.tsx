import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Users,
  MapPin,
  Building,
  CalendarCheck,
  Clock,
  Map,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import { Presence } from "../../../interface/PresenceInterface";
import PresenceController from "../../../controller/PresenceController";
import GlobalController from "../../../controller/GlobalController";
import { Stats, StatsPresence } from "../../../interface/StatsInterface";
import { catchHandle } from "../../../helpers/catchHandle";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { formatDate } from "../../../helpers/formatDate";
import { formatTime } from "../../../helpers/formatTime";
import { statusColor } from "../../../helpers/statusColor";

export default function Home() {
  const presenceController = new PresenceController();
  const globalController = new GlobalController();

  const [stats, setStats] = useState<Stats>({ user_total: 0, location_total: 0, village_name: "-", village_total: 0 });
  const [statsPresence, setStatsPresence] = useState<StatsPresence>({
    presence_total: 0, presence_user_total: 0, hadir_total: 0, terlambat_total: 0, belum_absen_total: 0,
    user_terlambat_total: 0, alpha_total: 0, presentase_hadir: 0,
    presence_status: [{ bulan: "", tepat_waktu: 0, terlambat: 0 }]
  });
  const [presences, setPresences] = useState<Presence[]>([]);

  const getPresence = async () => {
    try {
      const data = await presenceController.get(new Date(), { page: 1, limit: 5 });
      setPresences(data);
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }
  };

  const getStats = async () => {
    try {
      const data = await globalController.stats();
      setStats(data);
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }

    try {
      const data = await globalController.statsPresence();
      setStatsPresence(data);
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }
  };

  useEffect(() => {
    getStats();
    getPresence();
  }, []);

  const chartOptions: ApexOptions = {
    colors: ["#34D399", "#FBBF24"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 310,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: statsPresence?.presence_status?.map((item) => item.bulan?.substring(0, 3)) || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    theme: {
      mode: document.documentElement.classList.contains("dark") ? "dark" : "light",
    },
  };

  const chartSeries = [
    {
      name: "Tepat Waktu",
      data: statsPresence?.presence_status?.map((item) => item.tepat_waktu) || [],
    },
    {
      name: "Terlambat",
      data: statsPresence?.presence_status?.map((item) => item.terlambat) || [],
    },
  ];

  return (
    <>
      <PageMeta
        title="Dashboard Admin - SIPDES"
        description="Dashboard presensi desa sistem SIPDES"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Dashboard Admin
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Selamat datang kembali. Berikut rangkuman presensi hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <TrendingUp size={16} />
            Sistem Aktif
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Perangkat Desa
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.user_total}
                </h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                <Users size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="text-green-500 font-semibold mr-1">Aktif</span>
              di dalam sistem presensi
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Jumlah Desa
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.village_total}
                </h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Building size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="text-green-500 font-semibold mr-1">Tersinkron</span>
              dalam satu wilayah
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Titik Presensi
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.location_total}
                </h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                <MapPin size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="text-amber-500 font-semibold mr-1">Geofence</span>
              dengan radius jangkauan
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Hadir Hari Ini
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {statsPresence.presence_user_total}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    / {stats.user_total}
                  </span>
                </h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
                <CalendarCheck size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="text-red-500 font-semibold mr-1">{stats?.user_total - statsPresence?.presence_user_total}</span>
              perangkat belum hadir hari ini
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:col-span-8 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tren Presensi Bulanan
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Visualisasi kehadiran tepat waktu vs terlambat
                </p>
              </div>
            </div>
            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[600px] xl:min-w-full">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height={310}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:col-span-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Status Hari Ini
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Pembagian status absensi perangkat desa
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                      Hadir Tepat Waktu
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {statsPresence.hadir_total} ({stats.user_total > 0 ? Math.round((statsPresence.hadir_total / stats.user_total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.user_total > 0 ? (statsPresence.hadir_total / stats.user_total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></span>
                      Terlambat
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {statsPresence.user_terlambat_total} ({stats.user_total > 0 ? Math.round((statsPresence.user_terlambat_total / stats.user_total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.user_total > 0 ? (statsPresence.user_terlambat_total / stats.user_total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
                      Alpa / Belum Absen
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {statsPresence.belum_absen_total} ({stats.user_total > 0 ? Math.round((statsPresence.belum_absen_total / stats.user_total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.user_total > 0 ? (statsPresence.belum_absen_total / stats.user_total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Rasio Kehadiran</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {stats.user_total > 0
                    ? Math.round(((statsPresence.hadir_total + statsPresence.user_terlambat_total) / stats.user_total) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:col-span-8 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Aktivitas Presensi Terbaru
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Log aktivitas presensi real-time masuk & pulang
                </p>
              </div>
              <Link
                to="/admin/presensi"
                className="flex items-center text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 gap-1"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <TableHeader className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  <TableRow>
                    <TableCell isHeader className="px-4 py-3 rounded-l-xl">Perangkat Desa</TableCell>
                    <TableCell isHeader className="px-4 py-3">Desa</TableCell>
                    <TableCell isHeader className="px-4 py-3">Tanggal</TableCell>
                    <TableCell isHeader className="px-4 py-3">Masuk</TableCell>
                    <TableCell isHeader className="px-4 py-3">Pulang</TableCell>
                    <TableCell isHeader className="px-4 py-3 rounded-r-xl">Status</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {presences.length > 0 ? (
                    presences.map((pres) => (
                      <TableRow key={pres.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                        <TableCell className="px-4 py-3.5 font-medium text-gray-900 dark:text-white">
                          {pres.user?.fullname || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          {pres.user?.village?.name || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          {formatDate(pres.date ?? "")}
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            {formatTime(pres.in ?? "") || "-"}
                          </div>
                        </TableCell>
                         <TableCell className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            {formatTime(pres.out ?? "") || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3.5">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColor(
                              pres.status
                            )}`}
                          >
                            {pres.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        Belum ada riwayat aktivitas presensi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:col-span-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Akses Cepat Pengaturan
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Pintasan untuk manajemen master data absensi desamu.
              </p>

              <div className="space-y-3">
                <Link
                  to="/admin/master/user"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                        Manajemen User
                      </h4>
                      <p className="text-xs text-gray-400">Tambah/Edit Perangkat Desa</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
                </Link>

                <Link
                  to="/admin/master/desa"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <Building size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                        Manajemen Desa
                      </h4>
                      <p className="text-xs text-gray-400">Konfigurasi Wilayah Desa</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </Link>

                <Link
                  to="/admin/master/setting"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                        Pengaturan Presensi
                      </h4>
                      <p className="text-xs text-gray-400">Atur Koordinat & Radius Geofence</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center p-3 rounded-2xl bg-brand-500/5 text-xs text-brand-600 dark:text-brand-400 border border-brand-500/10 gap-2">
              <Map size={16} />
              <span>Gunakan menu diatas untuk memantau aktivitas.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
