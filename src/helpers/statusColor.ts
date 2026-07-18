export function statusColor(status: string) {
  const statusColor: Record<string, string> = {
    hadir: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    terlambat: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    alpa: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    cuti: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    pulang: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    libur: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
    tugas: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    masuk: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return statusColor[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}
