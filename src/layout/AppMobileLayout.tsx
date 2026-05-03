import { CalendarCheck, ClipboardList, Settings } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";

function AppMobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-md md:max-w-4xl relative">

        {/* CONTENT */}
        <div className="pb-20">
          <Outlet />
        </div>

        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-4xl bg-white dark:bg-gray-800 border-t flex justify-around py-2">

          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center text-xs ${
              isActive("/") ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <CalendarCheck size={18} />
            Presensi
          </button>

          <button
            onClick={() => navigate("/record")}
            className={`flex flex-col items-center text-xs ${
              isActive("/record") ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <ClipboardList size={18} />
            Riwayat
          </button>

          <button
            onClick={() => navigate("/setting")}
            className={`flex flex-col items-center text-xs ${
              isActive("/setting") ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <Settings size={18} />
            Setting
          </button>

        </div>
      </div>
    </div>
  );
}

export default AppMobileLayout;