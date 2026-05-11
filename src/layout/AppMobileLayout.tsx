import { CalendarCheck, ClipboardList, User } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";

function AppMobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-md md:max-w-4xl relative">
        <div className="pb-20">
          <Outlet />
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-4xl bg-white dark:bg-gray-800 border-t flex justify-around py-3">
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center text-xs ${
              isActive("/") ? "text-brand-600" : "text-gray-500"
            }`}
          >
            <CalendarCheck size={20} />
            Presensi
          </button>

          <button
            onClick={() => navigate("/record")}
            className={`flex flex-col items-center text-xs ${
              isActive("/record") ? "text-brand-600" : "text-gray-500"
            }`}
          >
            <ClipboardList size={20} />
            Riwayat
          </button>

          <button
            onClick={() => navigate("/profile")}
            className={`flex flex-col items-center text-xs ${
              isActive("/profile") ? "text-brand-600" : "text-gray-500"
            }`}
          >
            <User size={20} />
            Profile
          </button>

        </div>
      </div>
    </div>
  );
}

export default AppMobileLayout;