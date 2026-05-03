import { useEffect, useState } from "react";
import {
  MapPin,
  User,
  Phone,
  ClipboardList,
  CalendarCheck,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { User as UserInterface } from "../../interface/UserInterface";
import Button from "../../components/ui/button/Button";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import { LocationAccess } from "../../interface/LocationAccessInterface";
import LocationController from "../../controller/LocationController";
import { getLocation } from "../../helpers/GetLocation";
import PresenceController from "../../controller/PresenceController";
import { Toast } from "../../components/ui/alert/Toast";

function Presence() {
  const menus = [
    {
      name: "Presensi",
      icon: CalendarCheck,
    },
    {
      name: "Riwayat",
      icon: ClipboardList,
    },
    {
      name: "Pengaturan",
      icon: Settings,
    },
  ];

  const [user, setUser] = useState<UserInterface | null>(null);
  const [locations, setLocations] = useState<LocationAccess[] | null>(null);

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [validLocation, setValidLocation] = useState<Record<string, boolean>>(
    {},
  );

  const locationController = new LocationController();
  const presenceController = new PresenceController();

  const getUser = async () => {
    setUser({
      id: localStorage.getItem("id") ?? "",
      phone_number: localStorage.getItem("phone_number") ?? "",
      fullname: localStorage.getItem("fullname") ?? "",
      role: localStorage.getItem("role") ?? "umum",
      village: {
        id: localStorage.getItem("village") ?? "umum",
        name: localStorage.getItem("village") ?? "umum",
      },
    });
  };

  const getLocations = async () => {
    const data = await locationController.getByAccess(
      localStorage.getItem("token") || "",
    );

    setLocations(data);
  };

  useEffect(() => {
    getUser();
    getLocations();
  }, []);

  const checkLocation = async (locationId: string) => {
    try {
      setLoadingMap((prev) => ({ ...prev, [locationId]: true }));
      const loc = await getLocation();
      
      const data = await locationController.check(
        localStorage.getItem("token") || "",
        loc.lat,
        loc.lng,
        locationId,
      );

      setValidLocation((prev) => ({
        ...prev,
        [locationId]: data.isInside,
      }));
    } catch (e) {
      console.error(e);
      Toast({
        message: e.response.error.message,
        variant: "error",
      });
    } finally {
      setLoadingMap((prev) => ({ ...prev, [locationId]: false }));
    }
  };

  const handlePresence = async (data: LocationAccess) => {
    if (!data) return;
    try {
      const presence = await presenceController.presence(
        localStorage.getItem("token") || "",
        {
          lat: data.location?.lat,
          lng: data.location?.lng,
          locationId: data.location?.id || "",
        },
      );

      Toast({
        message: `Presensi ${presence.type == "IN" ? "masuk" : "pulang"} berhasil`,
        variant: "success",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-5 pt-6 pb-16 rounded-b-3xl shadow relative">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-semibold">
              SIPDES (Sistem Presensi Desa)
            </h1>
            <p className="text-xs md:text-sm text-white/80">
              Presensi anda, asa kebangkitan
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-xs md:text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur transition"
          >
            Logout
          </button>
        </div>

        <div className="absolute left-4 right-4 -bottom-12">
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">
                <User size={20} />
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">
                  {user?.fullname}
                </h2>
                <p className="text-xs text-gray-500">
                  {user?.village?.name ?? ""}
                </p>
              </div>

              <ThemeToggleButton />
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Phone size={14} />
              {user?.phone_number}
            </div>
            <div>{/* <GetLocation /> */}</div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-15 space-y-6">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white">
            Lokasi Presensi
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pilih lokasi untuk melakukan presensi hari ini
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {!locations || locations.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                <MapPin size={40} />
                <p className="mt-2 text-sm">Tidak ada lokasi tersedia</p>
              </div>
            ) : (
              locations.map((loc) => {
                const locationId = loc.location?.id || "";
                const isValid = validLocation[locationId];
                const isLoading = loadingMap[locationId];

                return (
                  <div
                    key={loc.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                        <MapPin size={22} />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {loc.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {loc.location?.name}
                        </p>
                      </div>
                    </div>

                    {isValid === false && (
                      <div className="flex items-center gap-2 text-xs text-red-500 mb-3">
                        <XCircle size={14} />
                        Di luar jangkauan
                      </div>
                    )}

                    {isValid === true && (
                      <div className="flex items-center gap-2 text-xs text-green-500 mb-3">
                        <CheckCircle size={14} />
                        Dalam jangkauan
                      </div>
                    )}

                    {isValid &&
                    (loc.presence?.status == "masuk" ||
                      loc.presence?.status == "") ? (
                      <Button
                        size="sm"
                        className="w-full text-sm md:text-base"
                        onClick={() => handlePresence(loc)}
                      >
                        Presensi
                      </Button>
                    ) : (
                      ""
                    )}

                    {loc.presence?.status != "hadir" &&
                    loc.presence?.status == "" ? (
                      <Button
                        size="sm"
                        className="w-full text-sm md:text-base bg-green-500 hover:bg-green-600"
                        onClick={() => checkLocation(locationId)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Checking..." : "Cek Lokasi"}
                      </Button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs md:text-sm">
                        <span>Sudah presensi hari ini</span>
                        <span className="font-medium">✔</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Menu</h3>
          <div className="grid grid-cols-3 gap-3">
            {menus.map((menu, index) => {
              const Icon = menu.icon;
              return (
                <div
                  title={""}
                  key={index}
                  className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 p-4 flex flex-col items-center justify-center gap-2 rounded-xl text-center"
                >
                  <Icon className="text-indigo-600" />
                  <span className="text-xs md:text-sm text-gray-700 dark:text-white">
                    {menu.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t flex justify-around py-2 lg:hidden">
        <button className="flex flex-col items-center text-xs text-indigo-600">
          <CalendarCheck size={18} />
          Presensi
        </button>
        <button className="flex flex-col items-center text-xs text-gray-500">
          <ClipboardList size={18} />
          Riwayat
        </button>
        <button className="flex flex-col items-center text-xs text-gray-500">
          <Settings size={18} />
          Setting
        </button>
      </div> */}
    </div>
  );
}

export default Presence;
