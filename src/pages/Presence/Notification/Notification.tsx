import { useState } from "react";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { Link } from "react-router";
import { BellRing, X } from "lucide-react";
import NotificationCard from "./NotifCard";
import PresenceController from "../../../controller/PresenceController";
import { Notification as NotificationInterface } from "../../../interface/NotificationInterface";
import { timeAgo } from "../../../helpers/timeAgo";

export default function Notification() {
  const presenceController = new PresenceController();

  const [data, setData] = useState<NotificationInterface[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const getNotif = async () => {
    try {
      const result = await presenceController.getByProcess();

      setData(result);
    } catch (err) {
      console.log(err);
    }
  };

  useState(() => {
    getNotif();
  });

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <BellRing size={18} />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-60 mt-4.25 flex h-120 w-87.5 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-90.25 lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifikasi
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X />
          </button>
        </div>
        <ul className="flex flex-col gap-2 h-auto overflow-y-auto custom-scrollbar">
          {data && data.length > 0 ? (
            data.map((item: NotificationInterface, index: number) => {
              return (
                <li key={index}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="rounded-2xl border border-gray-200 p-0 transition-all hover:border-brand-200 hover:shadow-md dark:border-gray-800"
                  >
                    <NotificationCard
                      category={item.type}
                      message={`Melakukan presensi ${item.type} pada pukul`}
                      messageChild={
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {new Date(item.created_at ?? "")
                            .toTimeString()
                            .slice(0, 5)}
                        </span>
                      }
                      location={
                        item.location_access?.description || "Balai Desa"
                      }
                      time={timeAgo(item.created_at ?? "")}
                    />
                  </DropdownItem>
                </li>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-white">
                Tidak ada notifikasi
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Aktivitas presensi terbaru akan muncul di sini.
              </p>
            </div>
          )}
        </ul>{" "}
        <Link
          to="/"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Lihat Semua Notifikasi
        </Link>
      </Dropdown>
    </div>
  );
}
