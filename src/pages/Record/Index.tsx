import { useEffect, useState } from "react";
import { Calendar, Filter, CheckCircle, LogIn, LogOut } from "lucide-react";
import Button from "../../components/ui/button/Button";

interface PresenceHistory {
  id: string;
  date: string;
  type: "IN" | "OUT";
  location: string;
  status: "hadir" | "terlambat" | "tidak hadir";
}

function Record() {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<PresenceHistory[]>([]);

  // dummy fetch (ganti ke API)
  const fetchData = async () => {
    // simulasi data
    setData([
      {
        id: "1",
        date: "2026-05-01",
        type: "IN",
        location: "Kantor Desa",
        status: "hadir",
      },
      {
        id: "2",
        date: "2026-05-01",
        type: "OUT",
        location: "Kantor Desa",
        status: "hadir",
      },
      {
        id: "3",
        date: "2026-05-02",
        type: "IN",
        location: "Balai Desa",
        status: "terlambat",
      },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex justify-center">
      <div className="w-full max-w-md md:max-w-4xl">
        {/* HEADER */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-5 pt-6 pb-10 rounded-b-3xl shadow">
          <h1 className="text-lg font-semibold">Riwayat Presensi</h1>

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
              {[2024, 2025, 2026].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>

            <Button size="sm" className="ml-auto text-xs">
              Terapkan
            </Button>
          </div>
        </div>

        <div className="px-4 mt-5 space-y-4">
          {data.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Tidak ada data presensi
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {item.location}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        item.type === "IN" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {item.type === "IN" ? (
                        <LogIn size={14} />
                      ) : (
                        <LogOut size={14} />
                      )}
                      {item.type === "IN" ? "Masuk" : "Pulang"}
                    </div>

                    <div className="mt-1 text-xs flex items-center gap-1 text-gray-500">
                      <CheckCircle size={14} />
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-4xl bg-white dark:bg-gray-800 border-t flex justify-around py-2">
        <button className="flex flex-col items-center text-xs text-gray-500">
          Presensi
        </button>
        <button className="flex flex-col items-center text-xs text-indigo-600">
          Riwayat
        </button>
        <button className="flex flex-col items-center text-xs text-gray-500">
          Setting
        </button>
      </div> */}
    </div>
  );
}

export default Record;
