import { SearchAlert } from "lucide-react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center bg-white border rounded-2xl">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 to-blue-100 shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
        <SearchAlert size={34} className="text-blue-500" />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-gray-800 dark:text-white">
        Tidak Ada Data
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Belum ada data yang tersedia untuk ditampilkan saat ini.
      </p>
    </div>
  );
}

export default NotFound;