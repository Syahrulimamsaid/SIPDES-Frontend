import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";

interface UserInterface {
  id: string;
  fullname: string;
  phone_number: string;
  village: {
    id: string;
    name: string;
  };
}

function Profile() {
  const [user, setUser] = useState<UserInterface | null>(null);

  const getUser = () => {
    setUser({
      id: localStorage.getItem("id") ?? "",
      fullname: localStorage.getItem("fullname") ?? "",
      phone_number: localStorage.getItem("phone_number") ?? "",
      village: {
        id: localStorage.getItem("village") ?? "",
        name: localStorage.getItem("village") ?? "",
      },
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-5 pt-8 pb-20 rounded-b-3xl shadow">
          <h1 className="text-lg font-semibold">Profil</h1>
          <p className="text-xs text-white/80">
            Informasi akun dan pengaturan
          </p>
        </div>

        <div className="px-4 -mt-16">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">

            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">
                <User size={28} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                  {user?.fullname}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} />
                  {user?.village?.name}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Phone size={14} />
              {user?.phone_number}
            </div>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">
              INFORMASI AKUN
            </h3>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl divide-y">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center gap-3">
                  <User size={18} />
                  <span className="text-sm">Nama Lengkap</span>
                </div>
                <span className="text-xs text-gray-500">
                  {user?.fullname}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  <span className="text-sm">Nomor HP</span>
                </div>
                <span className="text-xs text-gray-500">
                  {user?.phone_number}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span className="text-sm">Desa</span>
                </div>
                <span className="text-xs text-gray-500">
                  {user?.village?.name}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">
              PENGATURAN
            </h3>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl divide-y">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="text-sm">Mode Tampilan</span>
                </div>
                <ThemeToggleButton />
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="text-sm">Ubah Password</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="text-sm">Tentang Aplikasi</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/auth/signin";
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;