import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Navigation,
  Search,
  Filter,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";

import PresenceController from "../../../../controller/PresenceController";
import { Notification as NotificationInterface } from "../../../../interface/NotificationInterface";
import { timeAgo } from "../../../../helpers/timeAgo";
import { useNavigate } from "react-router";
import NotFound from "../../../../components/custom/NotFound";
import { catchHandle } from "../../../../helpers/catchHandle";

type FilterType = "all" | "masuk" | "pulang";

const categoryConfig = {
  masuk: {
    label: "Masuk",
    icon: Navigation,
    badge:
      "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20",
    iconBox:
      "bg-green-100 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20",
    glow: "group-hover:shadow-green-500/20",
  },

  pulang: {
    label: "Pulang",
    icon: ArrowUpRight,
    badge:
      "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
    iconBox:
      "bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/20",
    glow: "group-hover:shadow-orange-500/20",
  },
};

function Notification() {
  const navigate = useNavigate();

  const presenceController = new PresenceController();
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const getNotifications = async () => {
    try {
      setLoading(true);

      const result = await presenceController.getByProcess();

      setNotifications(result || []);
    } catch (err) {
      catchHandle({ err, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchFilter = filter === "all" ? true : item.type === filter;

      const matchSearch =
        item.location_access?.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.type?.toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [notifications, filter, search]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="relative overflow-hidden rounded-b-[2.5rem] bg-linear-to-r from-indigo-600 to-blue-600 px-5 pt-6 pb-18 shadow-2xl">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-5 flex items-center gap-2 text-sm text-white/90"
            >
              <ArrowLeft size={18} />
              Kembali
            </button>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-white">
              Notifikasi
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Pantau aktivitas presensi masuk dan pulang terbaru.
            </p>
          </div>
        </div>

        <div className="-mt-14 px-4">
          <div className="flex flex-col gap-4 rounded-3xl border border-gray-200/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Cari notifikasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                <Filter
                  size={16}
                  className="ml-2 text-gray-500 dark:text-gray-400"
                />

                {["all", "masuk", "pulang"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item as FilterType)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                      filter === item
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="grid gap-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gray-200 dark:bg-gray-700" />

                      <div className="flex-1">
                        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />

                        <div className="mt-3 h-3 w-52 rounded bg-gray-200 dark:bg-gray-700" />

                        <div className="mt-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="grid gap-4">
                {filteredNotifications.map((item, index) => {
                  const config = categoryConfig[item.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={index}
                      className={`group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/90 dark:hover:border-gray-700 ${config.glow}`}
                    >
                      {/* <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all duration-300 group-hover:bg-blue-500/10" /> */}

                      <div className="relative z-10 flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${config.iconBox}`}
                        >
                          <Icon size={24} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
                              >
                                {config.label}
                              </span>

                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock3 size={13} />
                                {timeAgo(item.created_at ?? "")}
                              </span>
                            </div>
                          </div>

                          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
                            Presensi {item.type}
                          </h3>

                          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            Melakukan presensi{" "}
                            <span className="font-semibold capitalize">
                              {item.type}
                            </span>{" "}
                            pada pukul{" "}
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {new Date(item.created_at ?? "")
                                .toTimeString()
                                .slice(0, 5)}
                            </span>
                          </p>

                          <div className="mt-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              📍{" "}
                              {item.location_access?.description ||
                                "Balai Desa"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <NotFound />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Notification;