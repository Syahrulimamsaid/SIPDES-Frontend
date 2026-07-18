import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Shield,
  Key,
  Calendar,
} from "lucide-react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";

interface UserInterface {
  id: string;
  fullname: string;
  phone_number: string;
  role: string;
  village: string;
}

export default function ProfileDesktop() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInterface | null>(null);

  const getUser = () => {
    setUser({
      id: localStorage.getItem("id") ?? "",
      fullname: localStorage.getItem("fullname") ?? "",
      phone_number: localStorage.getItem("phone_number") ?? "",
      role: localStorage.getItem("role") ?? "",
      village: localStorage.getItem("village") ?? "",
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "operator":
        return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "Super Admin";
      case "operator":
        return "Operator / Administrator";
      default:
        return "Perangkat Desa (Umum)";
    }
  };

  return (
    <>
      <PageMeta
        title="Profil Saya - SIPDES"
        description="Detail profil akun Anda"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Profil Pengguna
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola informasi profil pribadi dan pengaturan keamanan akun Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Card Kiri - Info Singkat */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md text-3xl font-bold uppercase">
                  {user?.fullname.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 p-1.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="flex h-3.5 w-3.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user?.fullname}
                </h2>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full capitalize ${getRoleBadgeColor(user?.role || "")}`}>
                  {getRoleLabel(user?.role || "")}
                </span>
              </div>

              <div className="w-full border-t border-gray-100 dark:border-gray-800 pt-4 text-left space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <span className="truncate">{user?.phone_number}</span>
                </div>
                {user?.village && user.role !== "admin" && (
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={16} className="text-gray-400 shrink-0" />
                    <span className="truncate">{user?.village}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span>Sesi Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Kanan - Detail Form & Settings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                Detail Informasi Akun
              </h3>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:bg-gray-800/20 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:border-gray-800 flex items-center gap-2">
                    <UserIcon size={16} className="text-gray-400" />
                    {user?.fullname}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Nomor Handphone
                  </label>
                  <div className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:bg-gray-800/20 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:border-gray-800 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {user?.phone_number}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Peran / Hak Akses
                  </label>
                  <div className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:bg-gray-800/20 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:border-gray-800 flex items-center gap-2">
                    <Shield size={16} className="text-gray-400" />
                    {getRoleLabel(user?.role || "")}
                  </div>
                </div>

                {user?.village && user.role !== "admin" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Desa Penugasan
                    </label>
                    <div className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:bg-gray-800/20 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:border-gray-800 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      {user?.village}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Pengaturan & Keamanan */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                Keamanan & Pengaturan
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/20 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl">
                    <Key size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                      Kata Sandi / Password
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ubah kata sandi secara berkala untuk mengamankan akun Anda.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("change-password")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 shadow-sm transition"
                >
                  Ubah Password
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/20 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                      Mode Tampilan
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Aktifkan mode gelap atau terang untuk kenyamanan mata.
                    </p>
                  </div>
                </div>
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
