import {
  ArrowLeft,
  Calendar,
  Clock3,
  LogIn,
  LogOut,
  MapPin,
  Navigation,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Presence } from "../../../interface/PresenceInterface";
import PresenceController from "../../../controller/PresenceController";
import { Toast } from "../../../components/ui/alert/Toast";
import { useEffect, useState } from "react";
import Map from "../../../components/custom/Map";
import { statusColor } from "../../../helpers/statusColor";

function RecordDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [detail, setDetail] = useState<Presence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const presenceController = new PresenceController();

  const getDetail = async () => {
    try {
      setLoading(true);
      const data = await presenceController.getById(
        id ?? "",
        localStorage.getItem("token") || "",
      );
      setDetail(data);
    } catch (err: unknown) {
      let message = "Internal Server Error";

      if (err instanceof Error) {
        message = err.message;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }

      Toast({
        message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-950 dark:to-blue-900 px-5 pt-6 pb-8 rounded-b-3xl shadow-lg text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm text-white/90"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>

          <div>
            <h1 className="text-xl font-semibold">Detail Presensi</h1>

            {loading && (
              <div className="animate-puls">
                <div className="h-4 w-28 bg-white/20 rounded"></div>
              </div>
            )}

            {!loading && (
              <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                <Calendar size={15} />
                {detail?.date?.split("T")[0]}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="px-4 -mt-4 space-y-5">
            <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-14 w-14 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>

                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>

                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>

              <div className="h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-5"></div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>

                <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
              </div>

              <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>

              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-5"></div>

              <div className="h-75 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>

              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
            </div>

            <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>

              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-5"></div>

              <div className="h-75 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>

              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-4"></div>
            </div>
          </div>
        )}

        {!loading && detail && (
          <div className="px-4 -mt-4 space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Clock3 size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white">
                    Informasi Presensi
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Detail waktu kehadiran
                  </p>
                </div>
              </div>

              <div
                className={`mb-5 rounded-2xl px-4 py-3 flex items-center justify-between ${statusColor(detail.status)}`}
              >
                <div>
                  <p className="text-xs opacity-80">Status Presensi</p>

                  <p className="font-semibold text-sm">
                    {detail.status != null
                      ? detail.status.charAt(0).toUpperCase() +
                        detail.status.slice(1).toLowerCase()
                      : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 p-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                    <LogIn size={18} />
                    <span className="text-sm font-medium">Jam Masuk</span>
                  </div>

                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {detail.in
                      ? new Date(detail.in).toTimeString().slice(0, 5)
                      : "-"}
                  </p>
                </div>
                <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-4">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Jam Pulang</span>
                  </div>

                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {detail.out
                      ? new Date(detail.out).toTimeString().slice(0, 5)
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-indigo-600" />

                  <span className="font-medium text-gray-800 dark:text-white">
                    Lokasi Presensi
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {detail.location_access?.description}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {detail.location_access?.location?.name}
                </p>
              </div>
            </div>

            {detail.in_lat && detail.in_long ? (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white">
                      Titik Masuk
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lokasi saat melakukan presensi masuk
                    </p>
                  </div>

                  <Navigation className="text-green-600 dark:text-green-400" />
                </div>

                <div className="px-5 pb-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <Map
                      lat={detail.in_lat}
                      long={detail.in_long}
                      animateMove={true}
                      className="h-75 w-full rounded-2xl z-0"
                    />
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    LAT: {detail.in_lat} | LNG: {detail.in_long}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {detail.out_lat && detail.out_long ? (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white">
                      Titik Pulang
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lokasi saat melakukan presensi pulang
                    </p>
                  </div>

                  <Navigation className="text-red-500 dark:text-red-400" />
                </div>

                <div className="px-5 pb-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <Map
                      lat={detail.out_lat}
                      long={detail.out_long}
                      animateMove={true}
                      className="h-75 w-full rounded-2xl z-0"
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    LAT: {detail.out_lat} | LNG: {detail.out_long}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordDetail;
