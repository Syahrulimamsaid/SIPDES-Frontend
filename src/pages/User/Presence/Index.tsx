import { useEffect, useRef, useState } from "react";
import { MapPin, User, Phone, CheckCircle, XCircle } from "lucide-react";
import { User as UserInterface } from "../../../interface/UserInterface";
import Button from "../../../components/ui/button/Button";
import { LocationAccess } from "../../../interface/LocationAccessInterface";
import LocationController from "../../../controller/LocationController";
import { getLocation } from "../../../helpers/GetLocation";
import PresenceController from "../../../controller/PresenceController";
import { Toast } from "../../../components/ui/alert/Toast";
import ConfirmDialog from "../../../components/custom/ConfirmModal";
import NotificationPopUp, { NotificationRef } from "./Notification/Notification";
import AuthController from "../../../controller/AuthController";
import { catchHandle } from "../../../helpers/catchHandle";
import PageMeta from "../../../components/common/PageMeta";

function Presence() {
  const notifRef = useRef<NotificationRef>(null);

  const [user, setUser] = useState<UserInterface | null>(null);
  const [locations, setLocations] = useState<LocationAccess[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [validLocation, setValidLocation] = useState<Record<string, boolean>>(
    {},
  );

  const locationController = new LocationController();
  const presenceController = new PresenceController();
  const authController = new AuthController();

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
    try {
      setLoading(true);
      const data = await locationController.getByAccess();
      setLocations(data);
    } catch (err: unknown) {
      catchHandle({ err, variant: "warning" });
    } finally {
      setLoading(false);
    }
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
        loc.lat,
        loc.lng,
        locationId,
      );

      setValidLocation((prev) => ({
        ...prev,
        [locationId]: data.isInside ?? false,
      }));

      if (!data.isInside) {
        Toast({
          message: "Anda berada di luar jangkauan",
          variant: "warning",
        });
      }
    } catch (err: unknown) {
      catchHandle({ err, variant: "warning" });
    } finally {
      setLoadingMap((prev) => ({ ...prev, [locationId]: false }));
    }
  };

  const handlePresence = async (data: LocationAccess) => {
    const locationAccessId = data.id || "";
    const locationId = data.location?.id || "";

    try {
      const presence = await presenceController.presence(
        localStorage.getItem("token") || "",
        {
          lat: data.location?.lat,
          lng: data.location?.lng,
          locationAccessId,
        },
      );

      Toast({
        message: `Presensi ${presence.type} berhasil`,
        variant: "success",
      });

      setValidLocation((prev) => {
        const updated = { ...prev };
        delete updated[locationId];
        return updated;
      });

      getLocations();
    } catch (err: unknown) {
      catchHandle({ err, variant: "warning" });
    } finally {
      await notifRef.current?.getNotif();
    }
  };

  return (
    <>
      <PageMeta
        title="Presensi - SIPDES"
        description="Akses Presensi"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex justify-center">
        <div className="w-full max-w-md md:max-w-2xl">
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-950 dark:to-blue-900 text-white px-5 pt-6 pb-23 rounded-b-3xl shadow relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">SIPDES</h1>
                <p className="text-xs text-white/80">
                  Sistem Presensi Desa berbasis lokasi real-time
                </p>
              </div>

              <ConfirmDialog
                title="Logout"
                description="Apakah yakin akan keluar ?"
                labelYes="Iya"
                labelNo="Tidak"
                onYes={async () => {
                  await authController.logout();
                  window.location.href = "/auth/signin";
                }}
                buttonClass="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
                buttonChild={"Logout"}
              />
            </div>

            <div className="absolute left-4 right-4 -bottom-14">
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl">
                    <User size={20} />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800 dark:text-white">
                      {user?.fullname}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {user?.village?.name}
                    </p>
                  </div>

                  <NotificationPopUp />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Phone size={14} />
                  {user?.phone_number}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mt-20">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">Lokasi Presensi</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih lokasi untuk melakukan presensi hari ini
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}

              {!loading &&
                locations?.map((loc) => {
                  const locationId = loc.location?.id || "";
                  const isValid = validLocation[locationId];
                  const isLoading = loadingMap[locationId];

                  return (
                    <div
                      key={loc.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm 
                  transform transition-all duration-300 
                  hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 group"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 p-3 rounded-xl transition group-hover:scale-110">
                          <MapPin size={22} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            {loc.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {loc.location?.name}
                          </p>
                        </div>
                      </div>

                      {isValid === false && (
                        <div className="text-xs text-red-500 dark:text-red-400 mb-3 flex gap-1 items-center">
                          <XCircle size={14} />
                          Anda berada di luar area presensi
                        </div>
                      )}

                      {isValid === true && (
                        <div className="text-xs text-green-600 dark:text-green-400 mb-3 flex gap-1 items-center">
                          <CheckCircle size={14} />
                          Lokasi valid, Anda dapat presensi
                        </div>
                      )}

                      {isValid &&
                        (loc.presence?.status == "masuk" ||
                          loc.presence?.status == "terlambat" ||
                          loc.presence?.status == "") ? (
                        <Button
                          size="sm"
                          className="w-full group-hover:scale-[1.01] dark:bg-brand-600 dark:hover:bg-brand-700"
                          onClick={() => handlePresence(loc)}
                        >
                          Presensi{" "}
                          {loc.presence?.status == "" ? "Masuk" : "Pulang"}
                        </Button>
                      ) : loc.presence?.status != "hadir" &&
                        loc.presence?.status != "pulang" ? (
                        <Button
                          size="sm"
                          className="w-full dark:bg-green-700 dark:hover:bg-green-800 dark:border-green-800"
                          variant="success"
                          onClick={() => checkLocation(locationId)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2 justify-center">
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Memeriksa...
                            </span>
                          ) : (
                            "Cek Lokasi"
                          )}
                        </Button>
                      ) : loc.presence?.status == "hadir" ||
                        loc.presence?.status == "pulang" ? (
                        <div className="w-full flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg text-xs">
                          <span>Presensi hari ini sudah tercatat</span>
                          <span className="font-medium">✔</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}

              {!loading && (!locations || locations.length === 0) && (
                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm w-full">
                  <MapPin className="mx-auto size-12 text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tidak ada lokasi presensi
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Anda belum diberikan akses ke lokasi presensi manapun.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Presence;
