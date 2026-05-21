import { useEffect, useState } from "react";
import { Calendar, Filter,LogIn, LogOut, MapPin } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import PresenceController from "../../../controller/PresenceController";
import { Presence } from "../../../interface/PresenceInterface";
import { Toast } from "../../../components/ui/alert/Toast";
import { useNavigate } from "react-router";
import { statusColor } from "../../../helpers/statusColor";
import NotFound from "../../../components/custom/NotFound";

function Record() {
  const navigate = useNavigate();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [listYear, setListYear] = useState<number[]>([]);
  const [records, setRecords] = useState<Presence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const presenceController = new PresenceController();

  const getRecords = async () => {
    try {
      setLoading(true);
      const data = await presenceController.get(
        new Date(year, month, 1),
        localStorage.getItem("token") || "",
      );
      setRecords(data);
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

  const getFilters = () => {
    const yearData = Array.from(
      { length: new Date().getFullYear() - 2026 + 1 },
      (_, i) => 2026 + i,
    );
    setListYear(yearData);
  };

  useEffect(() => {
    getRecords();
    getFilters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-5 pt-6 pb-5 rounded-b-3xl shadow">
          <h1 className="text-lg font-semibold">Riwayat Presensi</h1>
          <p className="text-xs text-white/80">Informasi riwayat presensi</p>

          <div className="mt-4 bg-white/10 backdrop-blur p-3 rounded-xl flex gap-2 items-center">
            <Filter size={16} />

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-white text-gray-700 text-xs rounded px-2 py-1"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  Bulan {i + 1}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-white text-gray-700 text-xs rounded px-2 py-1"
            >
              {listYear?.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>

            <Button
              size="sm"
              className="ml-auto text-xs"
              variant="outline"
              onClick={() => {
                getRecords();
              }}
            >
              Terapkan
            </Button>
          </div>
        </div>

        <div className="px-4 mt-5 space-y-4">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}

          {!loading && records.length === 0 && <NotFound />}

          {!loading &&
            records.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm 
                hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {item.location_access?.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar size={14} />
                      {item.date?.split("T")[0]}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusColor(item.status)}`}
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <LogIn size={14} className="text-green-600" />
                    <div>
                      <p className="text-gray-500">Masuk</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {item.in != null
                          ? new Date(item.in).toTimeString().slice(0, 5)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <LogOut size={14} className="text-red-500" />
                    <div>
                      <p className="text-gray-500">Pulang</p>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {item.out != null
                          ? new Date(item.out).toTimeString().slice(0, 5)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-500 truncate">
                    <MapPin size={14} />
                    <span className="truncate max-w-40">
                      {item.location_access?.location?.name}
                    </span>
                  </div>

                  <button
                    className="flex items-center gap-1 text-blue-600 hover:text-indigo-600 transition"
                    onClick={() => navigate(`/record/detail/${item.id}`)}
                  >
                    Lihat
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Record;
