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
import {
  getDbUsers,
  getDbVillages,
  getDbLocations,
  getDbPresences,
} from "../../../helpers/adminDb";
import { Presence } from "../../../interface/PresenceInterface";

export default function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVillages: 0,
    totalLocations: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
  });

  const [recentPresences, setRecentPresences] = useState<Presence[]>([]);

  useEffect(() => {
    const users = getDbUsers().filter((u) => u.role === "umum");
    const villages = getDbVillages();
    const locations = getDbLocations();
    const presences = getDbPresences();

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const todayPresences = presences.filter((p) => p.date === todayStr);

    const present = todayPresences.filter((p) => p.status === "hadir").length;
    const late = todayPresences.filter((p) => p.status === "terlambat").length;
    const totalTodayPresences = todayPresences.length;
    const absent = Math.max(0, users.length - totalTodayPresences);

    setStats({
      totalUsers: users.length,
      totalVillages: villages.length,
      totalLocations: locations.length,
      presentToday: present,
      lateToday: late,
      absentToday: absent,
    });

    // Sort by time/date descending
    const sorted = [...presences].sort((a, b) => {
      const dateA = a.date + " " + (a.in || "00:00:00");
      const dateB = b.date + " " + (b.in || "00:00:00");
      return dateB.localeCompare(dateA);
    });

    setRecentPresences(sorted.slice(0, 5));
  }, []);

  const chartOptions: ApexOptions = {
    colors: ["#34D399", "#FBBF24"], // Green for hadir, Yellow for terlambat
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
      categories: ["Des", "Jan", "Feb", "Mar", "Apr", "Mei"],
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
      data: [35, 40, 48, 52, 45, stats.presentToday + 12], // mock historical + today
    },
    {
      name: "Terlambat",
      data: [5, 8, 4, 6, 8, stats.lateToday + 2],
    },
  ];

  // Helper for status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "terlambat":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
      case "alpa":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <>
      <PageMeta
        title="Dashboard Operator - SIPDES"
        description="Dashboard presensi desa sistem SIPDES"
      />
      <div className="space-y-6">
        {/* Title Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Dashboard Operator
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Selamat datang kembali. Berikut rangkuman presensi desa Anda hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <TrendingUp size={16} />
            Sistem Aktif
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Perangkat */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Perangkat Desa
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
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

          {/* Card 2: Desa */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Jumlah Desa
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalVillages}
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

          {/* Card 3: Lokasi */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Titik Presensi
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalLocations}
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

          {/* Card 4: Kehadiran Hari Ini */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Hadir Hari Ini
                </p>
                <h4 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.presentToday + stats.lateToday}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    / {stats.totalUsers}
                  </span>
                </h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
                <CalendarCheck size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="text-red-500 font-semibold mr-1">{stats.absentToday}</span>
              perangkat belum hadir hari ini
            </div>
          </div>
        </div>

        {/* Charts & Status Breakdowns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Attendance Trend Chart */}
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

          {/* Today's Distribution */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:col-span-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Status Hari Ini
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Pembagian status absensi perangkat desa
              </p>

              <div className="space-y-4">
                {/* Present */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                      Hadir Tepat Waktu
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {stats.presentToday} ({stats.totalUsers > 0 ? Math.round((stats.presentToday / stats.totalUsers) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalUsers > 0 ? (stats.presentToday / stats.totalUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Late */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></span>
                      Terlambat
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {stats.lateToday} ({stats.totalUsers > 0 ? Math.round((stats.lateToday / stats.totalUsers) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalUsers > 0 ? (stats.lateToday / stats.totalUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Absent */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
                      Alpa / Belum Absen
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {stats.absentToday} ({stats.totalUsers > 0 ? Math.round((stats.absentToday / stats.totalUsers) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalUsers > 0 ? (stats.absentToday / stats.totalUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Rasio Kehadiran</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {stats.totalUsers > 0
                    ? Math.round(((stats.presentToday + stats.lateToday) / stats.totalUsers) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Activities & Navigation Quick Links */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Recent Presence Activities */}
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
                to="/operator/presensi"
                className="flex items-center text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 gap-1"
              >
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Perangkat Desa</th>
                    <th className="px-4 py-3">Desa</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Waktu Masuk</th>
                    <th className="px-4 py-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentPresences.length > 0 ? (
                    recentPresences.map((pres) => (
                      <tr key={pres.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5 font-medium text-gray-900 dark:text-white">
                          {pres.user?.fullname || "N/A"}
                        </td>
                        <td className="px-4 py-3.5">
                          {pres.user?.village?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3.5">
                          {pres.date}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            {pres.in || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(
                              pres.status
                            )}`}
                          >
                            {pres.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        Belum ada riwayat aktivitas presensi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Configuration summary */}
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
                  to="/operator/master/user"
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
                  to="/operator/master/desa"
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
                  to="/operator/master/setting"
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
